import { NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/portfolio";

export async function GET() {
  try {
    const data = await getPortfolioData();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load portfolio data",
      },
      { status: 500 }
    );
  }
}