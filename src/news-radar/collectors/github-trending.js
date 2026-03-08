import { insertItem, startRun, finishRun } from "./base.js";

// GitHub trending doesn't have an API, but we can scrape the HTML
const GH_TRENDING = "https://github.com/trending?since=daily";

const HIGH_RELEVANCE = ["ai", "llm", "agent", "claude", "openai", "gpt", "mcp", "langchain", "autogen", "crew", "rag"];
const MED_RELEVANCE = ["python", "typescript", "javascript", "rust", "go", "react", "nextjs", "cli", "automation"];

function scoreRelevance(name, desc, stars) {
  const t = `${name} ${desc}`.toLowerCase();
  let rel = 3;
  for (const kw of HIGH_RELEVANCE) {
    if (t.includes(kw)) { rel += 3; break; }
  }
  for (const kw of MED_RELEVANCE) {
    if (t.includes(kw)) { rel += 1; break; }
  }
  if (stars > 1000) rel += 2;
  else if (stars > 200) rel += 1;
  return Math.min(rel, 10);
}

function categorize(text) {
  const t = text.toLowerCase();
  if (/\b(ai|llm|gpt|claude|openai|agent|ml|neural|transformer|diffusion|rag)\b/.test(t)) return "ai";
  if (/\b(fintech|finance|trading|bank)\b/.test(t)) return "fintech";
  if (/\b(indie|saas|startup|boilerplate|template)\b/.test(t)) return "indie";
  return "coding";
}

function parseStars(text) {
  if (!text) return 0;
  const clean = text.trim().replace(/,/g, "");
  return parseInt(clean) || 0;
}

export async function collectGitHub() {
  const runId = await startRun("github");
  let added = 0, skipped = 0;

  try {
    const res = await fetch(GH_TRENDING, {
      headers: {
        "User-Agent": "NewsRadar/0.1",
        "Accept": "text/html",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      await finishRun(runId, 0, 0, `HTTP ${res.status}`);
      console.log(`  ⚠️ GitHub Trending: HTTP ${res.status}`);
      return { added: 0, skipped: 0 };
    }

    const html = await res.text();

    // Parse repo rows from HTML
    const rowRegex = /<article class="Box-row">([\s\S]*?)<\/article>/g;
    let match;
    let repos = [];

    while ((match = rowRegex.exec(html)) !== null && repos.length < 25) {
      const block = match[1];

      // Repo name: /owner/repo
      const nameMatch = block.match(/href="\/([^"]+)"/);
      if (!nameMatch) continue;
      const fullName = nameMatch[1].replace(/\s/g, "");

      // Description
      const descMatch = block.match(/<p class="[^"]*col-9[^"]*">([\s\S]*?)<\/p>/);
      const desc = descMatch ? descMatch[1].replace(/<[^>]*>/g, "").trim() : "";

      // Stars today
      const starsMatch = block.match(/(\d[\d,]*)\s*stars today/);
      const starsToday = starsMatch ? parseStars(starsMatch[1]) : 0;

      // Total stars
      const totalStarsMatch = block.match(/href="\/[^"]*\/stargazers"[^>]*>[\s\S]*?([\d,]+)[\s\S]*?<\/a>/);
      const totalStars = totalStarsMatch ? parseStars(totalStarsMatch[1]) : 0;

      // Language
      const langMatch = block.match(/itemprop="programmingLanguage">(.*?)<\/span>/);
      const language = langMatch ? langMatch[1].trim() : "";

      repos.push({
        fullName,
        desc,
        starsToday,
        totalStars,
        language,
        url: `https://github.com/${fullName}`,
      });
    }

    for (const repo of repos) {
      const text = `${repo.fullName} ${repo.desc}`;
      const relevance = scoreRelevance(repo.fullName, repo.desc, repo.starsToday);
      const category = categorize(text);

      const inserted = await insertItem({
        source: "github",
        source_id: repo.fullName,
        url: repo.url,
        title: `${repo.fullName} — ${repo.desc || "No description"}`.slice(0, 200),
        summary: repo.desc || null,
        author: repo.fullName.split("/")[0],
        score: repo.starsToday,
        relevance,
        category,
        tags: [category, repo.language].filter(Boolean),
        raw_data: {
          total_stars: repo.totalStars,
          stars_today: repo.starsToday,
          language: repo.language,
        },
      });

      if (inserted) added++;
      else skipped++;
    }

    await finishRun(runId, added, skipped);
    console.log(`✅ GitHub Trending: +${added} new, ${skipped} skipped`);
  } catch (e) {
    await finishRun(runId, added, skipped, e.message);
    console.error(`❌ GitHub Trending error: ${e.message}`);
  }

  return { added, skipped };
}
