import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  projectId: z.string().min(1),
  name: z.string().min(1).max(120),
  email: z.string().email().max(180),
  message: z.string().max(2000).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id: parsed.data.projectId },
    });

    if (!project || project.accessMode !== "request") {
      return NextResponse.json(
        { error: "Access requests are not available for this project" },
        { status: 400 }
      );
    }

    await prisma.accessRequest.create({
      data: {
        projectId: parsed.data.projectId,
        name: parsed.data.name,
        email: parsed.data.email,
        message: parsed.data.message || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
