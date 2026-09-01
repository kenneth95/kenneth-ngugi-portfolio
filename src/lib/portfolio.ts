import { SKILL_ICONS } from "./skill-icons";

import { getSheetData, getSheetDataAsFormulas } from "./google-sheets";

type Row = Record<string, string>;

// Column headers that are expected to hold a photo. Cells under these
// headers get resolved through resolveImageValue() (see below) instead of
// being read as plain text, since photo cells may contain an `=IMAGE()`
// formula rather than a literal URL.
const PHOTO_COLUMNS = new Set([
  "work_experience_photo",
  "education_photo",
  "project_photo",
  // kept for backwards compatibility with older sheets that used these
  // column names before the photo columns existed
  "logoUrl",
  "image",
]);

/**
 * Resolves a raw sheet cell value into a usable image URL.
 * Handles, in order:
 *  1. An `=IMAGE("url", ...)` formula (only visible when the cell was
 *     fetched with valueRenderOption: FORMULA).
 *  2. A plain http(s) URL typed/pasted directly into the cell.
 *  3. A Google Drive "file/d/<id>/view" share link, converted into a
 *     directly-loadable image URL.
 * Returns "" if none of the above match (including the case where a
 * picture was inserted natively into the cell via Sheets' "Insert image in
 * cell" feature — that path is not exposed by the Sheets API at all, so
 * there is nothing here to recover).
 */
function resolveImageValue(rawValue: string | undefined): string {
  if (!rawValue) return "";

  const value = rawValue.trim();
  if (!value) return "";

  const imageFormulaMatch = value.match(/^=image\(\s*"([^"]+)"/i);
  if (imageFormulaMatch) {
    return imageFormulaMatch[1].trim();
  }

  if (/^https?:\/\//i.test(value)) {
    const driveMatch = value.match(
      /drive\.google\.com\/file\/d\/([^/]+)/i
    );
    if (driveMatch) {
      return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
    }

    return value;
  }

  return "";
}

/**
 * Builds row objects from a sheet range, merging in formula-rendered values
 * for any column listed in PHOTO_COLUMNS so that `=IMAGE("url")` cells
 * resolve to a real URL instead of showing up blank.
 */
function rowsToObjects(rows: string[][], formulaRows: string[][] = []): Row[] {
  if (!rows.length) return [];

  const headers = rows[0];

  return rows.slice(1).map((row, rowIndex) => {
    const object: Row = {};
    const formulaRow = formulaRows[rowIndex + 1] ?? [];

    headers.forEach((header, index) => {
      const rawValue = row[index] ?? "";

      if (PHOTO_COLUMNS.has(header)) {
        const formulaValue = formulaRow[index] ?? "";
        object[header] =
          resolveImageValue(formulaValue) || resolveImageValue(rawValue);
      } else {
        object[header] = rawValue;
      }
    });

    return object;
  });
}

/**
 * Fetches a sheet range twice — once normally, once with formulas exposed —
 * and merges them via rowsToObjects so photo columns resolve correctly.
 */
async function getRowsWithPhotos(range: string): Promise<Row[]> {
  const [rows, formulaRows] = await Promise.all([
    getSheetData(range),
    getSheetDataAsFormulas(range),
  ]);

  return rowsToObjects(rows, formulaRows);
}

function isPublished(row: Row) {
  return row.published?.toUpperCase() === "TRUE";
}

export async function getProfile() {
  const rows = await getSheetData("Profile!A:B");

  const profile: Record<string, string> = {};

  for (const row of rows.slice(1)) {
    const [field, value] = row;

    if (field) {
      profile[field] = value ?? "";
    }
  }

  return profile;
}

export async function getWork() {
  // Range widened to Z so any newly-added column (e.g. work_experience_photo
  // appended after existing columns) is still included in the fetch — a
  // narrower range like A:L silently drops any column past L.
  const rows = await getRowsWithPhotos("Experience!A:Z");

  return rows
    .filter(isPublished)
    .sort((a, b) => Number(a.order) - Number(b.order))
    .map((item) => ({
      company: item.company,
      href: item.href || "#",
      badges: item.badges
        ? item.badges.split(",").map((badge) => badge.trim())
        : [],
      location: item.location || "Remote",
      title: item.position,
      logoUrl: item.work_experience_photo || item.logoUrl || "",
      start: item.start_date,
      end: item.end_date,
      description: item.description,
    }));
}

export async function getEducation() {
  const rows = await getRowsWithPhotos("Education!A:Z");

  return rows
    .filter(isPublished)
    .sort((a, b) => Number(a.order) - Number(b.order))
    .map((item) => ({
      school: item.institution,
      href: item.href || "#",
      degree: `${item.degree}${item.field ? ` in ${item.field}` : ""}`,
      logoUrl: item.education_photo || item.logoUrl || "",
      start: item.start_year || "",
      end: item.end_year || "Present",
    }));
}

export async function getSkills() {
  const rows = await getSheetData("Skills!A:F");

  return rowsToObjects(rows)
    .filter(isPublished)
    .sort((a, b) => Number(a.order) - Number(b.order))
    .map((item) => ({
      name: item.skill,
      icon:
        SKILL_ICONS[
          item.icon?.toLowerCase() as keyof typeof SKILL_ICONS
        ],
    }));
}

export async function getProjects() {
  const rows = await getRowsWithPhotos("Projects!A:Z");

  return rows
    .filter(isPublished)
    .sort((a, b) => Number(a.order) - Number(b.order))
    .map((item) => ({
      title: item.title,
      href: item.project_url || "#",
      dates: item.dates || "",
      active: item.active?.toUpperCase() === "TRUE",
      description: item.description || item.short_description || "",
      technologies: item.technologies
        ? item.technologies
            .split(",")
            .map((technology) => technology.trim())
        : [],
      links: item.project_url
        ? [
            {
              type: "Website",
              href: item.project_url,
            },
          ]
        : [],
      image: item.project_photo || item.image || "",
      video: item.video || "",
    }));
}

export async function getCertifications() {
  const rows = await getSheetData("Certifications!A:H");

  return rowsToObjects(rows)
    .filter(isPublished)
    .sort((a, b) => Number(a.order) - Number(b.order));
}

export async function getServices() {
  const rows = await getSheetData("Services!A:I");

  return rowsToObjects(rows)
    .filter(isPublished)
    .sort((a, b) => Number(a.order) - Number(b.order));
}

export async function getSocialLinks() {
  const rows = await getSheetData("Social!A:F");

  return rowsToObjects(rows)
    .filter(isPublished)
    .sort((a, b) => Number(a.order) - Number(b.order));
}

export type BlogPost = {
  slug: string;
  title: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  summary: string;
  image: string;
  content: string;
};

export async function getPosts(): Promise<BlogPost[]> {
  const rows = await getSheetData("Blog!A:J");

  return rowsToObjects(rows)
    .filter(isPublished)
    .filter((item) => Boolean(item.slug))
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
    .map((item) => ({
      slug: item.slug,
      title: item.title,
      publishedAt: item.publishedAt,
      updatedAt: item.updatedAt || item.publishedAt,
      author: item.author || "",
      summary: item.summary || "",
      image: item.image || "",
      content: item.content || "",
    }));
}