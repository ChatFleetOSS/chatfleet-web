// Simple smoke check: ensure ODT is allowed in admin upload inputs.
// Usage: node scripts/ui-smoke-odt.js
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");

const files = [
  "app/(app)/admin/rag/[slug]/page.tsx",
  "app/(app)/admin/rag/new/page.tsx",
];

let failures = 0;

for (const rel of files) {
  const path = resolve(process.cwd(), rel);
  const contents = readFileSync(path, "utf8");
  if (!contents.includes(".odt") || !contents.includes("application/vnd.oasis.opendocument.text")) {
    console.error(`[fail] ODT accept missing in ${rel}`);
    failures++;
  } else {
    console.log(`[ok] ${rel} accepts ODT`);
  }
}

if (failures) {
  process.exitCode = 1;
} else {
  console.log("[ok] ODT upload smoke check passed.");
}
