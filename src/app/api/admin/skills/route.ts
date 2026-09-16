import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  return NextResponse.json(
    await prisma.skillGroup.findMany({
      orderBy: { sortOrder: "asc" },
      include: { skills: { orderBy: { sortOrder: "asc" } } },
    })
  );
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await request.json();

  if (body.type === "skill") {
    const skill = await prisma.skill.create({
      data: {
        name: body.name,
        groupId: body.groupId,
        sortOrder: Number(body.sortOrder || 0),
      },
    });
    return NextResponse.json(skill);
  }

  const group = await prisma.skillGroup.create({
    data: {
      name: body.name,
      sortOrder: Number(body.sortOrder || 0),
    },
  });
  return NextResponse.json(group);
}

export async function PUT(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await request.json();

  if (body.type === "skill") {
    const skill = await prisma.skill.update({
      where: { id: body.id },
      data: {
        name: body.name,
        groupId: body.groupId,
        sortOrder: Number(body.sortOrder || 0),
      },
    });
    return NextResponse.json(skill);
  }

  const group = await prisma.skillGroup.update({
    where: { id: body.id },
    data: {
      name: body.name,
      sortOrder: Number(body.sortOrder || 0),
    },
  });
  return NextResponse.json(group);
}

export async function DELETE(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const type = searchParams.get("type") || "group";
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  if (type === "skill") {
    await prisma.skill.delete({ where: { id } });
  } else {
    await prisma.skillGroup.delete({ where: { id } });
  }
  return NextResponse.json({ ok: true });
}
