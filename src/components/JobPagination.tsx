"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface JobPaginationProps {
  currentPage: number;
  totalPages: number;
}

export function JobPagination({ currentPage, totalPages }: JobPaginationProps) {
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `/?${params.toString()}#jobs`; // Preserve anchor to jobs section
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage <= 1}
        asChild={currentPage > 1}
      >
        {currentPage > 1 ? (
          <Link href={createPageURL(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        ) : (
          <span className="opacity-50 cursor-not-allowed">
             <ChevronLeft className="h-4 w-4" />
          </span>
        )}
      </Button>

      <div className="flex items-center gap-1 text-sm font-medium">
        <span>Page {currentPage} of {totalPages}</span>
      </div>

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage >= totalPages}
        asChild={currentPage < totalPages}
      >
        {currentPage < totalPages ? (
          <Link href={createPageURL(currentPage + 1)}>
             <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span className="opacity-50 cursor-not-allowed">
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </Button>
    </div>
  );
}
