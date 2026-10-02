import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { Menu as MenuIcon, X } from "lucide-react";
import { buttonVariants } from "@/components/react/ui/button";
import { featurePages, nav } from "@/lib/site";
import { cn } from "@/lib/utils";

export function MobileNav() {
  return (
    <BaseDialog.Root>
      <BaseDialog.Trigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "md:hidden")} aria-label="Menu">
        <MenuIcon />
      </BaseDialog.Trigger>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed inset-0 z-50 bg-[var(--backdrop)] transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <BaseDialog.Popup className="fixed inset-y-0 right-0 z-50 flex w-[min(320px,85vw)] flex-col overflow-y-auto border-l border-line bg-surface p-4 shadow-lg outline-none transition-transform duration-300 ease-[var(--ease-out-quint)] data-[ending-style]:translate-x-full data-[starting-style]:translate-x-full">
          <div className="mb-4 flex items-center justify-between">
            <BaseDialog.Title className="font-display text-[17px] font-semibold text-fg">Serve</BaseDialog.Title>
            <BaseDialog.Close className={buttonVariants({ variant: "ghost", size: "icon" })} aria-label="Close">
              <X />
            </BaseDialog.Close>
          </div>
          <nav className="flex flex-col">
            {nav.map((item) => (
              <div key={item.href} className="flex flex-col">
                <a href={item.href} {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})} className="rounded-md px-2 py-2 text-[15px] text-fg-2 hover:bg-hover">
                  {item.label}
                </a>
                {item.label === "Features" &&
                  featurePages.map((f) => (
                    <a key={f.href} href={f.href} className="ml-2 rounded-md border-l border-line py-1.5 pl-3 text-[14px] text-muted hover:text-fg">
                      {f.label}
                    </a>
                  ))}
              </div>
            ))}
          </nav>
          <a href="/docs/installation/" className={cn(buttonVariants({ variant: "primary" }), "mt-4")}>
            Install
          </a>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
