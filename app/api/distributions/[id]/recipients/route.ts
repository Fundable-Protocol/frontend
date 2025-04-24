import { NextRequest, NextResponse } from "next/server";
import { DistributionService } from "@/lib/actions/distributionService";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recipients = await DistributionService.getDistributionRecipients(
      params.id
    );
    return NextResponse.json({ recipients });
  } catch (error) {
    console.error("Error fetching distribution recipients:", error);
    return NextResponse.json(
      { error: "Failed to fetch distribution recipients" },
      { status: 500 }
    );
  }
}
