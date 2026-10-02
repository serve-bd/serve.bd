import { cn } from "@/lib/utils";

/** A template's logo or its initial, on its brand color. The logos are white glyphs, so they need the color in both themes. */
export function TemplateLogo({ name, logo, color, className }: { name: string; logo: string | null; color: string | null; className?: string }) {
  return (
    <span
      className={cn("flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line", className)}
      style={{ background: color ?? "var(--muted)" }}
    >
      {logo ? <img src={logo} alt="" className="size-[62%] object-contain" loading="lazy" /> : <span className="text-sm font-semibold text-white">{name[0]}</span>}
    </span>
  );
}
