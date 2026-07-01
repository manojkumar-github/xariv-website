#!/usr/bin/env node
/**
 * Migrate Jekyll posts from manojkumar-github.github.io to content/architecture-studies/
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(here, "../../manojkumar-github.github.io/_posts");
const outDir = path.resolve(here, "../content/architecture-studies");

const slugByFile = {
  "2026-06-22-serving-hundreds-of-llms-at-scale-multi-model-inference-platform.md":
    "multi-model-inference-platform",
  "2026-06-20-benchmarking-llms-at-scale-reproducible-gpu-platform.md":
    "benchmarking-llms-at-scale",
  "2026-06-03-per-user-rag-private-ai-inbox-at-scale.md": "per-user-rag-at-scale",
  "2026-05-16-kernel-fusion-llm-inference-memory-bandwidth.md":
    "kernel-fusion-llm-inference",
  "2026-04-14-networking-bottlenecks-large-scale-moe-inference.md":
    "networking-moe-inference",
};

function fixContent(body) {
  return body
    .replace(/\{\{\s*['"]?\/assets\/img\/([^'"]+)['"]?\s*\|\s*relative_url\s*\}\}/g, "/images/$1")
    .replace(/\/assets\/img\//g, "/images/");
}

for (const file of fs.readdirSync(srcDir)) {
  if (!file.endsWith(".md")) continue;
  const slug = slugByFile[file];
  if (!slug) {
    console.warn(`Skip unknown file: ${file}`);
    continue;
  }
  const raw = fs.readFileSync(path.join(srcDir, file), "utf-8");
  const { content } = matter(raw);
  fs.writeFileSync(path.join(outDir, `${slug}.md`), fixContent(content));
  console.log(`→ ${slug}.md`);
}
