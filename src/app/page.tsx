import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Markdown from "react-markdown";
import ContactSection from "@/components/section/contact-section";
import HackathonsSection from "@/components/section/hackathons-section";
import ProjectsSection from "@/components/section/projects-section";
import WorkSection from "@/components/section/work-section";
import { LogoImage } from "@/components/logo-image";
import { ArrowUpRight } from "lucide-react";
import { getPortfolioData } from "@/lib/data";

const BLUR_FADE_DELAY = 0.04;

// Re-fetches Google Sheet data at most once per hour and serves a cached,
// statically-rendered page in between. This also means the page is no
// longer forced into fully-dynamic, per-request rendering (see note below),
// which makes it faster and more reliable for both visitors and search
// engine crawlers.
export const revalidate = 3600;

export default async function Page() {
  // Calls the data layer directly instead of making an HTTP request to our
  // own /api/portfolio route. The previous approach (via
  // getServerPortfolioData in server-portfolio.ts) called next/headers()
  // to build a self-referential fetch URL, which had two costs: it forced
  // this entire page out of static/ISR rendering into fully dynamic
  // per-request rendering, and it added an extra network round-trip to
  // itself on every single page load. On serverless hosting that round
  // trip can cold-start a second function invocation, and under load or
  // any latency from the Google Sheets API, this was a plausible cause of
  // intermittent failures/timeouts — which can show up as data (including
  // photos) simply not appearing. There was no technical reason for the
  // indirection here (unlike the blog's opengraph-image routes, which
  // genuinely need it because they run on the Edge runtime, where the
  // Node-only googleapis client can't run) — this route always ran on the
  // Node runtime, so calling the data layer directly is safe and removes
  // both problems.
  const DATA = await getPortfolioData();

  return (
    <main className="min-h-dvh flex flex-col gap-14 relative">
      {/* HERO */}
      <section id="hero">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="gap-2 gap-y-6 flex flex-col md:flex-row justify-between">
            <div className="gap-2 flex flex-col order-2 md:order-1">
              <BlurFadeText
                as="h1"
                delay={BLUR_FADE_DELAY}
                className="text-3xl font-semibold tracking-tighter sm:text-4xl lg:text-5xl"
                yOffset={8}
                text={`Hi, I'm ${DATA.name.split(" ")[0]}`}
              />

              <BlurFadeText
                as="p"
                className="text-muted-foreground max-w-[600px] md:text-lg lg:text-xl"
                delay={BLUR_FADE_DELAY}
                text={DATA.description}
              />
            </div>

            <BlurFade
              delay={BLUR_FADE_DELAY}
              className="order-1 md:order-2"
            >
              <Avatar className="size-24 md:size-32 border rounded-full shadow-lg ring-4 ring-muted">
                <AvatarImage
                  alt={DATA.name}
                  src={DATA.avatarUrl}
                />
                <AvatarFallback>
                  {DATA.initials}
                </AvatarFallback>
              </Avatar>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="flex min-h-0 flex-col gap-y-4">
          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <h2 className="text-xl font-bold">About</h2>
          </BlurFade>

          <BlurFade delay={BLUR_FADE_DELAY * 4}>
            <div className="prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
              <Markdown>
                {DATA.summary}
              </Markdown>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* WORK EXPERIENCE */}
      <section id="work">
        <div className="flex min-h-0 flex-col gap-y-6">
          <BlurFade delay={BLUR_FADE_DELAY * 5}>
            <h2 className="text-xl font-bold">
              Work Experience
            </h2>
          </BlurFade>

          <BlurFade delay={BLUR_FADE_DELAY * 6}>
            <WorkSection work={DATA.work} />
          </BlurFade>
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education">
        <div className="flex min-h-0 flex-col gap-y-6">
          <BlurFade delay={BLUR_FADE_DELAY * 7}>
            <h2 className="text-xl font-bold">
              Education
            </h2>
          </BlurFade>

          <div className="flex flex-col gap-8">
            {DATA.education.map((education, index) => (
              <BlurFade
                key={`${education.school}-${education.degree}`}
                delay={
                  BLUR_FADE_DELAY * 8 +
                  index * 0.05
                }
              >
                <Link
                  href={education.href || "#"}
                  target={
                    education.href && education.href !== "#"
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    education.href && education.href !== "#"
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="flex items-center gap-x-3 justify-between group"
                >
                  <div className="flex items-center gap-x-3 flex-1 min-w-0">
                    <LogoImage
                      src={education.logoUrl}
                      alt={education.school}
                    />

                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <div className="font-semibold leading-none flex items-center gap-2">
                        {education.school}

                        {education.href &&
                          education.href !== "#" && (
                            <ArrowUpRight
                              className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                              aria-hidden
                            />
                          )}
                      </div>

                      <div className="font-sans text-sm text-muted-foreground">
                        {education.degree}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs tabular-nums text-muted-foreground text-right flex-none">
                    <span>
                      {education.start} - {education.end}
                    </span>
                  </div>
                </Link>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills">
        <div className="flex min-h-0 flex-col gap-y-4">
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <h2 className="text-xl font-bold">
              Skills
            </h2>
          </BlurFade>

          <div className="flex flex-wrap gap-2">
            {DATA.skills.map((skill, id) => (
              <BlurFade
                key={skill.name}
                delay={
                  BLUR_FADE_DELAY * 10 +
                  id * 0.05
                }
              >
                <div className="border bg-background border-border ring-2 ring-border/20 rounded-xl h-8 w-fit px-4 flex items-center gap-2">
                  <span className="text-foreground text-sm font-medium">
                    {skill.name}
                  </span>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects">
        <BlurFade delay={BLUR_FADE_DELAY * 11}>
          <ProjectsSection
            projects={DATA.projects}
          />
        </BlurFade>
      </section>

      {/* HACKATHONS */}
      {DATA.hackathons &&
        DATA.hackathons.length > 0 && (
          <section id="hackathons">
            <BlurFade delay={BLUR_FADE_DELAY * 13}>
              <HackathonsSection
                hackathons={DATA.hackathons}
              />
            </BlurFade>
          </section>
        )}

      {/* CONTACT */}
      <section id="contact">
        <BlurFade delay={BLUR_FADE_DELAY * 16}>
          <ContactSection
            contact={DATA.contact}
          />
        </BlurFade>
      </section>
    </main>
  );
}