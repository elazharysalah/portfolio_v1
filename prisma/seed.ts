import { readFileSync, existsSync } from "fs";
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
      name: "Salah Eddine El-Azhary",
      title: "Software Engineer",
      email: "salah9azhary9@gmail.com",
      phone: "+212-675105556",
      location: "Marrakech, MA",
      bio: `<p>I'm <strong> Salah Eddine El-Azhary</strong>, a <span class="accent">Software Engineer </span> based in Marrakech, Morocco, passionate about building scalable systems that solve real-world problems.<p>

<p>I have experience in requirements analysis, technical solution design, backend development, and application observability. I have worked on projects across different industries, including gaming, interior decoration, and technology, through my experiences at The Game Changer Company, Rawnaq Al-Madina, and PC Limited.<p>

<p>I'm motivated by challenging problems and opportunities to build and contribute to high-impact projects.<p>

<p>Outside of software engineering, I'm obsessed with solving mathematics problems. I enjoy finding ways to integrate mathematical thinking into my projects and the way I approach building solutions. For me, mathematics is not just a hobby it's a way of thinking that sometimes becomes part of the building process itself.<p>`,
      avatarUrl: "/uploads/1789464729973-tck8496auwb.jpg",
      resumeUrl: "/uploads/resume.pdf",
      linkedinUrl: "https://www.linkedin.com/in/salah-eddine-el-azhary",
      githubUrl: "https://github.com/elazharysalah",
      instagramUrl: null,
      facebookUrl: null,
      twitterUrl: null,
      websiteUrl: null,
      footerText: "© 2026 Salah Eddine El-Azhary | All Rights Reserved",
    },
  });

  await prisma.siteSettings.create({
    data: {
      id: "main",
      aboutTitle: "Digital Identity",
      highlightsTitle: "Highlights & Successes",
      featuredTitle: "Case Study",
      featuredSubtitle: "Selected ventures and product stories.",
      resumeTitle: "Career Snapshot",
      experienceTitle: "Experience",
      educationTitle: "Education",
      skillsTitle: "My skills",
      portfolioTitle: "Creative Showcase",
      contactTitle: "Let's Connect",
      contactDetailsTitle: "Contact Details",
      contactFormTitle: "Contact Form",
      galleryTitle: "Pixels & Passion",
    },
  });

  // no highlights

  await prisma.experience.createMany({
    data: [
  {
    "company": "The Game Changer Company",
    "role": "Full-Stack Intern",
    "location": "Casablanca · On-site",
    "period": "2026",
    "description": "Designed an observability system for the multi-tenant architecture of Gamitool, covering performance, reliability, and maintainability KPIs, plus incident detection and management.",
    "sortOrder": 0
  },
  {
    "company": "Rawnaq Al-Madina",
    "role": "Full-Stack Intern",
    "location": "Saudi Arabia · Remote",
    "period": "2025",
    "description": "Developed RESTful APIs and AWS integration; optimized MongoDB and SEO (+6% in 30 days).",
    "sortOrder": 1
  },
  {
    "company": "PC Limited",
    "role": "Backend Intern",
    "location": "Saudi Arabia · Remote",
    "period": "2024",
    "description": "Built secure APIs (JWT, bcrypt), real-time chat, and Node.js/Express data pipelines.",
    "sortOrder": 2
  }
],
  });

  await prisma.education.createMany({
    data: [
  {
    "institution": "National School of Electricity and Mechanics (ENSEM)",
    "degree": "Software Engineering Student",
    "period": "2023–2026",
    "description": null,
    "sortOrder": 0
  },
  {
    "institution": "Ibn Taymia",
    "degree": "Preparatory Cycle",
    "period": "2021–2023",
    "description": null,
    "sortOrder": 1
  },
  {
    "institution": "Mathematical Sciences A",
    "degree": "Baccalaureate",
    "period": "2021",
    "description": null,
    "sortOrder": 2
  }
],
  });

  await prisma.skillGroup.create({
    data: {
      name: "Languages",
      sortOrder: 0,
      skills: {
        create: [
  {
    "name": "JavaScript",
    "sortOrder": 0
  },
  {
    "name": "Python",
    "sortOrder": 1
  }
],
      },
    },
  });

  await prisma.skillGroup.create({
    data: {
      name: "Frontend",
      sortOrder: 1,
      skills: {
        create: [
  {
    "name": "React",
    "sortOrder": 0
  },
  {
    "name": "Bootstrap",
    "sortOrder": 1
  },
  {
    "name": "Tailwind",
    "sortOrder": 2
  },
  {
    "name": "HTML",
    "sortOrder": 3
  },
  {
    "name": "CSS",
    "sortOrder": 4
  },
  {
    "name": "jQuery",
    "sortOrder": 5
  }
],
      },
    },
  });

  await prisma.skillGroup.create({
    data: {
      name: "Backend",
      sortOrder: 2,
      skills: {
        create: [
  {
    "name": "Node.js",
    "sortOrder": 0
  },
  {
    "name": "Express.js",
    "sortOrder": 1
  }
],
      },
    },
  });

  await prisma.skillGroup.create({
    data: {
      name: "Databases",
      sortOrder: 3,
      skills: {
        create: [
  {
    "name": "MongoDB",
    "sortOrder": 0
  },
  {
    "name": "MySQL",
    "sortOrder": 1
  }
],
      },
    },
  });

  await prisma.skillGroup.create({
    data: {
      name: "Cloud",
      sortOrder: 4,
      skills: {
        create: [
  {
    "name": "AWS",
    "sortOrder": 0
  },
  {
    "name": "DigitalOcean",
    "sortOrder": 1
  }
],
      },
    },
  });

  await prisma.skillGroup.create({
    data: {
      name: "DevOps",
      sortOrder: 5,
      skills: {
        create: [
  {
    "name": "Git",
    "sortOrder": 0
  },
  {
    "name": "Docker",
    "sortOrder": 1
  },
  {
    "name": "Prometheus",
    "sortOrder": 2
  },
  {
    "name": "Grafana",
    "sortOrder": 3
  },
  {
    "name": "Elasticsearch",
    "sortOrder": 4
  }
],
      },
    },
  });

  await prisma.skillGroup.create({
    data: {
      name: "Testing",
      sortOrder: 6,
      skills: {
        create: [
  {
    "name": "Jest",
    "sortOrder": 0
  }
],
      },
    },
  });

  await prisma.project.create({
    data: {
      title: "Pinterest AI Content Filter(Founder)",
      url: "https://chromewebstore.google.com/detail/pinterest-ai-content-filt/hmfjagfgmembcmlaapcpghmcejiacpdl?hl=en-US&utm_source=ext_sidebar",
      description: "Building a Pinterest AI Content Filter",
      content: caseStudyHtml("pinterest-ai-content-filter-founder.html"),
      imageUrl: "/uploads/1789573544487-zysrylbkh1j.png",
      featured: true,
      accessMode: "link",
      sortOrder: 0,
    },
  });

  await prisma.project.create({
    data: {
      title: "Rawnaq Al madinah",
      url: "https://www.rawnaqalmadinah.com/",
      description: "Transforming an Offline Decoration Business into a Search-Driven Digital Presence",
      content: caseStudyHtml("rawnaq-al-madinah.html"),
      imageUrl: "/uploads/1789573422337-r6azg6mde3.PNG",
      featured: true,
      accessMode: "link",
      sortOrder: 1,
    },
  });

  await prisma.project.create({
    data: {
      title: "Observability & Security Layer",
      url: null,
      description: "Designing a centralized infrastructure layer to monitor application\n  performance, system health, logs, and security events.\n",
      content: caseStudyHtml("observability-security-layer.html"),
      imageUrl: "/uploads/1789574861095-gst0x07zned.gif",
      featured: true,
      accessMode: "request",
      sortOrder: 3,
    },
  });

  await prisma.project.create({
    data: {
      title: "Content Automation System ",
      url: "https://github.com/elazharysalah",
      description: "An internal system I built to automate content research, analysis,\n AI generation, captions, and distribution across Facebook and Pinterest",
      content: caseStudyHtml("content-automation-system.html"),
      imageUrl: "/uploads/1789574626711-xb2mh90jot.png",
      featured: true,
      accessMode: "request",
      sortOrder: 4,
    },
  });

  await prisma.galleryImage.createMany({
    data: [
  {
    "imageUrl": "/uploads/1789577318317-1p4vnotti35.jfif",
    "caption": "Great moment at Remix tech event",
    "sortOrder": 0
  },
  {
    "imageUrl": "/uploads/1789577345485-rxntl4rgo1k.jfif",
    "caption": "At gitex great discussion with Boris",
    "sortOrder": 1
  },
  {
    "imageUrl": "/uploads/1789577552992-uns1mz4h5is.jpg",
    "caption": "EMECEXPO E-COMMERCE EVENT",
    "sortOrder": 3
  }
],
  });

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
