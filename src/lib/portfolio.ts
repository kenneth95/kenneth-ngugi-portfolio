import { SKILL_ICONS } from "./skill-icons";

import { getSheetData } from "./google-sheets";

type Row = Record<string, string>;

function rowsToObjects(rows: string[][]): Row[] {
  if (!rows.length) return [];

  const headers = rows[0];

  return rows.slice(1).map((row) => {
    const object: Row = {};

    headers.forEach((header, index) => {
      object[header] = row[index] ?? "";
    });

    return object;
  });
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
  const rows = await getSheetData("Experience!A:L");

  return rowsToObjects(rows)
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
      logoUrl: item.logoUrl || "",
      start: item.start_date,
      end: item.end_date,
      description: item.description,
    }));
}

export async function getEducation() {
  const rows = await getSheetData("Education!A:K");

  return rowsToObjects(rows)
    .filter(isPublished)
    .sort((a, b) => Number(a.order) - Number(b.order))
    .map((item) => ({
      school: item.institution,
      href: item.href || "#",
      degree: `${item.degree}${item.field ? ` in ${item.field}` : ""}`,
      logoUrl: item.logoUrl || "",
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
  const rows = await getSheetData("Projects!A:N");

  return rowsToObjects(rows)
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
      image: item.image || "",
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