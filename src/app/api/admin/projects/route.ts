import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/data";
import { prisma } from "@/lib/prisma";

const ACCESS_MODES = new Set(["link", "hidden", "request"]);

function normalizeAccessMode(value: unknown) {
  const mode = typeof value === "string" ? value : "link";
  return ACCESS_MODES.has(mode) ? mode : "link";
}

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  return NextResponse.json(await prisma.project.findMany({ orderBy: { sortOrder: "asc" } }));
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await request.json();
  const item = await prisma.project.create({
    data: {
      title: body.title,
      url: body.url || null,
      description: body.description,
      content: body.content || null,
      imageUrl: body.imageUrl || null,
      featured: Boolean(body.featured),
      accessMode: normalizeAccessMode(body.accessMode),
      sortOrder: Number(body.sortOrder || 0),
    },
  });
  return NextResponse.json(item);
}

export async function PUT(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await request.json();
  const item = await prisma.project.update({
    where: { id: body.id },
    data: {
      title: body.title,
      url: body.url || null,
      description: body.description,
      content: body.content || null,
      imageUrl: body.imageUrl || null,
      featured: Boolean(body.featured),
      accessMode: normalizeAccessMode(body.accessMode),
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
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
