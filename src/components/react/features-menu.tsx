import { Menu as BaseMenu } from "@base-ui/react/menu";
import { Boxes, ChevronDown, GitBranch, GitPullRequest, Globe, LayoutGrid, Rocket, Router, Users } from "lucide-react";
import { featurePages } from "@/lib/site";
import { cn } from "@/lib/utils";

const icons: Record<string, typeof Rocket> = {
  "/features/git-to-production/": Rocket,
  "/features/pull-request-previews/": GitPullRequest,
  "/features/database-branching/": GitBranch,
  "/features/one-click-services/": Boxes,
  "/features/domains-and-https/": Globe,
  "/features/servers-without-public-ip/": Router,
  "/features/teams/": Users,
};

/** "Features" in the header: opens on hover or click, with the feature pages and the overview. */
export function FeaturesMenu({ active }: { active?: boolean }) {
  return (
    <BaseMenu.Root>
      <BaseMenu.Trigger
        openOnHover
        delay={80}
        className={cn(
          "group flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[13.5px] transition-colors outline-none hover:text-fg data-[popup-open]:text-fg",
          active ? "text-fg" : "text-muted",
        )}
      >
        Features
        <ChevronDown className="size-3.5 transition-transform duration-150 group-data-[popup-open]:rotate-180" />
      </BaseMenu.Trigger>
      <BaseMenu.Portal>
        <BaseMenu.Positioner align="start" sideOffset={8} className="z-50 outline-none">
          <BaseMenu.Popup className="grid w-[min(40rem,calc(100vw-2rem))] grid-cols-2 gap-0.5 origin-[var(--transform-origin)] rounded-2xl border border-line bg-surface/95 p-1.5 shadow-lg backdrop-blur-xl outline-none transition-[transform,opacity] duration-150 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
            {featurePages.map((f) => {
              const Icon = icons[f.href] ?? LayoutGrid;
              return (
                <BaseMenu.LinkItem key={f.href} href={f.href} closeOnClick className="flex gap-3 rounded-xl p-2.5 no-underline outline-none data-[highlighted]:bg-hover">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-line bg-bg text-fg-2">
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13.5px] font-medium text-fg">{f.label}</span>
                    <span className="block text-[12.5px] leading-snug text-muted">{f.text}</span>
                  </span>
                </BaseMenu.LinkItem>
              );
            })}
            <BaseMenu.Separator className="col-span-2 -mx-1.5 my-1.5 h-px bg-line" />
            <BaseMenu.LinkItem
              href="/features/"
              closeOnClick
              className="col-span-2 flex items-center gap-2 rounded-xl px-2.5 py-2 no-underline text-[13px] text-fg-2 outline-none data-[highlighted]:bg-hover"
            >
              <LayoutGrid className="size-4 text-muted" />
              All features
            </BaseMenu.LinkItem>
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  );
}
