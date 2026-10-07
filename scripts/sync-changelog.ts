/**
 * Refresh src/data/changelog.json, the source of the changelog page: the newest releases of Serve
 * on GitHub, their notes as HTML (without the list of commits, which the release page keeps).
 *
 *   bun scripts/sync-changelog.ts        # run it with each release, like sync-openapi
 */
import { writeFile } from "node:fs/promises";

const REPO = "serve-bd/serve";
const COUNT = 20;

type Release = { tag_name: string; name: string | null; body: string | null; html_url: string; published_at: string | null; draft: boolean; prerelease: boolean };

const res = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=${COUNT + 10}`, {
  headers: { accept: "application/vnd.github+json", ...(process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) },
});
if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
const releases = ((await res.json()) as Release[]).filter((r) => !r.draft && !r.prerelease && r.published_at).slice(0, COUNT);

const entries = releases.map((r) => ({
  version: r.tag_name.replace(/^v/, ""),
  date: r.published_at!,
  url: r.html_url,
  html: toHtml((r.body ?? "").split(/^#{2,3} Commits\s*$/m)[0]),
}));
await writeFile(new URL("../src/data/changelog.json", import.meta.url), `${JSON.stringify(entries, null, 1)}\n`);
console.log(`Changelog: ${entries.length} releases, newest ${entries[0]?.version ?? "none"}.`);

/** The little Markdown release notes use: headings, lists, paragraphs; links, bold and code inline. Everything is escaped first. */
function toHtml(md: string) {
  const out: string[] = [];
  let list = false;
  let para: string[] = [];
  const flush = () => {
    if (para.length) out.push(`<p>${inline(para.join(" "))}</p>`);
    para = [];
  };
  const close = () => {
    if (list) out.push("</ul>");
    list = false;
  };
  for (const raw of md.replace(/\r/g, "").split("\n")) {
    const line = raw.trimEnd();
    const heading = line.match(/^#{1,6}\s+(.*)$/);
    const item = line.match(/^\s*[-*]\s+(.*)$/);
    if (!line.trim()) {
      flush();
      close();
    } else if (heading) {
      flush();
      close();
      out.push(`<h3>${inline(heading[1])}</h3>`);
    } else if (item) {
      flush();
      if (!list) out.push("<ul>");
      list = true;
      out.push(`<li>${inline(item[1])}</li>`);
    } else if (list && /^\s+\S/.test(raw)) {
      // A wrapped list item goes on.
      out[out.length - 1] = out[out.length - 1].replace(/<\/li>$/, ` ${inline(line.trim())}</li>`);
    } else {
      close();
      para.push(line.trim());
    }
  }
  flush();
  close();
  return out.join("\n");
}

function inline(text: string) {
  const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  return escaped
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}
