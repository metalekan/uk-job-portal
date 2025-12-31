import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-background py-10 px-4 border-t">
      <div className="container mx-auto space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h4 className="font-bold text-lg">Proper Jobs</h4>
            <p className="text-sm text-muted-foreground">
              Connecting talent with opportunity across the United Kingdom.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold">For Candidates</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary">Browse Jobs</Link></li>
              <li><Link href="#" className="hover:text-primary">Career Advice</Link></li>
              <li><Link href="#" className="hover:text-primary">Salary Guidelines</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold">For Employers</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary">Post a Job</Link></li>
              <li><Link href="#" className="hover:text-primary">Talent Solutions</Link></li>
              <li><Link href="#" className="hover:text-primary">Pricing</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <Separator />
        <div className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} UK Job Portal. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
