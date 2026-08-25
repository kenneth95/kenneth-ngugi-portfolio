import { headers } from "next/headers";
import type { BlogPost } from "./blog";

async function getBaseUrl() {
  const headersList = await headers();

  const host = headersList.get("host") || "localhost:3000";

  const protocol =
    process.env.NODE_ENV === "development" ? "http" : "https";

  return `${protocol}://${host}`;
}

/**
 * These fetch through our own /api/blog routes (rather than calling the
 * Google Sheets client directly) because they're consumed from Edge
 * runtime routes (e.g. opengraph-image.tsx), and the googleapis Node
 * client isn't Edge-compatible.
 */
export async function getServerBlogPosts(): Promise<BlogPost[]> {
  const baseUrl = await getBaseUrl();

  const response = await fetch(`${baseUrl}/api/blog`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load blog posts");
  }

  return response.json();
}

export async function getServerBlogPost(
  slug: string
): Promise<BlogPost | null> {
  const baseUrl = await getBaseUrl();

  const response = await fetch(`${baseUrl}/api/blog/${slug}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to load blog post");
  }

  return response.json();
}
