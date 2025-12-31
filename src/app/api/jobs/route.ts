import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Job from '@/models/Job';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { title, company, description, location, contract_type } = await req.json();

    await dbConnect();

    const job = await Job.create({
      title,
      company,
      description,
      location,
      contract_type,
      postedBy: userId,
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error('[JOBS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const jobs = await Job.find({}).sort({ createdAt: -1 });
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('[JOBS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
