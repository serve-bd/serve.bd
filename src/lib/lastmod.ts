import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

/*
 * The <lastmod> dates for the sitemap, taken from when each page's source last changed in git.
 *
 * Google uses lastmod to decide which pages to recrawl first. Build time would be useless, since a
 * build rewrites every page at once and would claim the whole site changed today.
 *
 * This reads the git history, so .git has to be in the build context (see .dockerignore). Without
 * history every lookup returns null and the sitemap is written without lastmod.
 */

const run = promisify(execFile);
const root = fileURLToPath(new URL("../../", import.meta.url));

const contentFile = (slug: string) => [`src/content/docs/docs/${slug}.mdx`, `src/content/docs/docs/${slug}.md`];

/** The git paths a page is built from. The newest change among them is the page's last change. */
function sourcesFor(pathname: string): string[] {
  const path = pathname.replace(/^\/+/, "").replace(/\/+$/, "");

  if (!path) return ["src/pages/index.astro", "src/data/openapi.json"];
  // Every API reference page comes from the spec and the one template that renders it.
  if (path.startsWith("docs/api/")) return ["src/pages/docs/api/[group].astro", "src/data/openapi.json"];
  if (path === "docs/api") return [...contentFile("api"), "src/data/openapi.json"];
  if (path === "docs" || path.startsWith("docs/")) return contentFile(path === "docs" ? "index" : path.slice("docs/".length));
  if (path === "templates") return ["src/pages/templates.astro", "src/data/templates.json"];
  if (path === "changelog") return ["src/pages/changelog.astro", "src/data/changelog.json"];
  return [`src/pages/${path}.astro`, `src/pages/${path}/index.astro`];
}

/** The last commit date of one file, or null when git cannot say (no history, shallow clone, new file). */
async function commitDate(file: string): Promise<string | null> {
  if (!existsSync(join(root, file))) return null;
  try {
    const { stdout } = await run("git", ["log", "-1", "--format=%cI", "--", file], { cwd: root });
    const time = Date.parse(stdout.trim());
    return Number.isNaN(time) ? null : new Date(time).toISOString();
  } catch {
    return null;
  }
}

/** Map each URL pathname to the newest commit date of anything it is built from. */
export async function lastmodFor(pathnames: string[]): Promise<Map<string, string>> {
  const seen = new Map<string, string | null>();
  const dates = new Map<string, string>();

  for (const pathname of pathnames) {
    let newest = 0;
    for (const file of sourcesFor(pathname)) {
      if (!seen.has(file)) seen.set(file, await commitDate(file));
      const date = seen.get(file);
      if (date && Date.parse(date) > newest) newest = Date.parse(date);
    }
    if (newest) dates.set(pathname, new Date(newest).toISOString());
  }
  return dates;
}
