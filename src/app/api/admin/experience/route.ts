import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  return NextResponse.json(await prisma.experience.findMany({ orderBy: { sortOrder: "asc" } }));
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await request.json();
  const item = await prisma.experience.create({
    data: {
      company: body.company,
      role: body.role,
      location: body.location || null,
      period: body.period,
      description: body.description,
      sortOrder: Number(body.sortOrder || 0),
    },
  });
  return NextResponse.json(item);
}

export async function PUT(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await request.json();
  const item = await prisma.experience.update({
    where: { id: body.id },
    data: {
      company: body.company,
      role: body.role,
      location: body.location || null,
      period: body.period,
      description: body.description,
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
  await prisma.experience.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
