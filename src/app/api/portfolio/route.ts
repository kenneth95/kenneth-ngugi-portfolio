import { NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/data";

export async function GET() {
  try {
    const data = await getPortfolioData();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Portfolio API error:", error);

    return NextResponse.json(
      {
        error: "Failed to load portfolio data",
      },
      { status: 500 }
    );
  }
}