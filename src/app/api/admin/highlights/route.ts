import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  return NextResponse.json(await prisma.highlight.findMany({ orderBy: { sortOrder: "asc" } }));
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await request.json();
  const item = await prisma.highlight.create({
    data: {
      value: body.value,
      label: body.label,
      sortOrder: Number(body.sortOrder || 0),
    },
  });
  return NextResponse.json(item);
}

export async function PUT(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await request.json();
  const item = await prisma.highlight.update({
    where: { id: body.id },
    data: {
      value: body.value,
      label: body.label,
      sortOrder: Number(body.sortOrder || 0),
    },
  });
  return NextResponse.json(item);
}

export async function DELETE(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.highlight.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
