import { readFileSync } from "fs";
import { join } from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function caseStudyHtml(filename: string) {
  return readFileSync(join(__dirname, "..", "content", "case-studies", filename), "utf8");
}

async function main() {
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
      name: "Salah Eddine El-Azhary",
      title: "Software Engineer",
      email: "salah9azhary9@gmail.com",
      phone: "+212-675105556",
      location: "Casablanca, MA",
      bio: `<p>I'm <strong>Salah Eddine El-Azhary</strong>, a <span class="accent">Software Engineer</span> based in Casablanca, Morocco. Passionate about backend development, API design, and building scalable systems that solve real-world problems.</p>
<p>I bring experience in requirements analysis, technical solution design, and application observability. I have interned at <span class="accent">The Game Changer Company</span>, Rawnaq Al-Madina, and PC Limited, and I'm currently studying Software Engineering at the National School of Electricity and Mechanics (ENSEM).</p>
<p>Motivated to contribute to high-impact projects and continue growing in a professional environment.</p>`,
      avatarUrl: "/uploads/avatar-placeholder.svg",
      resumeUrl: "/uploads/resume.pdf",
      linkedinUrl: "https://www.linkedin.com/in/salah-eddine-el-azhary",
      githubUrl: "https://github.com/elazharysalah",
      footerText: "© 2026 Salah Eddine El-Azhary | All Rights Reserved",
    },
  });

  await prisma.siteSettings.create({
    data: {
      id: "main",
      featuredTitle: "Case Study",
      featuredSubtitle: "Selected ventures and product stories.",
    },
  });

  await prisma.experience.createMany({
    data: [
      {
        company: "The Game Changer Company",
        role: "Full-Stack Intern",
        location: "Casablanca · On-site",
        period: "2026",
        description:
          "Designed an observability system for the multi-tenant architecture of Gamitool, covering performance, reliability, and maintainability KPIs, plus incident detection and management.",
        sortOrder: 0,
      },
      {
        company: "Rawnaq Al-Madina",
        role: "Full-Stack Intern",
        location: "Saudi Arabia · Remote",
        period: "2025",
        description:
          "Developed RESTful APIs and AWS integration; optimized MongoDB and SEO (+6% in 30 days).",
        sortOrder: 1,
      },
      {
        company: "PC Limited",
        role: "Backend Intern",
        location: "Saudi Arabia · Remote",
        period: "2024",
        description:
          "Built secure APIs (JWT, bcrypt), real-time chat, and Node.js/Express data pipelines.",
        sortOrder: 2,
      },
    ],
  });

  await prisma.education.createMany({
    data: [
      {
        institution: "National School of Electricity and Mechanics (ENSEM)",
        degree: "Software Engineering Student",
        period: "2023–2026",
        description: null,
        sortOrder: 0,
      },
      {
        institution: "Ibn Taymia",
        degree: "Preparatory Cycle",
        period: "2021–2023",
        description: null,
        sortOrder: 1,
      },
      {
        institution: "Mathematical Sciences A",
        degree: "Baccalaureate",
        period: "2021",
        description: null,
        sortOrder: 2,
      },
    ],
  });

  const groups = [
    { name: "Languages", skills: ["JavaScript", "Python"], sortOrder: 0 },
    {
      name: "Frontend",
      skills: ["React", "Bootstrap", "Tailwind", "HTML", "CSS", "jQuery"],
      sortOrder: 1,
    },
    { name: "Backend", skills: ["Node.js", "Express.js"], sortOrder: 2 },
    { name: "Databases", skills: ["MongoDB", "MySQL"], sortOrder: 3 },
    { name: "Cloud", skills: ["AWS", "DigitalOcean"], sortOrder: 4 },
    {
      name: "DevOps",
      skills: ["Git", "Docker", "Prometheus", "Grafana", "Elasticsearch"],
      sortOrder: 5,
    },
    { name: "Testing", skills: ["Jest"], sortOrder: 6 },
  ];

  for (const group of groups) {
    await prisma.skillGroup.create({
      data: {
        name: group.name,
        sortOrder: group.sortOrder,
        skills: {
          create: group.skills.map((name, i) => ({
            name,
            sortOrder: i,
          })),
        },
      },
    });
  }

  await prisma.project.createMany({
    data: [
      {
        title: "Pinterest AI Content Filter",
        url: "https://github.com/elazharysalah",
        description:
          "Browser extension for automatic detection of AI-generated images on Pinterest (+2000 users).",
        content: caseStudyHtml("pinterest-ai-content-filter.html"),
        imageUrl: "/uploads/project-placeholder.svg",
        featured: true,
        sortOrder: 0,
      },
      {
        title: "AI Tools Box",
        url: "https://github.com/elazharysalah",
        description:
          "App for automatic generation of SEO articles and Pinterest pins.",
        content: `<p><strong>Problem.</strong> Marketers spend too much time drafting SEO content and pin creatives.</p>
<p><strong>Approach.</strong> Packaged generation workflows into one simple AI toolkit.</p>
<p><strong>Outcome.</strong> Faster content production with a reusable product foundation for future SaaS features.</p>`,
        imageUrl: "/uploads/project-placeholder.svg",
        featured: true,
        sortOrder: 1,
      },
      {
        title: "AI Computer Troubleshooting",
        url: "https://github.com/elazharysalah",
        description:
          "AI-guided troubleshooting experience powered by the DeepSeek API.",
        content: `<p><strong>Problem.</strong> Non-technical users get stuck diagnosing common computer issues.</p>
<p><strong>Approach.</strong> Guided conversational troubleshooting powered by the DeepSeek API.</p>
<p><strong>Outcome.</strong> A clear product pattern for AI-assisted support experiences.</p>`,
        imageUrl: "/uploads/project-placeholder.svg",
        featured: false,
        sortOrder: 2,
      },
    ],
  });

  await prisma.galleryImage.createMany({
    data: [
      {
        imageUrl: "/uploads/gallery-1.svg",
        caption: "Observability & systems",
        sortOrder: 0,
      },
      {
        imageUrl: "/uploads/gallery-2.svg",
        caption: "API design",
        sortOrder: 1,
      },
      {
        imageUrl: "/uploads/gallery-3.svg",
        caption: "Full-stack craft",
        sortOrder: 2,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed completed.");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
