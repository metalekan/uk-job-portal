import { searchJobs } from "@/lib/adzuna";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, Clock } from "lucide-react";
import { SaveJobButton } from "./SaveJobButton";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongodb";
import SavedJob from "@/models/SavedJob";

interface JobResultsProps {
  query: string;
  location?: string;
  isSponsorship: boolean;
  experienceLevel: string;
  contractType: string;
}

export async function JobResults({ query, location, isSponsorship, experienceLevel, contractType }: JobResultsProps) {
  // Add a small delay to simulate loading for demo purposes, if desired, or just fetch
  // await new Promise(resolve => setTimeout(resolve, 1000)); 
  
  const [jobsResult, authResult] = await Promise.all([
    searchJobs("gb", query || "developer", location || "", 1, isSponsorship, experienceLevel, contractType),
    auth()
  ]);

  const jobs = jobsResult;
  const { userId } = authResult;

  let savedJobIds = new Set<string>();
  if (userId) {
    try {
      await dbConnect();
      const favorites = await SavedJob.find({ userId }).select('jobId');
      savedJobIds = new Set(favorites.map(f => f.jobId));
    } catch (err) {
      console.error("Failed to fetch saved jobs", err);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Latest Openings</h2>
        <Badge variant="outline" className="px-3 py-1">
          {jobs.length} Jobs Found
        </Badge>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <Card key={job.id} className="flex flex-col group hover:shadow-md transition-shadow relative">
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-xl line-clamp-2 pr-8" title={job.title}>
                      {job.title}
                    </CardTitle>
                    <Badge variant="secondary" className="shrink-0">
                      {job.contract_type || "Full-time"}
                    </Badge>
                  </div>
                   <div className="absolute top-4 right-4">
                      <SaveJobButton job={job} initialIsSaved={savedJobIds.has(job.id)} />
                   </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium text-foreground">{job.company.display_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location.display_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(job.created).toLocaleDateString()}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {job.description.replace(/<strong>/g, '').replace(/<\/strong>/g, '')}
                </p>
              </CardContent>
              <CardFooter className="pt-4 border-t bg-muted/20">
                <Button asChild className="w-full group-hover:bg-primary/90" variant="secondary">
                  <a href={job.redirect_url} target="_blank" rel="noopener noreferrer">
                    Apply Now
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No jobs found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
