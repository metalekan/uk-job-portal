"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Loader2 } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface HeroProps {
  initialQuery?: string;
  initialLocation?: string;
  initialSponsorship?: boolean;
  initialLevel?: string;
  initialContract?: string;
}

const backgroundImages = [
  {
    src: "https://images.unsplash.com/photo-1753104429187-64c23ec2adaa?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Modern office space",
  },
  {
    src: "https://images.unsplash.com/photo-1758270705290-62b6294dd044?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Remote working cafe",
  },
  {
    src: "https://images.unsplash.com/photo-1635350736475-c8cef4b21906?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "London city skyline",
  },
];

export function Hero({ initialQuery = "", initialLocation = "", initialSponsorship = false, initialLevel = "", initialContract = "" }: HeroProps) {
  const [sponsorship, setSponsorship] = useState(initialSponsorship);
  const [level, setLevel] = useState(initialLevel);
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  // Reset loading state when search params change (navigation complete)
  useEffect(() => {
    setIsLoading(false);
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const q = formData.get("q") as string;
    const loc = formData.get("loc") as string;
    const contract = formData.get("contract") as string;

    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (loc) params.set("loc", loc);
    if (level && level !== "all") params.set("level", level);
    if (contract && contract !== "all") params.set("contract", contract);
    if (sponsorship) params.set("sponsorship", "true");

    const url = `/?${params.toString()}#jobs`;
    
    router.push(url);
    
    // Smooth scroll to jobs section
    // We set a small timeout to allow the router to push and valid HTML to exist/scroll
    setTimeout(() => {
        const jobsSection = document.getElementById("jobs");
        if (jobsSection) {
            jobsSection.scrollIntoView({ behavior: "smooth" });
        }
    }, 100); 
  };

  return (
    <section className="relative w-full h-[80svh] flex items-center justify-center overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        <Carousel
          plugins={[plugin.current]}
          className="w-full h-full"
          opts={{
            loop: true,
            align: "start",
          }}
        >
          <CarouselContent className="h-[80svh]">
            {backgroundImages.map((image, index) => (
              <CarouselItem key={index} className="pl-0 h-full relative">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                {/* Overlay for text pop */}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Content */}
      <div className="container relative z-10 text-center space-y-8 max-w-4xl px-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-white drop-shadow-md">
          Find Your Dream Job in the UK 
          <Image 
            src="https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg" 
            alt="UK Flag" 
            width={60} 
            height={40} 
            className="inline-block ml-3 align-baseline rounded-sm shadow-md h-auto w-[40px] md:w-[60px]" 
            unoptimized
          />
        </h1>
        <p className="text-xl text-white/90 drop-shadow-sm max-w-2xl mx-auto">
          Discover thousands of job opportunities across the United Kingdom. 
          Connect with top employers and take the next step in your career.
        </p>
        
        <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl md:rounded-full p-4 md:p-2 md:pl-6 shadow-2xl flex flex-col md:flex-row items-center gap-4 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            
            {/* What */}
            <div className="flex-1 flex items-center w-full md:w-auto relative group">
              <span className="text-gray-400 mr-2 md:hidden font-medium w-16">What</span>
              <Input 
                name="q" 
                placeholder="Job title or keyword" 
                defaultValue={initialQuery}
                className="border-0 shadow-none focus-visible:ring-0 text-base py-3 md:py-6 px-2 placeholder:text-gray-400 bg-transparent"
              />
            </div>

            {/* Where */}
            <div className="flex-1 flex items-center w-full md:w-auto px-0 md:px-2 relative group">
              <span className="text-gray-400 mr-2 md:hidden font-medium w-16">Where</span>
              <Input 
                name="loc" 
                placeholder="City, region or postcode" 
                defaultValue={initialLocation}
                className="border-0 shadow-none focus-visible:ring-0 text-base py-3 md:py-6 px-2 placeholder:text-gray-400 bg-transparent"
              />
            </div>

            {/* Filters Group (Level & Contract) */}
            <div className="grid grid-cols-2 w-full md:flex md:w-auto md:items-center px-0 md:px-2 gap-4 md:gap-2 py-2 md:py-0">
               <div className="w-full md:w-[130px]">
                  <Select name="level" value={level} onValueChange={setLevel}>
                    <SelectTrigger className="border-0 shadow-none focus:ring-0 text-gray-600 bg-transparent px-0 md:px-3">
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Level</SelectItem>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
               <div className="w-px h-8 bg-gray-200 hidden md:block"></div>
               <div className="w-full md:w-[130px]">
                  <Select name="contract" defaultValue={initialContract || "all"}>
                    <SelectTrigger className="border-0 shadow-none focus:ring-0 text-gray-600 bg-transparent px-0 md:px-3">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Type</SelectItem>
                      <SelectItem value="full_time">Full Time</SelectItem>
                      <SelectItem value="part_time">Part Time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="permanent">Permanent</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
            </div>

            {/* Clear Button (Visible if any filter is active) */}
            {(initialQuery || initialLocation || initialSponsorship || (initialLevel && initialLevel !== 'all') || (initialContract && initialContract !== 'all')) && (
               <Button asChild variant="ghost" size="icon" className="hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full shrink-0 mr-1 hidden md:flex" title="Clear Filters" onClick={() => setIsLoading(true)}>
                 <Link href="/">
                   <X className="h-5 w-5" />
                 </Link>
               </Button>
            )}

            {/* Search Button */}
            <Button type="submit" size="lg" disabled={isLoading} className="w-full md:w-auto rounded-xl md:rounded-full px-8 py-6 text-lg font-bold shadow-md hover:scale-105 transition-transform bg-primary text-primary-foreground">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Searching
                </>
              ) : (
                "Search"
              )}
            </Button>
          </div>
          
          <div className="items-center justify-center gap-3 bg-black/30 backdrop-blur-sm py-2 px-4 rounded-full inline-flex mx-auto border border-white/10">
            <Switch 
              id="sponsorship" 
              checked={sponsorship}
              onCheckedChange={setSponsorship}
              className="data-[state=checked]:bg-green-500 border-white/50"
            />
            <Label htmlFor="sponsorship" className="cursor-pointer select-none text-white font-medium drop-shadow flex items-center gap-2 text-sm">
              Visa Sponsorship Available
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            </Label>
            {sponsorship && <input type="hidden" name="sponsorship" value="true" />}
          </div>
        </form>
        
        <div className="flex flex-wrap justify-center gap-4 text-sm text-white/80 pt-4">
          <span className="font-semibold text-white ">Popular:</span>
          <span className="hover:text-white hover:underline cursor-pointer transition-colors backdrop-blur-sm bg-white/10 px-3 py-1 rounded-full border border-white/10">Developer</span>
          <span className="hover:text-white hover:underline cursor-pointer transition-colors backdrop-blur-sm bg-white/10 px-3 py-1 rounded-full border border-white/10">Marketing</span>
          <span className="hover:text-white hover:underline cursor-pointer transition-colors backdrop-blur-sm bg-white/10 px-3 py-1 rounded-full border border-white/10">Finance</span>
        </div>
      </div>
    </section>
  );
}
