"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdzunaCategory } from "@/lib/adzuna";

interface SalaryCategorySelectorProps {
  categories: AdzunaCategory[];
  currentCategory: string;
}

export function SalaryCategorySelector({
  categories,
  currentCategory,
}: SalaryCategorySelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }
    router.push(`/salaries?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-4 bg-card p-4 rounded-lg border shadow-sm max-w-md mx-auto">
      <span className="text-sm font-medium whitespace-nowrap">Job Category:</span>
      <Select value={currentCategory} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.tag} value={category.tag}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
