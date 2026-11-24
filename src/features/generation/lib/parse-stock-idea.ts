
import type { StockIdeaGeneration } from "../types/stock-idea.types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseStockIdea(rawText: string): StockIdeaGeneration {
  const cleaned = rawText
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  let parsed: unknown;

  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Gemini returned invalid JSON.");
  }

  if (!isRecord(parsed)) {
    throw new Error("Invalid stock idea response.");
  }

  const { name, category, trendResearch, imagePrompt, metadata } = parsed;

  if (
    typeof name !== "string" ||
    typeof category !== "string" ||
    typeof imagePrompt !== "string" ||
    !isRecord(trendResearch) ||
    !isRecord(metadata)
  ) {
    throw new Error("Stock idea response is missing required fields.");
  }

  if (
    typeof trendResearch.summary !== "string" ||
    !Array.isArray(trendResearch.trends) ||
    trendResearch.trends.length !== 3
  ) {
    throw new Error("Invalid trend research data.");
  }

  const trends = trendResearch.trends.map((item, index) => {
    if (
      !isRecord(item) ||
      typeof item.trend !== "string" ||
      typeof item.reason !== "string" ||
      !Array.isArray(item.sources) ||
      !item.sources.every((source) => typeof source === "string")
    ) {
      throw new Error(`Invalid trend at position ${index + 1}.`);
    }

    return {
      trend: item.trend,
      reason: item.reason,
      sources: item.sources,
    };
  });

  if (
    typeof metadata.title !== "string" ||
    typeof metadata.description !== "string" ||
    !Array.isArray(metadata.keywords)
  ) {
    throw new Error("Invalid Adobe Stock metadata.");
  }

  const keywords = metadata.keywords;

  if (
    keywords.length < 25 ||
    keywords.length > 40 ||
    !keywords.every(
      (keyword) => typeof keyword === "string" && keyword.trim().length > 0
    )
  ) {
    throw new Error("Expected 25 to 40 valid keywords.");
  }

  const normalized = keywords.map((keyword) => keyword.trim());

  if (new Set(normalized.map((keyword) => keyword.toLowerCase())).size !== normalized.length) {
    throw new Error("Duplicate keywords detected.");
  }

  return {
    name: name.trim(),
    category: category.trim(),
    imagePrompt: imagePrompt.trim(),
    trendResearch: {
      summary: trendResearch.summary.trim(),
      trends,
    },
    metadata: {
      title: metadata.title.trim(),
      description: metadata.description.trim(),
      keywords: normalized,
    },
  };
}
