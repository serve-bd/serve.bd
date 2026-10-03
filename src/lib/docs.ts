import { groups as apiGroups } from "./openapi";

/** Docs sidebar groups and their pages, by slug under src/content/docs/docs ("" is the docs home). */
export const sidebar: [string, string[]][] = [
  ["Getting started", ["", "installation", "first-deploy", "concepts"]],
  ["Apps", ["apps", "builds", "environment-variables", "storage", "deployments"]],
  ["Data", ["databases", "data", "backups", "templates"]],
  ["Networking", ["domains", "cloudflare"]],
  ["Servers", ["servers", "moving-containers", "private-networks", "monitoring", "log-drains"]],
  ["Teams", ["teams", "security"]],
  ["Operate", ["updating", "instance-backups", "uninstalling", "reference", "community"]],
];

export const docId = (slug: string) => (slug ? `docs/${slug}` : "docs");

/** The API group: the guide, then one reference page per group of the OpenAPI spec. */
export const apiSidebar = {
  label: "API",
  items: [{ label: "Getting started", slug: "docs/api" }, ...apiGroups.map((g) => ({ label: g.name, link: `/docs/api/${g.slug}/` }))],
};

/** The sidebar group a docs page is in, by its entry id. */
export function sectionOf(id: string) {
  if (id === "docs/api" || id.startsWith("docs/api/")) return id === "docs/api" ? "API" : "API reference";
  return sidebar.find(([, slugs]) => slugs.some((s) => docId(s) === id))?.[0];
}
