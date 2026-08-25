<div align="center">
  <h1>Kenneth Ngugi — Portfolio</h1>
  <p>Live at <a href="https://ngugi.co.ke">ngugi.co.ke</a></p>
</div>

# Kenneth Ngugi - Personal Portfolio

Welcome to the source code for my personal portfolio, live at **[ngugi.co.ke](https://ngugi.co.ke)**. Built as a modern, high-performance developer portfolio using Next.js, [Shadcn/ui](https://ui.shadcn.com/), and [Magic UI](https://magicui.design/), and deployed on Vercel.

---

## ✨ Features & Architecture

<<<<<<< HEAD
- **Google Sheets Headless CMS:** All dynamic site content—including project data, experience, metadata, and blog posts—is securely fetched and managed directly via a structured Google Sheet. This allows for instant, code-free updates without requiring a full redeployment.
=======
- **Google Sheets Headless CMS:** All dynamic site content—including project data, experience, and metadata—is securely fetched and managed directly via a structured Google Sheet. This allows for instant, code-free updates without requiring a full redeployment.
>>>>>>> 8763a411640a1b5a95e457f4fba58658b14dfab4
- **Modern Tech Stack:** Built with Next.js, React, TypeScript, Tailwind CSS, Framer Motion, and Magic UI components.
- **Optimized Performance:** Features pre-rendered dynamic data fetching fine-tuned for Next.js and Vercel hosting.
- **Fully Responsive:** Seamless layout optimized across mobile, tablet, and desktop viewports.
- **Integrated Blog & Resume Sections:** Clean UI layouts for displaying technical background and writings.

---

<<<<<<< HEAD
## 📝 Managing Blog Posts via Google Sheets

Blog posts live in a **`Blog`** tab in the same Google Sheet that powers the rest of the site (`GOOGLE_SHEET_ID`). Add one row per post with these columns, in this order:

| Column        | Required | Notes                                                            |
| ------------- | -------- | ----------------------------------------------------------------|
| `order`       | No       | Number used for tie-breaking; posts are ultimately sorted by `publishedAt` on the site. |
| `published`   | Yes      | Must be exactly `TRUE` for the post to appear on the site.       |
| `slug`        | Yes      | URL path, e.g. `my-first-post` → `/blog/my-first-post`. Must be unique. |
| `title`       | Yes      | Post title.                                                      |
| `publishedAt` | Yes      | Date string, e.g. `2025-01-15`. Used for sorting and display.    |
| `updatedAt`   | No       | Falls back to `publishedAt` if left blank.                       |
| `author`      | No       | Shown under the post title if provided.                          |
| `summary`     | Yes      | Used for the meta description and social share previews.         |
| `image`       | No       | Absolute URL or a path under `/public` (e.g. `/blog-cover.png`). Used for Open Graph/Twitter cards. |
| `content`     | Yes      | The post body, written in **Markdown** (headings, bold/italic, links, lists, tables, fenced code blocks, images). |

A few notes:
- To write a multi-line `content` cell in Google Sheets, use <kbd>Alt</kbd>+<kbd>Enter</kbd> (Windows) or <kbd>⌥</kbd>+<kbd>Return</kbd> (Mac) for line breaks within the cell.
- Plain Markdown is supported — not MDX/JSX — since the content comes from a spreadsheet cell rather than a compiled file.
- Posts are cached with Next.js ISR (`revalidate = 3600`), so changes in the sheet appear within about an hour without a redeploy. Redeploying also picks up changes immediately.
- The original `content/*.mdx` files and `content-collections` setup are still present in the repo but are no longer used by the blog UI — they can be safely removed if you don't need them elsewhere.

---

=======
>>>>>>> 8763a411640a1b5a95e457f4fba58658b14dfab4
## 🚀 Getting Started Locally

If you want to run or adapt this codebase for your own projects, follow these steps:

1. **Clone this repository:**
   ```bash
   git clone [https://github.com/kenneth95/kenneth-ngugi-portfolio.git](https://github.com/kenneth95/kenneth-ngugi-portfolio.git)
   cd kenneth-ngugi-portfolio
