
export interface TrendingNiche {
  name: string;
  category: string;
  description: string;
  trendReason: string;
  commercialPotential: "high" | "medium" | "low";
  targetBuyers: string[];
  sources: string[];
}

export interface NicheDiscoveryResult {
  researchedAt: string;
  marketSummary: string;
  niches: TrendingNiche[];
}

export interface StockIdeaGeneration {
  name: string;
  category: string;
  trendResearch: {
    summary: string;
    trends: {
      trend: string;
      reason: string;
      sources: string[];
    }[];
  };
  imagePrompt: string;
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface GeminiGeneration {
  text: string;
  groundingMetadata: Record<string, unknown> | null;
}

export interface StockIdea {
  id: string;
  name: string;
  category: string;
  trendResearchJson: string | null;
  imagePrompt: string;
  title: string;
  description: string;
  keywordsJson: string;
  fullJson: string;
  createdAt: string;
}
