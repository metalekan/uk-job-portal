import Link from "next/link";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Proper Jobs </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Find Jobs
            </Link>
            <Link href="/companies" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Companies
            </Link>
            <Link href="/salaries" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Salaries
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <SignedOut>
            <div className="flex items-center gap-2">
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm">Sign Up</Button>
              </SignUpButton>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/post-job">Post a Job</Link>
              </Button>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9"
                  }
                }}
              />
            </div>
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
