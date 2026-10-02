import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { ArrowUpRight, Search } from "lucide-react";
import * as React from "react";
import { TemplateLogo } from "@/components/react/template-logo";
import type { Template } from "@/lib/templates";

export function TemplateCatalog({ templates, categories }: { templates: Template[]; categories: string[] }) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("All");

  // The page is static: links like /templates/?q=Ghost fill the search once it loads.
  React.useEffect(() => {
    const q = new URLSearchParams(location.search).get("q");
    if (q) setQuery(q);
  }, []);

  const shown = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return templates.filter((t) => (category === "All" || t.category === category) && (!q || `${t.name} ${t.description} ${t.category}`.toLowerCase().includes(q)));
  }, [templates, query, category]);

  return (
    <div>
      <div className="sticky top-14 z-10 -mx-4 flex flex-col gap-3 border-b border-line bg-bg/85 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <label className="flex h-10 items-center gap-2.5 rounded-xl border border-line bg-surface px-3.5 shadow-sm focus-within:border-line-strong">
          <Search className="size-4 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${templates.length} templates…`}
            className="h-full flex-1 bg-transparent text-[15px] text-fg outline-none placeholder:text-faint"
          />
          <span className="font-mono text-[12px] text-faint">{shown.length}</span>
        </label>
        <ToggleGroup value={[category]} onValueChange={(v) => setCategory(v[0] ?? "All")} className="scrollbar-none flex gap-1.5 overflow-x-auto" aria-label="Category">
          {["All", ...categories].map((c) => (
            <Toggle
              key={c}
              value={c}
              className="h-7 shrink-0 rounded-full border border-line bg-surface px-3 text-[13px] text-muted transition-colors hover:text-fg data-[pressed]:border-fg data-[pressed]:bg-fg data-[pressed]:text-bg"
            >
              {c}
            </Toggle>
          ))}
        </ToggleGroup>
      </div>
      {shown.length === 0 ? (
        <p className="py-24 text-center text-muted">No templates match “{query}”.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 py-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((t) => (
            <li key={t.id} className="group flex gap-3.5 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-line-strong">
              <TemplateLogo name={t.name} logo={t.logo} color={t.color} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-[15px] font-medium text-fg">{t.name}</span>
                  {t.website && (
                    <a
                      href={t.website}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${t.name} website`}
                      className="ml-auto text-faint opacity-0 transition-opacity group-hover:opacity-100 hover:text-fg"
                    >
                      <ArrowUpRight className="size-4" />
                    </a>
                  )}
                </div>
                <p className="mt-0.5 line-clamp-2 text-[13.5px] leading-snug text-muted">{t.description}</p>
                <p className="mt-2 font-mono text-[11px] text-faint">{t.category}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
