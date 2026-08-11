import { headers } from "next/headers";
import type { ReactNode } from "react";

export type Education = {
  school: string;
  href: string;
  degree: string;
  logoUrl: string;
  start: string;
  end: string;
};

export type Skill = {
  name: string;
};

export type Work = {
  company: string;
  href: string;
  badges: string[];
  location: string;
  title: string;
  logoUrl: string;
  start: string;
  end: string;
  description: string;
};

export type ProjectLink = {
  type: string;
  href: string;
};

export type Project = {
  title: string;
  href: string;
  dates: string;
  active: boolean;
  description: string;
  technologies: string[];
  links: ProjectLink[];
  image: string;
  video: string;
};

export type HackathonLink = {
  title: string;
  href: string;
  icon?: ReactNode;
};

export type Hackathon = {
  title: string;
  dates: string;
  location: string;
  description: string;
  image: string;
  links: HackathonLink[];
};

export type Contact = {
  email?: string;
  tel?: string;
  social?: Record<string, unknown>;
};

export type PortfolioData = {
  name: string;
  initials: string;
  url: string;
  location: string;
  locationLink: string;
  description: string;
  summary: string;
  avatarUrl: string;
  skills: Skill[];
  work: Work[];
  education: Education[];
  projects: Project[];
  hackathons: Hackathon[];
  navbar: unknown[];
  contact: Contact;
};

export async function getServerPortfolioData(): Promise<PortfolioData> {
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