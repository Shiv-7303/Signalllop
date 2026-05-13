export type User = {
  id: string;
  email: string;
  name: string | null;
  plan: "free" | "starter" | "pro";
  avatar_url?: string;
  created_at: string;
};

export type Business = {
  id: string;
  user_id: string;
  business_name: string;
  website?: string;
  category?: string;
  project_brief?: string;
  goal?: string;
  region?: string;
  created_at: string;
};

export type Competitor = {
  id: string;
  business_id: string;
  competitor_name: string;
  website?: string;
};

export type Opportunity = {
  id: string;
  business_id: string;
  title: string;
  subreddit?: string;
  url?: string;
  engagement_score: number;
  opportunity_score: number;
  ai_summary?: string;
  recommended_action?: string;
  intent_type?: "buying" | "pain_point" | "comparison" | "discussion";
  created_at: string;
};

export type Report = {
  id: string;
  business_id: string;
  report_type: "growth" | "competitor" | "opportunity";
  report_data: ReportData;
  status: "pending" | "complete" | "failed";
  created_at: string;
};

export type ReportData = {
  growth_score: number;
  growth_score_insights: string[];
  best_communities: Community[];
  opportunities: Opportunity[];
  content_ideas: string[];
  strategy_summary: string;
};

export type Community = {
  subreddit: string;
  members: string;
  activity: string;
  why_it_matters: string;
  suggested_strategy: string[];
};

export type UsageInfo = {
  reports_used: number;
  reports_limit: number;
  reports_remaining: number;
  competitors_used: number;
  competitors_limit: number;
  competitors_remaining: number;
  plan: string;
  monthly_reset_date: string;
};

export type WeeklyDigest = {
  new_discussions_count: number;
  rising_keywords: string[];
  competitor_trends: string[];
  top_trend: string;
  best_community: string;
  best_action: string;
  digest_summary: string;
};
