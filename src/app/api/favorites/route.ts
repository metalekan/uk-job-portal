import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongodb";
import SavedJob from "@/models/SavedJob";

export async function GET(_req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const favorites = await SavedJob.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { jobId, title, company, location, redirect_url, description, salary_min, salary_max, contract_type, created } = body;

    if (!jobId || !title || !company || !redirect_url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();
    
    // Check if already saved
    const existing = await SavedJob.findOne({ userId, jobId });
    if (existing) {
       return NextResponse.json({ message: "Job already saved" }, { status: 200 });
    }

    const savedJob = await SavedJob.create({
      userId,
      jobId,
      title,
      company,
      location,
      redirect_url,
      description,
      salary_min,
      salary_max,
      contract_type,
      created
    });

    return NextResponse.json(savedJob, { status: 201 });

  } catch (error) {
    console.error("Error saving job:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
