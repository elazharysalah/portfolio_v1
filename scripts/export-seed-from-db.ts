import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function esc(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");
}

async function main() {
  const [
    profile,
    settings,
    highlights,
    experiences,
    education,
    skillGroups,
    projects,
    gallery,
  ] = await Promise.all([
    prisma.profile.findUnique({ where: { id: "main" } }),
    prisma.siteSettings.findUnique({ where: { id: "main" } }),
    prisma.highlight.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.experience.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.education.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.skillGroup.findMany({
      orderBy: { sortOrder: "asc" },
      include: { skills: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.project.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.galleryImage.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  if (!profile || !settings) {
    throw new Error("Missing profile or settings — nothing to export.");
  }

  mkdirSync(join(process.cwd(), "content", "case-studies"), { recursive: true });

  const projectContentFiles: Record<string, string> = {};
  for (const project of projects) {
    if (project.content && project.content.trim()) {
      const slug = project.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const filename = `${slug || project.id}.html`;
      writeFileSync(
        join(process.cwd(), "content", "case-studies", filename),
        project.content,
        "utf8"
      );
      projectContentFiles[project.id] = filename;
    }
  }

  const seed = `import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function caseStudyHtml(filename: string) {
  const path = join(__dirname, "..", "content", "case-studies", filename);
  if (!existsSync(path)) return null;
  return readFileSync(path, "utf8");
}

async function main() {
  await prisma.accessRequest.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.skillGroup.deleteMany();
  await prisma.education.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.highlight.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.profile.deleteMany();

  await prisma.profile.create({
    data: {
      id: "main",
      name: ${JSON.stringify(profile.name)},
      title: ${JSON.stringify(profile.title)},
      email: ${JSON.stringify(profile.email)},
      phone: ${JSON.stringify(profile.phone)},
      location: ${JSON.stringify(profile.location)},
      bio: \`${esc(profile.bio)}\`,
      avatarUrl: ${JSON.stringify(profile.avatarUrl)},
      resumeUrl: ${JSON.stringify(profile.resumeUrl)},
      linkedinUrl: ${JSON.stringify(profile.linkedinUrl)},
      githubUrl: ${JSON.stringify(profile.githubUrl)},
      instagramUrl: ${JSON.stringify(profile.instagramUrl)},
      facebookUrl: ${JSON.stringify(profile.facebookUrl)},
      twitterUrl: ${JSON.stringify(profile.twitterUrl)},
      websiteUrl: ${JSON.stringify(profile.websiteUrl)},
      footerText: ${JSON.stringify(profile.footerText)},
    },
  });

  await prisma.siteSettings.create({
    data: {
      id: "main",
      aboutTitle: ${JSON.stringify(settings.aboutTitle)},
      highlightsTitle: ${JSON.stringify(settings.highlightsTitle)},
      featuredTitle: ${JSON.stringify(settings.featuredTitle)},
      featuredSubtitle: ${JSON.stringify(settings.featuredSubtitle)},
      resumeTitle: ${JSON.stringify(settings.resumeTitle)},
      experienceTitle: ${JSON.stringify(settings.experienceTitle)},
      educationTitle: ${JSON.stringify(settings.educationTitle)},
      skillsTitle: ${JSON.stringify(settings.skillsTitle)},
      portfolioTitle: ${JSON.stringify(settings.portfolioTitle)},
      contactTitle: ${JSON.stringify(settings.contactTitle)},
      contactDetailsTitle: ${JSON.stringify(settings.contactDetailsTitle)},
      contactFormTitle: ${JSON.stringify(settings.contactFormTitle)},
      galleryTitle: ${JSON.stringify(settings.galleryTitle)},
    },
  });

${
  highlights.length
    ? `  await prisma.highlight.createMany({
    data: ${JSON.stringify(
      highlights.map((h) => ({
        value: h.value,
        label: h.label,
        sortOrder: h.sortOrder,
      })),
      null,
      2
    )},
  });`
    : "  // no highlights"
}

  await prisma.experience.createMany({
    data: ${JSON.stringify(
      experiences.map((e) => ({
        company: e.company,
        role: e.role,
        location: e.location,
        period: e.period,
        description: e.description,
        sortOrder: e.sortOrder,
      })),
      null,
      2
    )},
  });

  await prisma.education.createMany({
    data: ${JSON.stringify(
      education.map((e) => ({
        institution: e.institution,
        degree: e.degree,
        period: e.period,
        description: e.description,
        sortOrder: e.sortOrder,
      })),
      null,
      2
    )},
  });

${skillGroups
  .map(
    (group) => `  await prisma.skillGroup.create({
    data: {
      name: ${JSON.stringify(group.name)},
      sortOrder: ${group.sortOrder},
      skills: {
        create: ${JSON.stringify(
          group.skills.map((s) => ({ name: s.name, sortOrder: s.sortOrder })),
          null,
          2
        )},
      },
    },
  });`
  )
  .join("\n\n")}

${projects
  .map((project) => {
    const file = projectContentFiles[project.id];
    const contentExpr = file
      ? `caseStudyHtml(${JSON.stringify(file)})`
      : project.content
        ? `\`${esc(project.content)}\``
        : "null";
    return `  await prisma.project.create({
    data: {
      title: ${JSON.stringify(project.title)},
      url: ${JSON.stringify(project.url)},
      description: ${JSON.stringify(project.description)},
      content: ${contentExpr},
      imageUrl: ${JSON.stringify(project.imageUrl)},
      featured: ${project.featured},
      accessMode: ${JSON.stringify(project.accessMode || "link")},
      sortOrder: ${project.sortOrder},
    },
  });`;
  })
  .join("\n\n")}

${
  gallery.length
    ? `  await prisma.galleryImage.createMany({
    data: ${JSON.stringify(
      gallery.map((g) => ({
        imageUrl: g.imageUrl,
        caption: g.caption,
        sortOrder: g.sortOrder,
      })),
      null,
      2
    )},
  });`
    : "  // no gallery images"
}

  console.log("Seed completed from local content export.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
`;

  writeFileSync(join(process.cwd(), "prisma", "seed.ts"), seed, "utf8");
  console.log(`Exported:
- profile, settings
- ${highlights.length} highlights
- ${experiences.length} experiences
- ${education.length} education
- ${skillGroups.length} skill groups
- ${projects.length} projects (${Object.keys(projectContentFiles).length} HTML files)
- ${gallery.length} gallery images`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
