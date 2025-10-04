// *********************
// API Routes for Ads Management
// GET: Fetch all ads (with optional filters)
// POST: Create new ad
// *********************

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all ads
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const isShow = searchParams.get("isShow");
    const active = searchParams.get("active"); // Filter for active ads (current date between start and end)

    let whereClause: any = {};

    if (isShow !== null) {
      whereClause.isShow = isShow === "true";
    }

    if (active === "true") {
      const now = new Date();
      whereClause.startDate = { lte: now };
      whereClause.endDate = { gte: now };
      whereClause.isShow = true;
    }

    const ads = await prisma.ads.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(ads, { status: 200 });
  } catch (error) {
    console.error("Error fetching ads:", error);
    return NextResponse.json({ error: "Failed to fetch ads" }, { status: 500 });
  }
}

// POST create new ad
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, name, title, desc, startDate, endDate, isShow } = body;

    // Validation
    if (!image || !name || !title || !desc || !startDate || !endDate) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      return NextResponse.json(
        { error: "End date must be after start date" },
        { status: 400 }
      );
    }

    const newAd = await prisma.ads.create({
      data: {
        image,
        name,
        title,
        desc,
        startDate: start,
        endDate: end,
        isShow: isShow !== undefined ? isShow : true,
      },
    });

    return NextResponse.json(newAd, { status: 201 });
  } catch (error) {
    console.error("Error creating ad:", error);
    return NextResponse.json({ error: "Failed to create ad" }, { status: 500 });
  }
}
