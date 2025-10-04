// *********************
// API Routes for Individual Ad
// GET: Fetch single ad by ID
// PUT: Update ad by ID
// DELETE: Delete ad by ID
// *********************

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET single ad by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ad = await prisma.ads.findUnique({
      where: { id: params.id },
    });

    if (!ad) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 });
    }

    return NextResponse.json(ad, { status: 200 });
  } catch (error) {
    console.error("Error fetching ad:", error);
    return NextResponse.json({ error: "Failed to fetch ad" }, { status: 500 });
  }
}

// PUT update ad by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { image, name, title, desc, startDate, endDate, isShow } = body;

    // Check if ad exists
    const existingAd = await prisma.ads.findUnique({
      where: { id: params.id },
    });

    if (!existingAd) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 });
    }

    // Validate dates if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end <= start) {
        return NextResponse.json(
          { error: "End date must be after start date" },
          { status: 400 }
        );
      }
    }

    const updatedAd = await prisma.ads.update({
      where: { id: params.id },
      data: {
        ...(image && { image }),
        ...(name && { name }),
        ...(title && { title }),
        ...(desc && { desc }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(isShow !== undefined && { isShow }),
      },
    });

    return NextResponse.json(updatedAd, { status: 200 });
  } catch (error) {
    console.error("Error updating ad:", error);
    return NextResponse.json({ error: "Failed to update ad" }, { status: 500 });
  }
}

// DELETE ad by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if ad exists
    const existingAd = await prisma.ads.findUnique({
      where: { id: params.id },
    });

    if (!existingAd) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 });
    }

    await prisma.ads.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Ad deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting ad:", error);
    return NextResponse.json({ error: "Failed to delete ad" }, { status: 500 });
  }
}
