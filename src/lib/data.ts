import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { session: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, error: null };
}

export async function getPortfolioData() {
  const [profile, settings, highlights, experiences, education, skillGroups, projects, gallery] =
    await Promise.all([
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

  return {
    profile,
    settings,
    highlights,
    experiences,
    education,
    skillGroups,
    projects,
    gallery,
  };
}
