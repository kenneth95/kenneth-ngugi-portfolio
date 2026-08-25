import { NextResponse } from "next/server";
import { getBlogPostBySlug } from "@/lib/blog";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);

    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Blog post API error:", error);

    return NextResponse.json(
      {
        error: "Failed to load blog post",
      },
      { status: 500 }
    );
  }
}
