import { headers } from "next/headers";

export async function getServerPortfolioData() {
  const headersList = await headers();

  const host =
    headersList.get("host") || "localhost:3000";

  const protocol =
    process.env.NODE_ENV === "development"
      ? "http"
      : "https";

  const response = await fetch(
    `${protocol}://${host}/api/portfolio`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load portfolio data");
  }

  return response.json();
}