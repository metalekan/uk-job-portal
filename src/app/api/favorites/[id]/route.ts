import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongodb";
import SavedJob from "@/models/SavedJob";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: jobId } = await params;

    if (!jobId) {
       return NextResponse.json({ error: "Job ID required" }, { status: 400 });
    }

    await dbConnect();
    const result = await SavedJob.findOneAndDelete({ userId, jobId });

    if (!result) {
       return NextResponse.json({ error: "Job not found in favorites" }, { status: 404 });
    }

    return NextResponse.json({ message: "Job removed from favorites" });

  } catch (error) {
    console.error("Error removing favorite:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
