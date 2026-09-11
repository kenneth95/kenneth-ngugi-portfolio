import type { MetadataRoute } from "next";
import { DATA } from "@/data/resume";
import { getAllBlogPosts } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = DATA.url.replace(/\/$/, "");

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  let posts: MetadataRoute.Sitemap = [];

  try {
    const blogPosts = await getAllBlogPosts();

    posts = blogPosts
      .filter((post) => Boolean(post.slug))
      .map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt
          ? new Date(post.updatedAt)
          : post.publishedAt
            ? new Date(post.publishedAt)
            : new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      }));
  } catch (error) {
    // If the sheet is temporarily unreachable, still return the static
    // routes rather than failing the whole sitemap.
    console.error("Failed to load blog posts for sitemap:", error);
  }

  return [...staticRoutes, ...posts];
}
