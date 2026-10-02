import { Accordion } from "@base-ui/react/accordion";
import { Plus } from "lucide-react";

export function Faq({ items }: { items: { q: string; a: React.ReactNode }[] }) {
  return (
    <Accordion.Root className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <Accordion.Item key={item.q}>
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between gap-6 py-5 text-left text-[15.5px] font-medium text-fg outline-none focus-visible:text-accent">
              {item.q}
              <Plus className="size-4 shrink-0 text-muted transition-transform duration-200 ease-[var(--ease-out-quint)] group-data-[panel-open]:rotate-45" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel className="h-[var(--accordion-panel-height)] overflow-hidden transition-[height] duration-200 ease-[var(--ease-out-quint)] data-[ending-style]:h-0 data-[starting-style]:h-0">
            <div className="max-w-2xl pb-5 text-[15px] leading-relaxed text-muted">{item.a}</div>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
