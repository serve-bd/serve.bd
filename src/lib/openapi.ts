import json from "@/data/openapi.json";

/*
 * The API reference is built from src/data/openapi.json (refresh it with scripts/sync-openapi.ts).
 * These helpers turn the spec into what the pages show: groups, endpoints, fields and curl examples.
 */

export type Schema = {
  type?: string | string[];
  const?: unknown;
  enum?: unknown[];
  default?: unknown;
  description?: string;
  properties?: Record<string, Schema>;
  required?: string[];
  items?: Schema;
  oneOf?: Schema[];
  anyOf?: Schema[];
  additionalProperties?: boolean | Schema;
  minimum?: number;
  maximum?: number;
};

type Parameter = { name: string; in: "path" | "query"; required?: boolean; schema?: Schema; description?: string };
type Operation = {
  tags: string[];
  summary: string;
  description?: string;
  operationId: string;
  "x-permissions"?: string[];
  parameters?: Parameter[];
  requestBody?: { content?: { "application/json"?: { schema?: Schema } } };
};

export type Endpoint = {
  id: string;
  method: string;
  path: string;
  summary: string;
  description: string;
  permissions: string[];
  pathParams: Parameter[];
  queryParams: Parameter[];
  body: Schema | null;
};

const METHODS = ["get", "post", "put", "patch", "delete"] as const;

const spec = json as unknown as {
  info: { version: string };
  tags: { name: string; description?: string }[];
  paths: Record<string, Record<string, Operation>>;
  components: { "x-permissions": { id: string; label: string; description: string }[] };
};

export const apiVersion = spec.info.version;

export const slugOf = (tag: string) => tag.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const permissionInfo = new Map<string, { label: string; description: string }>(spec.components["x-permissions"].map((p) => [p.id, p]));
permissionInfo.set("admin", { label: "Admin", description: "Organization admin." });
permissionInfo.set("instance", { label: "Instance admin", description: "Admin token whose owner is an admin of the Root organization." });

export function permissionLabel(id: string) {
  return permissionInfo.get(id)?.label ?? id;
}
export function permissionDescription(id: string) {
  return permissionInfo.get(id)?.description ?? "";
}

/** The spec repeats the permissions in each description ("Needs: ..."); the page shows them as badges instead. */
function cleanDescription(text = "") {
  return text
    .split("\n\n")
    .filter((p) => !p.startsWith("Needs:"))
    .join("\n\n")
    .trim();
}

function endpointsOf(tag: string): Endpoint[] {
  const out: Endpoint[] = [];
  for (const [path, item] of Object.entries(spec.paths)) {
    for (const method of METHODS) {
      const op = item[method];
      if (!op || op.tags[0] !== tag) continue;
      const params = op.parameters ?? [];
      out.push({
        id: op.operationId,
        method: method.toUpperCase(),
        path,
        summary: op.summary,
        description: cleanDescription(op.description),
        permissions: op["x-permissions"] ?? [],
        pathParams: params.filter((p) => p.in === "path"),
        queryParams: params.filter((p) => p.in === "query"),
        body: op.requestBody?.content?.["application/json"]?.schema ?? null,
      });
    }
  }
  return out;
}

export const groups = spec.tags.map((t) => ({
  name: t.name,
  slug: slugOf(t.name),
  description: t.description ?? "",
  endpoints: endpointsOf(t.name),
}));

export const operationCount = groups.reduce((n, g) => n + g.endpoints.length, 0);

/** A short type label, like "string", "integer", "string | null" or "postgres | mysql". */
export function typeLabel(s: Schema): string {
  if (s.const !== undefined) return JSON.stringify(s.const);
  if (s.enum) return s.enum.map((v) => String(v)).join(" | ");
  if (s.oneOf || s.anyOf) return [...new Set((s.oneOf ?? s.anyOf ?? []).map(typeLabel))].join(" | ");
  if (Array.isArray(s.type)) return s.type.join(" | ");
  if (s.type === "array") return s.items ? `${typeLabel(s.items)}[]` : "array";
  return s.type ?? "any";
}

export type Field = { name: string; type: string; required: boolean; description: string; defaultValue?: string };

export function fieldsOf(s: Schema): Field[] {
  const required = new Set(s.required ?? []);
  return Object.entries(s.properties ?? {}).map(([name, p]) => ({
    name,
    type: typeLabel(p),
    required: required.has(name),
    description: p.description ?? "",
    defaultValue: p.default !== undefined ? JSON.stringify(p.default) : undefined,
  }));
}

/** Body variants: one for a plain body, several for a body that is one of a few shapes (like POST /services). */
export function variantsOf(s: Schema): { label: string | null; schema: Schema }[] {
  const options = s.oneOf ?? s.anyOf;
  if (!options) return [{ label: null, schema: s }];
  return options.map((v) => {
    const tagged = Object.entries(v.properties ?? {}).find(([, p]) => p.const !== undefined);
    return { label: tagged ? `${tagged[0]}: ${JSON.stringify(tagged[1].const)}` : null, schema: v };
  });
}

// --- curl examples --------------------------------------------------------------------------

const SAMPLE: Record<string, unknown> = {
  name: "web",
  hostname: "app.example.com",
  email: "dev@example.com",
  image: "nginx:alpine",
  repository: "acme/web",
  branch: "main",
  engine: "postgres",
  command: "npm run cleanup",
  schedule: "0 3 * * *",
  url: "https://example.com",
};

function sampleValue(name: string, s: Schema): unknown {
  if (s.const !== undefined) return s.const;
  if (s.enum) return s.enum[0];
  if (s.default !== undefined) return s.default;
  if (s.oneOf || s.anyOf) return sampleValue(name, (s.oneOf ?? s.anyOf ?? [])[0]);
  if (name in SAMPLE) return SAMPLE[name];
  const type = Array.isArray(s.type) ? s.type.find((t) => t !== "null") : s.type;
  if (name.endsWith("Id")) return `<${name}>`;
  switch (type) {
    case "integer":
    case "number":
      return s.minimum !== undefined && s.minimum > 0 ? s.minimum : 1;
    case "boolean":
      return true;
    case "array":
      return s.items ? [sampleValue(name, s.items)] : [];
    case "object":
      if (s.properties && Object.keys(s.properties).length) return sampleObject(s);
      return name === "variables" ? { KEY: "value" } : {};
    default:
      return `<${name}>`;
  }
}

function sampleObject(s: Schema): Record<string, unknown> {
  const props = Object.entries(s.properties ?? {});
  const required = new Set(s.required ?? []);
  // Required fields; with none, the first field shows the shape.
  const picked = props.filter(([k]) => required.has(k));
  const use = picked.length ? picked : props.slice(0, 1);
  return Object.fromEntries(use.map(([k, p]) => [k, sampleValue(k, p)]));
}

const envName = (param: string) => param.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase();

/** A copy-paste curl command. Uses $SERVE_URL (https://<instance>/api/v1) and $SERVE_TOKEN. */
export function curlExample(e: Endpoint, body: Schema | null = e.body): string {
  const path = e.path.replace(/\{(\w+)\}/g, (_, p: string) => `$${envName(p)}`);
  const query = e.queryParams.filter((q) => q.required).map((q) => `${q.name}=${encodeURIComponent(String(sampleValue(q.name, q.schema ?? {})))}`);
  const url = `"$SERVE_URL${path}${query.length ? `?${query.join("&")}` : ""}"`;
  const lines = [e.method === "GET" ? `curl ${url}` : `curl -X ${e.method} ${url}`, `  -H "Authorization: Bearer $SERVE_TOKEN"`];
  if (body) {
    lines.push(`  -H "Content-Type: application/json"`);
    lines.push(`  -d '${JSON.stringify(sampleObject(body.oneOf || body.anyOf ? (body.oneOf ?? body.anyOf ?? [])[0] : body))}'`);
  }
  return lines.join(" \\\n");
}

/** Spec text to HTML paragraphs: escapes it and turns `code` into <code>. */
export function textToHtml(text: string) {
  const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return text
    .split("\n\n")
    .map((p) => `<p>${escapeHtml(p).replace(/`([^`]+)`/g, "<code>$1</code>")}</p>`)
    .join("");
}
