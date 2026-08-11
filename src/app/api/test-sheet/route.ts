import { NextResponse } from "next/server";
import { getServerPortfolioData } from "@/lib/server-portfolio";

export async function GET() {
  try {
    const data = await getServerPortfolioData();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Test sheet error:", error);

    return NextResponse.json(
      {
        error: "Failed to load portfolio data",
        details: String(error),
      },
      { status: 500 }
    );
  }
}