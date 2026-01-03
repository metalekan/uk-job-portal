import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import SavedJob from "@/models/SavedJob";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, Clock } from "lucide-react";
import { SaveJobButton } from "@/components/SaveJobButton";
import { Footer } from "@/components/Footer";
import { AdzunaJob } from "@/lib/adzuna";

interface SavedJobDoc {
  _id: string;
  jobId: string;
  title: string;
  company: string;
  location: string;
  description?: string;
  redirect_url: string;
  salary_min?: number;
  salary_max?: number;
  contract_type?: string;
  created?: string;
  createdAt?: string;

}

export const metadata = {
  title: "My Favorite Jobs - UK Job Portal",
  description: "View your saved job opportunities.",
};

export default async function FavoritesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  await dbConnect();
  // lean() might be better but find() returns documents, we need to cast or map carefully
  const favorites = await SavedJob.find({ userId }).sort({ createdAt: -1 });

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
           <h1 className="text-3xl font-bold tracking-tight">My Saved Jobs</h1>
           <Badge variant="outline" className="px-3 py-1">
             {favorites.length} Saved
           </Badge>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">No saved jobs yet</h2>
            <p className="text-muted-foreground mb-6">Start browsing and save jobs you&apos;re interested in.</p>
            <Button asChild>
                <Link href="/">Browse Jobs</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             {favorites.map((fav: any) => {
                 // Cast to unknown first if needed, or just let Mongoose inference handle it if possible, 
                 // but for now, let's treat it as SavedJobDoc to satisfy the linter
                 const jobData = fav as unknown as SavedJobDoc; 
                 // Map MongoDB doc to AdzunaJob structure for the button
                 const job: AdzunaJob = {
                     id: jobData.jobId,
                     title: jobData.title,
                     company: { display_name: jobData.company },
                     location: { display_name: jobData.location },
                     description: jobData.description || '',
                     redirect_url: jobData.redirect_url,
                     salary_min: jobData.salary_min,
                     salary_max: jobData.salary_max,
                     contract_type: jobData.contract_type,
                     created: jobData.created || new Date().toISOString()
                 };

                 return (
                    <Card key={jobData._id} className="flex flex-col group hover:shadow-md transition-shadow relative">
                      <CardHeader>
                        <div className="flex justify-between items-start gap-2">
                          <div className="space-y-1 flex-1">
                            <CardTitle className="text-xl line-clamp-2 pr-8" title={jobData.title}>
                              {jobData.title}
                            </CardTitle>
                            <Badge variant="secondary" className="shrink-0">
                              {jobData.contract_type || "Full-time"}
                            </Badge>
                          </div>
                            <div className="absolute top-4 right-4">
                                <SaveJobButton job={job} initialIsSaved={true} />
                            </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 space-y-4">
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            <span className="font-medium text-foreground">{jobData.company}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{jobData.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{new Date(jobData.created || jobData.createdAt || '').toLocaleDateString()}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {jobData.description && jobData.description.replace(/<strong>/g, '').replace(/<\/strong>/g, '')}
                        </p>
                      </CardContent>
                      <CardFooter className="pt-4 border-t bg-muted/20">
                        <Button asChild className="w-full group-hover:bg-primary/90" variant="secondary">
                          <a href={jobData.redirect_url} target="_blank" rel="noopener noreferrer">
                            Apply Now
                          </a>
                        </Button>
                      </CardFooter>
                    </Card>
                 );
             })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
