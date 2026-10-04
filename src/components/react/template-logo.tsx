import { cn } from "@/lib/utils";

/**
 * A template's logo or its initial. Most logos are white glyphs on the brand color, so they need the color in
 * both themes. Full-colour logos are drawn for light backgrounds: a white tile in both themes.
 */
export function TemplateLogo({ name, logo, color, fullColor, className }: { name: string; logo: string | null; color: string | null; fullColor?: boolean; className?: string }) {
  if (logo && fullColor) {
    return (
      <span className={cn("flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-white", className)}>
        <img src={logo} alt="" className="size-[70%] object-contain" loading="lazy" />
      </span>
    );
  }
  return (
    <span
      className={cn("flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line", className)}
      style={{ background: color ?? "var(--muted)" }}
    >
      {logo ? <img src={logo} alt="" className="size-[62%] object-contain" loading="lazy" /> : <span className="text-sm font-semibold text-white">{name[0]}</span>}
    </span>
  );
}
