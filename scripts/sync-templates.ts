/**
 * Copy the one-click template catalog from a checkout of the Serve repository: names, categories
 * and descriptions into src/data/templates.json, and each logo into public/templates/<id>.svg.
 * Run it after templates change, then deploy the site.
 *
 *   bun scripts/sync-templates.ts ../serve
 */
import { copyFile, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const from = process.argv[2];
if (!from) {
  console.error("Usage: bun scripts/sync-templates.ts <path to the serve repository>");
  process.exit(1);
}

type Entry = { id: string; name: string; description: string; category: string; website?: string | null; color?: string | null };

const dir = path.join(from, "templates");
const { templates } = JSON.parse(await readFile(path.join(dir, "index.json"), "utf8")) as { templates: Entry[] };

// Start from an empty logo folder, so logos of removed templates go too.
await mkdir("public/templates", { recursive: true });
for (const name of await readdir("public/templates")) await rm(path.join("public/templates", name));

const out = [];
for (const t of templates) {
  const svg = path.join(dir, t.id, "logo.svg");
  const logo = existsSync(svg) ? `/templates/${t.id}.svg` : null;
  if (logo) await copyFile(svg, `public${logo}`);
  out.push({ id: t.id, name: t.name, description: t.description, category: t.category, website: t.website ?? null, color: t.color ?? null, logo });
}
await writeFile("src/data/templates.json", `${JSON.stringify(out, null, 1)}\n`);
console.log(`${out.length} templates, ${out.filter((t) => t.logo).length} with a logo.`);
