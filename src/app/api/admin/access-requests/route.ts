import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  return NextResponse.json(
    await prisma.accessRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: { project: { select: { id: true, title: true } } },
    })
  );
}

export async function PUT(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await request.json();
  const item = await prisma.accessRequest.update({
    where: { id: body.id },
    data: { read: Boolean(body.read) },
  });
  return NextResponse.json(item);
}

export async function DELETE(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.accessRequest.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
