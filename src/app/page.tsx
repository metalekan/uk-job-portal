import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { JobResults } from "@/components/JobResults";
import { JobSkeleton } from "@/components/JobSkeleton";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; loc?: string; sponsorship?: string; level?: string; contract?: string; page?: string; limit?: string }>;
}) {
  await auth();
  const { q, loc, sponsorship, level, contract, page, limit } = await searchParams;
  
  const query = q || "";
  const location = loc || "";
  const isSponsorship = sponsorship === "true";
  const experienceLevel = level || "";
  const contractType = contract || "";
  const pageNumber = Number(page) || 1;
  const limits = Number(limit) || 20;

  // Note: Job fetching is now handled inside JobResults for streaming

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

        <div id="jobs" className="container mx-auto px-4 py-12 space-y-12">
          <Suspense fallback={<JobSkeleton />}>
            <JobResults 
              query={query} 
              location={location}
              isSponsorship={isSponsorship} 
              experienceLevel={experienceLevel} 
              contractType={contractType}
              page={pageNumber}
              limit={limits}
            />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
