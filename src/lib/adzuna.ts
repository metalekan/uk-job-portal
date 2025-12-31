export interface AdzunaJob {
  id: string;
  title: string;
  description: string;
  company: {
    display_name: string;
  };
  location: {
    display_name: string;
  };
  redirect_url: string;
  created: string;
  salary_min?: number;
  salary_max?: number;
  contract_type?: string;
}

interface AdzunaResponse {
  results: AdzunaJob[];
  count: number;
  mean: number;
}

const ADZUNA_APP_ID = process.env.NEXT_PUBLIC_ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;
const BASE_URL = 'https://api.adzuna.com/v1/api/jobs';

export async function searchJobs(
  country: string = 'gb',
  what: string = '',
  where: string = '',
  page: number = 1,
  sponsorship: boolean = false,
  level: string = '',
  contract: string = ''
): Promise<AdzunaJob[]> {
  if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
    console.warn('Adzuna API credentials are missing.');
    return [];
  }

  try {
    const url = new URL(`${BASE_URL}/${country}/search/${page}`);
    url.searchParams.append('app_id', ADZUNA_APP_ID);
    url.searchParams.append('app_key', ADZUNA_APP_KEY);
    url.searchParams.append('results_per_page', '20');
    url.searchParams.append('content-type', 'application/json');
    
    // Append sponsorship keywords if filter is active
    let whatQuery = what;
    if (sponsorship) {
      whatQuery = whatQuery ? `${whatQuery} sponsorship` : 'visa sponsorship';
    }
    
    // Append experience level
    if (level && level !== 'all') {
      whatQuery = whatQuery ? `${whatQuery} ${level}` : level;
    }
    
    // Append contract type (approximate using keywords for broader match, or strict if API supports)
    // For Adzuna simplified, appending to 'what' works effectively for demonstration if strict filter not available.
    if (contract && contract !== 'all') {
      whatQuery = whatQuery ? `${whatQuery} ${contract.replace('_', ' ')}` : contract.replace('_', ' '); 
    }
    
    if (whatQuery) url.searchParams.append('what', whatQuery);
    if (where) url.searchParams.append('where', where);

    const response = await fetch(url.toString(), { next: { revalidate: 3600 } });

    if (!response.ok) {
      throw new Error(`Adzuna API error: ${response.statusText}`);
    }

    const data: AdzunaResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching jobs from Adzuna:', error);
    return [];
  }
}

interface AdzunaHistogramResponse {
  histogram: {
    [key: string]: number;
  };
  mean: number;
}

export async function getSalaryHistogram(country: string = 'gb', where: string = 'London'): Promise<{ histogram: Record<string, number>; mean: number } | null> {
  if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) return null;

  try {
    const url = new URL(`${BASE_URL}/${country}/histogram`);
    url.searchParams.append('app_id', ADZUNA_APP_ID);
    url.searchParams.append('app_key', ADZUNA_APP_KEY);
    url.searchParams.append('content-type', 'application/json');
    if (where) url.searchParams.append('where', where);

    const response = await fetch(url.toString(), { next: { revalidate: 86400 } }); // Cache for 24 hours

    if (!response.ok) {
      throw new Error(`Adzuna API error: ${response.statusText}`);
    }

    const data: AdzunaHistogramResponse = await response.json();
    console.log('[Adzuna] Histogram Data:', JSON.stringify(data, null, 2));
    return { histogram: data.histogram, mean: data.mean };
  } catch (error) {
    console.error('Error fetching salary histogram:', error);
    return null;
  }
}

interface AdzunaHistoryResponse {
  month: {
    [date: string]: number;
  };
}

export async function getSalaryHistory(category: string = 'healthcare'): Promise<Record<string, number> | null> {
  if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) return null;

  try {
    const url = new URL(`${BASE_URL}/gb/history`);
    url.searchParams.append('app_id', ADZUNA_APP_ID);
    url.searchParams.append('app_key', ADZUNA_APP_KEY);
    url.searchParams.append('location0', 'UK');
    url.searchParams.append('location1', 'London');
    url.searchParams.append('category', category);
    url.searchParams.append('content-type', 'application/json');

    const response = await fetch(url.toString(), { next: { revalidate: 86400 } });

    if (!response.ok) {
      throw new Error(`Adzuna API error: ${response.statusText}`);
    }

    const data: AdzunaHistoryResponse = await response.json();
    return data.month;
  } catch (error) {
    console.error('Error fetching salary history:', error);
    return null;
  }
}

export interface AdzunaCategory {
  tag: string;
  label: string;
}

interface AdzunaCategoryResponse {
  results: AdzunaCategory[];
}

export async function getJobCategories(country: string = 'gb'): Promise<AdzunaCategory[]> {
  if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) return [];

  try {
    const url = new URL(`${BASE_URL}/${country}/categories`);
    url.searchParams.append('app_id', ADZUNA_APP_ID);
    url.searchParams.append('app_key', ADZUNA_APP_KEY);
    url.searchParams.append('content-type', 'application/json');

    const response = await fetch(url.toString(), { next: { revalidate: 86400 } }); // Cache for 24 hours

    if (!response.ok) {
      throw new Error(`Adzuna API error: ${response.statusText}`);
    }

    const data: AdzunaCategoryResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching job categories:', error);
    return [];
  }
}
