// app/api/wallets/route.ts
import { NextRequest, NextResponse } from "next/server";
import { DistributionService } from "@/lib/actions/distributionService";
import { z } from "zod";

const distributionQuerySchema = z.object({
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  status: z.enum(["COMPLETED", "FAILED", "PENDING"]).optional(),
  user_address: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const validatedParams = distributionQuerySchema.parse(Object.fromEntries(searchParams));
    
    const { page = 1, limit = 10, status, user_address } = validatedParams;

    if (user_address) {
      const result = await DistributionService.getDistributionsByUser(user_address, page, limit);
      return NextResponse.json(result);
    }

    const result = await DistributionService.getAllDistributions(page, limit, status);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching distributions:", error);
    return NextResponse.json(
      { error: "Failed to fetch distributions" },
      { status: 500 }
    );
  }
}

const createDistributionSchema = z.object({
  user_address: z.string(),
  token_address: z.string(),
  token_symbol: z.string(),
  token_decimals: z.number(),
  total_amount: z.string(),
  fee_amount: z.string(),
  transaction_hash: z.string().optional(),
  status: z.enum(["COMPLETED", "FAILED", "PENDING"]),
  total_recipients: z.number(),
  distribution_type: z.enum(["EQUAL", "WEIGHTED"]),
  network: z.enum(["MAINNET", "TESTNET"]),
  metadata: z.record(z.any()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createDistributionSchema.parse(body);
    console.log("Validated data:", validatedData);
    
    const distribution = await DistributionService.createDistribution(validatedData);
    return NextResponse.json(distribution, { status: 201 });
  } catch (error) {
    console.error("Error creating distribution:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid distribution data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create distribution" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "Distribution ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const distribution = await DistributionService.updateDistribution(id, body);
    return NextResponse.json(distribution);
  } catch (error) {
    console.error("Error updating distribution:", error);
    return NextResponse.json(
      { error: "Failed to update distribution" },
      { status: 500 }
    );
  }
}
