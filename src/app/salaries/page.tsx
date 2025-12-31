import { getSalaryHistory, getJobCategories } from "@/lib/adzuna";
import { Footer } from "@/components/Footer";
import { SalaryCategorySelector } from "@/components/SalaryCategorySelector";
import { SalaryTrendChart } from "@/components/SalaryTrendChart";

export const metadata = {
  title: "Salary Trends - UK Job Portal",
  description: "Track salary trends for jobs in London over time.",
};

export default async function SalariesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Resolve searchParams before accessing properties
  const resolvedSearchParams = await searchParams;
  const categoryTag = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : 'it-jobs';

  const [history, categories] = await Promise.all([
    getSalaryHistory(categoryTag),
    getJobCategories(),
  ]);

  const currentCategoryLabel = categories.find(c => c.tag === categoryTag)?.label || "IT Jobs";

  if (!history || Object.keys(history).length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 container mx-auto px-4 py-12 text-center text-muted-foreground space-y-4">
          <p>Unable to load salary trend data at the moment.</p>
          <div className="flex justify-center">
             <SalaryCategorySelector categories={categories} currentCategory={categoryTag} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Sort dates and get last 12 months for cleaner view
  const sortedDates = Object.keys(history).sort();
  const recentDates = sortedDates.slice(-12); 
  const recentHistory = recentDates.reduce((obj, date) => {
    obj[date] = history[date];
    return obj;
  }, {} as Record<string, number>);

  const salaries = Object.values(recentHistory);

  // Calculate current average (last data point)
  const currentSalary = salaries[salaries.length - 1];
  const lastMonth = recentDates[recentDates.length - 1];
  
  // Calculate Year-over-Year growth (if available)
  const yearStartSalary = salaries[0];
  const growth = ((currentSalary - yearStartSalary) / yearStartSalary) * 100;

  const chartData = recentDates.map(date => ({
    date,
    salary: recentHistory[date]
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-linear-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4 py-12 space-y-8">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight">Job Salary Trends in London</h1>
            <p className="text-xl text-muted-foreground">
              Historical salary performance for {currentCategoryLabel} professionals in the capital.
            </p>
            <div className="pt-4">
              <SalaryCategorySelector categories={categories} currentCategory={categoryTag} />
            </div>
          </div>

          <div className="flex justify-center items-center gap-8 py-6 max-w-5xl mx-auto">
                <div className="text-center p-6 bg-primary/5 rounded-2xl border border-primary/10 flex-1">
                  <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">Current Average</div>
                  <div className="text-5xl font-black text-primary">£{Math.round(currentSalary).toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-2">Latest: {lastMonth}</div>
                </div>
                
                <div className="text-center p-6 bg-muted/30 rounded-2xl border border-muted flex-1">
                  <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">12-Month Growth</div>
                  <div className={`text-3xl font-bold ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {growth > 0 ? '+' : ''}{growth.toFixed(1)}%
                  </div>
                </div>
           </div>

          <SalaryTrendChart data={chartData} categoryLabel={currentCategoryLabel} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
