
import type { TrendingNiche } from "../types/stock-idea.types";

export function buildStockIdeaPrompt(niche: TrendingNiche): string {
  return `
You are a professional stock photography art director,
AI image prompt engineer and Adobe Stock metadata specialist.

Your task is to create ONE original, commercially useful stock image concept
based on the selected niche and its research context.

SELECTED NICHE:
${JSON.stringify(niche, null, 2)}

INSTRUCTIONS:

1. Use the supplied niche research as the primary context.
2. Create one specific, original visual concept within this niche.
3. Do not simply repeat the niche name as the concept.
4. Focus on practical commercial use for designers, advertisers,
   publishers and businesses.
5. You may use Google Search to verify or extend relevant information,
   but do not invent research findings or source URLs.

IMAGE GENERATION PROMPT:

Create a detailed, production-ready prompt containing:
- Main subject and visual story.
- Composition and framing.
- Environment and background.
- Lighting and atmosphere.
- Camera angle and perspective.
- Color palette.
- Visual style and realistic details.
- Suitable negative space when appropriate.

Avoid:
- Logos and trademarks.
- Copyrighted characters.
- Famous people.
- Recognizable branded products.
- Imitating specific living artists.
- Text, watermarks and signatures.

ADOBE STOCK METADATA:

TITLE:
- Clear, accurate and descriptive.
- Describe the actual proposed visual content.
- Avoid promotional language and keyword stuffing.

DESCRIPTION:
- Professionally describe the proposed image.
- Include the main subject and relevant visual context.
- Do not claim that an image already exists or has been generated.

KEYWORDS:
- Provide 25 to 40 relevant keywords.
- Put the most important keywords first.
- Use accurate single words and useful keyword phrases.
- Avoid duplicates, irrelevant terms, brands and copyrighted names.
- Do not use hashtags.

OUTPUT:

Return ONLY one valid JSON object.
Do not use Markdown code fences.
Do not include explanations outside the JSON.

Use exactly this structure:

{
  "name": "Short and unique concept name",
  "category": "Selected niche category",
  "trendResearch": {
    "summary": "Summary of the supplied niche research",
    "trends": [
      {
        "trend": "Relevant trend",
        "reason": "Why this trend matters for this concept",
        "sources": [
          "Source URL from the supplied research"
        ]
      }
    ]
  },
  "imagePrompt": "Detailed image generation prompt",
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
- Keep the original niche context.
- Preserve genuine source URLs from the supplied research.
- Do not fabricate statistics, demand or sources.
- Return 25 to 40 keywords.
- Ensure every JSON field is valid and populated.
- Return professional English.
`;
}
