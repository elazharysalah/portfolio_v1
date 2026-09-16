import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  return NextResponse.json(await prisma.education.findMany({ orderBy: { sortOrder: "asc" } }));
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await request.json();
  const item = await prisma.education.create({
    data: {
      institution: body.institution,
      degree: body.degree,
      period: body.period,
      description: body.description || null,
      sortOrder: Number(body.sortOrder || 0),
    },
  });
  return NextResponse.json(item);
}

export async function PUT(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await request.json();
  const item = await prisma.education.update({
    where: { id: body.id },
    data: {
      institution: body.institution,
      degree: body.degree,
      period: body.period,
      description: body.description || null,
      sortOrder: Number(body.sortOrder || 0),
    },
  });
  return NextResponse.json(item);
}

export async function DELETE(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.education.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
