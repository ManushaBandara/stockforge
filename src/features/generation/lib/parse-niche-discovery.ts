
import type { NicheDiscoveryResult } from "../types/stock-idea.types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseNicheDiscovery(
  rawText: string
): NicheDiscoveryResult {
  const cleanedText = rawText
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  let parsed: unknown;

  try {
    parsed = JSON.parse(cleanedText);
  } catch {
    throw new Error("Gemini returned invalid JSON. Please try again.");
  }

  if (!isRecord(parsed)) {
    throw new Error("Invalid niche discovery response.");
  }

  if (
    typeof parsed.researchedAt !== "string" ||
    typeof parsed.marketSummary !== "string" ||
    !Array.isArray(parsed.niches)
  ) {
    throw new Error("Niche discovery response is missing required fields.");
  }

  if (parsed.niches.length < 5 || parsed.niches.length > 10) {
    throw new Error("Expected between 5 and 10 trending niches.");
  }

  const niches = parsed.niches.map((item, index) => {
    if (
      !isRecord(item) ||
      typeof item.name !== "string" ||
      !item.name.trim() ||
      typeof item.category !== "string" ||
      !item.category.trim() ||
      typeof item.description !== "string" ||
      !item.description.trim() ||
      typeof item.trendReason !== "string" ||
      !item.trendReason.trim() ||
      !["high", "medium", "low"].includes(
        item.commercialPotential as string
      ) ||
      !Array.isArray(item.targetBuyers) ||
      !Array.isArray(item.sources)
    ) {
      throw new Error(`Invalid niche at position ${index + 1}.`);
    }

    if (
      !item.targetBuyers.every((buyer) => typeof buyer === "string") ||
      !item.sources.every((source) => typeof source === "string")
    ) {
      throw new Error(`Invalid niche list values at position ${index + 1}.`);
    }

    return {
      name: item.name.trim(),
      category: item.category.trim(),
      description: item.description.trim(),
      trendReason: item.trendReason.trim(),
      commercialPotential: item.commercialPotential as
        | "high"
        | "medium"
        | "low",
      targetBuyers: item.targetBuyers,
      sources: item.sources,
    };
  });

  return {
    researchedAt: parsed.researchedAt,
    marketSummary: parsed.marketSummary,
    niches,
  };
}
