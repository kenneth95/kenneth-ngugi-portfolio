import { cache } from "react";
import { getPosts, type BlogPost } from "./portfolio";

export type { BlogPost };

/**
 * Fetches every published post from the "Blog" tab of the Google Sheet and
 * sorts them newest first. Wrapped in React's `cache()` so multiple calls
 * within the same request (e.g. generateMetadata + the page component)
 * only hit the Sheets API once.
 */
export const getAllBlogPosts = cache(async (): Promise<BlogPost[]> => {
  const posts = await getPosts();

  return [...posts].sort((a, b) => {
    if (new Date(a.publishedAt) > new Date(b.publishedAt)) {
      return -1;
    }
    return 1;
  });
});

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | undefined> {
  const posts = await getAllBlogPosts();

  return posts.find((post) => post.slug === slug);
}
