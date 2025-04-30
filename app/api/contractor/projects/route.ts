import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/server/utills/db";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: { contractorId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("[PROJECTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    console.log("[PROJECTS_POST] Session:", session);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    console.log("[PROJECTS_POST] User:", user);

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    console.log("[PROJECTS_POST] Request body:", body);
    const { name } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    console.log("[PROJECTS_POST] Creating project with:", { name, contractorId: user.id });
    const project = await prisma.Project.create({
      data: {
        name,
        contractorId: user.id,
      },
    });
    console.log("[PROJECTS_POST] Created project:", project);

    return NextResponse.json(project);
  } catch (error) {
    console.error("[PROJECTS_POST] Error details:", error);
    // Return more specific error message if available
    const errorMessage = error instanceof Error ? error.message : "Internal error";
    return new NextResponse(errorMessage, { status: 500 });
  }
} 