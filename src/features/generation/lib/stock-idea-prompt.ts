import type { TrendingNiche } from "../types/stock-idea.types";

export function buildStockIdeaPrompt(niche: TrendingNiche): string {
  return `
You are a professional stock photography art director,
AI image prompt engineer and Adobe Stock metadata specialist.

Create ONE original, commercially useful stock image concept
based on the selected niche and its supplied research.

SELECTED NICHE:
${JSON.stringify(niche, null, 2)}

INSTRUCTIONS:
- Use the supplied niche research as your primary context.
- Create one specific, original visual concept.
- Focus on commercial use for designers, advertisers and businesses.
- Do not invent research findings, statistics or source URLs.
- Do not claim to have performed live web searches.
- Preserve genuine source URLs supplied in the research.

IMAGE GENERATION PROMPT:
Include:
- Main subject and visual story.
- Composition and framing.
- Environment and background.
- Lighting and atmosphere.
- Camera angle and perspective.
- Color palette and visual style.
- Realistic details and suitable negative space.

Avoid logos, trademarks, copyrighted characters, famous people,
branded products, living artist imitation, text and watermarks.

ADOBE STOCK METADATA:

TITLE:
Write a clear, accurate and descriptive title.

DESCRIPTION:
Professionally describe the proposed image concept.

KEYWORDS:
- Provide 25 to 40 relevant keywords.
- Put the most important first.
- Avoid duplicates, irrelevant terms and brands.
- Do not use hashtags.

TREND RESEARCH:
- Provide one concise research summary.
- Return exactly 3 relevant trends.
- Each trend must contain a name, reason and sources array.
- Use only source URLs supplied in the selected niche.
- If no source URL is available, return an empty sources array.
- Do not fabricate research or URLs.

OUTPUT:
Return ONLY valid JSON without Markdown code fences.

Use exactly this structure:

{
  "name": "Short and unique concept name",
  "category": "Selected niche category",
  "trendResearch": {
    "summary": "Summary of supplied niche research",
    "trends": [
      {
        "trend": "Relevant trend",
        "reason": "Why this trend matters",
        "sources": []
      },
      {
        "trend": "Relevant trend",
        "reason": "Why this trend matters",
        "sources": []
      },
      {
        "trend": "Relevant trend",
        "reason": "Why this trend matters",
        "sources": []
      }
    ]
  },
  "imagePrompt": "Detailed production-ready image prompt",
  "metadata": {
    "title": "Descriptive stock image title",
    "description": "Accurate stock image description",
    "keywords": [
      "keyword one",
      "keyword two"
    ]
  }
}

IMPORTANT:
- Return exactly 3 trends.
- Return 25 to 40 unique keywords.
- Populate every required field.
- Return professional English.
`;
}
