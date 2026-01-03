"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

interface ResultsPerPageProps {
  currentLimit: number;
}

export function ResultsPerPage({ currentLimit }: ResultsPerPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", value);
    params.set("page", "1"); // Reset to page 1 when limit changes
    const url = `/?${params.toString()}#jobs`; // Preserve anchor
    router.push(url);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground whitespace-nowrap">Results per page:</span>
      <Select value={currentLimit.toString()} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[70px] h-8">
          <SelectValue placeholder={currentLimit.toString()} />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
