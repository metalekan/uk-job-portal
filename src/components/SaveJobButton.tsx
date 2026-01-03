"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { AdzunaJob } from "@/lib/adzuna";

interface SaveJobButtonProps {
  job: AdzunaJob;
  initialIsSaved?: boolean;
}

export function SaveJobButton({ job, initialIsSaved = false }: SaveJobButtonProps) {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isLoading, setIsLoading] = useState(false);
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    setIsLoading(true);

    try {
      if (isSaved) {
        // Unsave
        const res = await fetch(`/api/favorites/${job.id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setIsSaved(false);
          router.refresh(); 
        }
      } else {
        // Save
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobId: job.id,
            title: job.title,
            company: job.company.display_name,
            location: job.location.display_name,
            redirect_url: job.redirect_url,
            description: job.description,
            salary_min: job.salary_min,
            salary_max: job.salary_max,
            contract_type: job.contract_type,
            created: job.created,
          }),
        });
        if (res.ok) {
          setIsSaved(true);
          router.refresh();
        }
      }
    } catch (error) {
      console.error("Failed to toggle save state", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSave}
      disabled={isLoading}
      className={`rounded-full hover:bg-slate-100 ${isSaved ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-red-500"}`}
      title={isSaved ? "Remove from Favorites" : "Save Job"}
    >
      <Heart className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
      <span className="sr-only">{isSaved ? "Unsave" : "Save"}</span>
    </Button>
  );
}
