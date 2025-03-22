import { NextRequest, NextResponse } from "next/server";
import { DistributionService } from "@/lib/actions/distributionService";
import { z } from "zod";

const statsQuerySchema = z.object({
  user_address: z.string().optional()
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const validatedParams = statsQuerySchema.parse(Object.fromEntries(searchParams));
    
    const { user_address } = validatedParams;
    
    // Get basic stats
    const stats = await DistributionService.getDistributionStats(user_address);
    
    // If a user address is provided, get additional metrics (total amount, avg distribution)
    if (user_address) {
      // Get all distributions for this user (no pagination for calculations)
      const { distributions } = await DistributionService.getDistributionsByUser(user_address, 1, 1000);
      
      // Calculate total amount distributed (only completed distributions)
      const completedDistributions = distributions.filter(d => d.status === "COMPLETED");
      
      // Calculate total amount and group by token
      const tokenTotals: Record<string, { amount: number, count: number }> = {};
      
      completedDistributions.forEach(dist => {
        const amount = parseFloat(dist.total_amount.toString());
        if (!tokenTotals[dist.token_symbol]) {
          tokenTotals[dist.token_symbol] = { amount: 0, count: 0 };
        }
        tokenTotals[dist.token_symbol].amount += amount;
        tokenTotals[dist.token_symbol].count += 1;
      });
      
      // Calculate average amount per distribution by token
      const tokenAverages: Record<string, number> = {};
      Object.entries(tokenTotals).forEach(([token, data]) => {
        tokenAverages[token] = data.count > 0 ? data.amount / data.count : 0;
      });
      
      // Calculate total recipients
      const totalRecipients = completedDistributions.reduce((sum, dist) => sum + dist.total_recipients, 0);
      
      // Add metrics to response
      return NextResponse.json({
        ...stats,
        totalAmountByToken: tokenTotals,
        averageByToken: tokenAverages,
        totalRecipients
      });
    }
    
    // Return basic stats if no user_address
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching distribution stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch distribution statistics" },
      { status: 500 }
    );
  }
} 