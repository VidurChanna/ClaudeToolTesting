#!/usr/bin/env node

import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dir = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(readFileSync(join(__dir, "config.json"), "utf8"));

const bullet = process.argv[2];
if (!bullet || bullet.trim() === "") {
  console.error('Usage: node scorer.js "your resume bullet here"');
  process.exit(1);
}

const ruleDescriptions = config.rules
  .map(
    (r) =>
      `- ${r.id}: ${r.description}${r.max_characters ? ` (max ${r.max_characters} characters)` : ""}${r.banned_characters ? ` Banned: ${r.banned_characters.join(", ")}` : ""}`
  )
  .join("\n");

const bannedList = config.banned_words.join(", ");

const systemPrompt = `You are a resume bullet scorer. ${config.rubric_description}

Rules:
${ruleDescriptions}

Banned words (case-insensitive, partial match): ${bannedList}

Evaluate the bullet against all six rules. Return a JSON object with this exact shape:

{
  "results": [
    { "rule": "<rule_id>", "pass": true | false, "reason": "<one sentence>" }
  ],
  "score": <integer 0-6>,
  "rewrite": "<improved bullet, or null if score is 6>"
}

Rules for the rewrite:
- Only provide a rewrite if score < 6.
- The rewrite must fix all failing rules.
- Keep the rewrite to one line, under 200 characters.
- No em dashes. No banned words. Start with a strong verb. Include both an input metric and an output metric.
- If you cannot infer plausible metrics from context, use bracketed placeholders like [X%] or [$Xk].`;

const client = new Anthropic();

async function score(bulletText) {
  const stream = await client.messages.stream({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: systemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: bulletText,
      },
    ],
  });

  const message = await stream.finalMessage();
  const raw = message.content[0].text.trim();

  let parsed;
  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
  } catch {
    console.error("Failed to parse response:", raw);
    process.exit(1);
  }

  const total = config.rules.length;
  console.log(`\nScore: ${parsed.score}/${total}\n`);

  const colWidth = Math.max(...config.rules.map((r) => r.id.length)) + 2;
  for (const result of parsed.results) {
    const badge = result.pass ? "PASS" : "FAIL";
    const label = result.rule.padEnd(colWidth);
    console.log(`${badge}  ${label}${result.reason}`);
  }

  if (parsed.rewrite) {
    console.log(`\nSuggested rewrite:\n${parsed.rewrite}`);
  }

  console.log("");
}

score(bullet).catch((err) => {
  console.error(err.message);
  process.exit(1);
});
