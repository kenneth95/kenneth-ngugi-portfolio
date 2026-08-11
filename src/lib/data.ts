import { getProfile } from "./portfolio";
import { getWork } from "./portfolio";
import { getEducation } from "./portfolio";
import { getSkills } from "./portfolio";
import { getProjects } from "./portfolio";
import { getSocialLinks } from "./portfolio";

export async function getPortfolioData() {
  const [
    profile,
    work,
    education,
    skills,
    projects,
    social,
  ] = await Promise.all([
    getProfile(),
    getWork(),
    getEducation(),
    getSkills(),
    getProjects(),
    getSocialLinks(),
  ]);

  return {
    name: profile.name,
    initials:
      profile.name
        ?.split(" ")
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "KN",

    url: profile.website,

    location: profile.location,

    locationLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      profile.location
    )}`,

    description: profile.hero_description,

    summary: profile.about,

    avatarUrl: profile.profile_image,

    skills,

    work,

    education,

    projects,

    hackathons: [],

    navbar: [],

    contact: {
      email: profile.email,
      tel: profile.phone,
      social: {},
    },
  };
}