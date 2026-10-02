/**
 * Refresh src/data/openapi.json, the source of the API reference pages.
 *
 *   bun scripts/sync-openapi.ts https://serve.example.com   # any Serve instance (no token needed)
 *   bun scripts/sync-openapi.ts ./openapi.json              # a file saved earlier
 */
import { readFile, writeFile } from "node:fs/promises";

const from = process.argv[2];
if (!from) {
  console.error("Usage: bun scripts/sync-openapi.ts <instance URL | file>");
  process.exit(1);
}

const text = /^https?:\/\//.test(from) ? await fetchSpec(from) : await readFile(from, "utf8");
const spec = JSON.parse(text);
if (!spec.openapi || !spec.paths) throw new Error("That is not an OpenAPI document.");

// The servers entry carries the instance's own URL; the docs use a placeholder.
spec.servers = [{ url: "https://serve.example.com/api/v1" }];
await writeFile(new URL("../src/data/openapi.json", import.meta.url), `${JSON.stringify(spec, null, 1)}\n`);

const operations = Object.values(spec.paths as Record<string, object>).reduce((n, item) => n + Object.keys(item).length, 0);
console.log(`Serve API ${spec.info.version}: ${operations} operations in ${spec.tags.length} groups.`);

async function fetchSpec(base: string) {
  const url = new URL("/api/v1/openapi.json", base);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} answered ${res.status}`);
  return res.text();
}
