import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  await dbConnect();

  // Fetch jobs directly on the server - standard Server Component pattern
  const jobs = await Job.find({ postedBy: userId }).sort({ createdAt: -1 });

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Employer Dashboard</h1>
      </div>

      <div className="grid gap-6">
        <h2 className="text-xl font-semibold">Your Posted Jobs</h2>
        {jobs.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <Card key={job._id.toString()}>
                <CardHeader>
                  <CardTitle>{job.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="text-sm font-medium text-muted-foreground">
                      {job.company}
                    </div>
                    {job.location && (
                      <div className="text-sm text-muted-foreground">
                        {job.location}
                      </div>
                    )}
                    <Badge variant="secondary" className="w-fit">
                      {job.contract_type || "Full-time"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">You haven't posted any jobs yet.</p>
        )}
      </div>
    </div>
  );
}
