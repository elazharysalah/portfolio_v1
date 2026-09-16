import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const profile = await prisma.profile.findUnique({ where: { id: "main" } });
  return NextResponse.json(profile);
}

export async function PUT(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await request.json();
  const profile = await prisma.profile.upsert({
    where: { id: "main" },
    update: {
      name: body.name,
      title: body.title,
      email: body.email,
      phone: body.phone || null,
      location: body.location || null,
      bio: body.bio,
      avatarUrl: body.avatarUrl || null,
      resumeUrl: body.resumeUrl || null,
      linkedinUrl: body.linkedinUrl || null,
      githubUrl: body.githubUrl || null,
      instagramUrl: body.instagramUrl || null,
      facebookUrl: body.facebookUrl || null,
      twitterUrl: body.twitterUrl || null,
      websiteUrl: body.websiteUrl || null,
      footerText: body.footerText || null,
    },
    create: {
      id: "main",
      name: body.name || "Name",
      title: body.title || "Title",
      email: body.email || "email@example.com",
      phone: body.phone || null,
      location: body.location || null,
      bio: body.bio || "",
      avatarUrl: body.avatarUrl || null,
      resumeUrl: body.resumeUrl || null,
      linkedinUrl: body.linkedinUrl || null,
      githubUrl: body.githubUrl || null,
      footerText: body.footerText || null,
    },
  });
  return NextResponse.json(profile);
}
