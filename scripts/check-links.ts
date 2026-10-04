/**
 * Checks every internal link in the built site (dist/): the page must exist, and a #fragment must
 * match an id on that page. Run after a build: bun run build && bun scripts/check-links.ts
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const dist = new URL("../dist/", import.meta.url).pathname;

function htmlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? htmlFiles(path) : name.endsWith(".html") ? [path] : [];
  });
}

/** The file a site path is served from, or null. */
function fileFor(path: string) {
  const clean = decodeURIComponent(path);
  for (const candidate of [join(dist, clean), join(dist, clean, "index.html"), join(dist, `${clean}.html`)]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

const ids = new Map<string, Set<string>>();
const idsOf = (file: string) => {
  let set = ids.get(file);
  if (!set) {
    set = new Set([...readFileSync(file, "utf8").matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
    ids.set(file, set);
  }
  return set;
};

// Paths served by the host, not by files in dist.
const external = new Set(["/install.sh", "/cli.sh"]);
const problems: string[] = [];
let checked = 0;

for (const file of htmlFiles(dist)) {
  const page = `/${file.slice(dist.length).replace(/index\.html$/, "")}`;
  const html = readFileSync(file, "utf8");
  for (const [, attr, raw] of html.matchAll(/\s(href|src)="([^"]+)"/g)) {
    if (!raw.startsWith("/") && !raw.startsWith("#")) continue;
    if (raw.startsWith("//") || external.has(raw)) continue;
    const [pathAndQuery, fragment] = raw.split("#");
    const path = pathAndQuery.split("?")[0] || page;
    checked++;
    const target = fileFor(path);
    if (!target) {
      problems.push(`${page}: ${attr} ${raw} → no such page`);
      continue;
    }
    if (fragment && target.endsWith(".html") && !idsOf(target).has(decodeURIComponent(fragment))) {
      problems.push(`${page}: ${raw} → no #${fragment} on that page`);
    }
  }
}

if (problems.length) {
  console.error([...new Set(problems)].join("\n"));
  console.error(`\n${problems.length} broken of ${checked} links.`);
  process.exit(1);
}
console.log(`All ${checked} internal links work.`);
