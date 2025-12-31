import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";
import { redirect } from "next/navigation";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { JobResults } from "@/components/JobResults";
import { JobSkeleton } from "@/components/JobSkeleton";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; loc?: string; sponsorship?: string; level?: string; contract?: string }>;
}) {
  const { userId } = await auth();
  const { q, loc, sponsorship, level, contract } = await searchParams;
  const query = q || "";
  const location = loc || "";
  const isSponsorship = sponsorship === "true";
  const experienceLevel = level || "";
  const contractType = contract || "";
  
  // Note: Job fetching is now handled inside JobResults for streaming

  async function createJob(formData: FormData) {
    "use server";
    const { userId } = await auth();
    if (!userId) return;

    await dbConnect();
    const title = formData.get("title") as string;
    const company = formData.get("company") as string;

    await Job.create({
      title,
      company,
      postedBy: userId,
    });

    redirect("/");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Hero 
          initialQuery={query} 
          initialLocation={location}
          initialSponsorship={isSponsorship} 
          initialLevel={experienceLevel} 
          initialContract={contractType} 
        />

        <div className="container mx-auto px-4 py-12 space-y-12">
          {userId && (
            <Card className="max-w-2xl mx-auto border-dashed">
              <CardHeader>
                <CardTitle>Post a Job Opportunity</CardTitle>
              </CardHeader>
              <CardContent>
                <form action={createJob} className="flex gap-4 items-end">
                  <div className="grid flex-1 gap-2">
                    <Input name="title" placeholder="Job Title" required />
                    <Input name="company" placeholder="Company Name" required />
                  </div>
                  <Button type="submit">Post Job</Button>
                </form>
              </CardContent>
            </Card>
          )}

          <Suspense fallback={<JobSkeleton />}>
            <JobResults 
              query={query} 
              location={location}
              isSponsorship={isSponsorship} 
              experienceLevel={experienceLevel} 
              contractType={contractType}
            />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
