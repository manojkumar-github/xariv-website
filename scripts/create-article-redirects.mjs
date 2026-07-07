#!/usr/bin/env node
/** Create static redirects from old Jekyll post URLs to xariv-website architecture studies. */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const SITE = "https://xarivlabs.com";
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../manojkumar-github.github.io");

const redirects = [
  ["networking-bottlenecks-large-scale-moe-inference", "networking-moe-inference"],
  ["kernel-fusion-llm-inference-memory-bandwidth", "kernel-fusion-llm-inference"],
  ["per-user-rag-private-ai-inbox-at-scale", "per-user-rag-at-scale"],
  ["benchmarking-llms-at-scale-reproducible-gpu-platform", "benchmarking-llms-at-scale"],
  ["serving-hundreds-of-llms-at-scale-multi-model-inference-platform", "multi-model-inference-platform"],
];

const html = (dest) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content="0; url=${dest}" />
    <link rel="canonical" href="${dest}" />
    <script>location.replace("${dest}");</script>
    <title>Redirecting…</title>
  </head>
  <body>
    <p>Redirecting to <a href="${dest}">XARIV Architecture Studies</a>…</p>
  </body>
</html>
`;

for (const [oldSlug, newSlug] of redirects) {
  const dir = path.join(root, oldSlug);
  fs.mkdirSync(dir, { recursive: true });
  const dest = `${SITE}/architecture-studies/${newSlug}`;
  fs.writeFileSync(path.join(dir, "index.html"), html(dest));
  console.log(`/${oldSlug}/ → ${dest}`);
}
