import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { Check, Copy } from "lucide-react";
import * as React from "react";
import { Tooltip } from "@/components/react/ui/tooltip";
import { cn } from "@/lib/utils";

export function CopyButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);
  return (
    <BaseTooltip.Provider delay={300}>
      <Tooltip content={copied ? "Copied" : "Copy"}>
        <button
          type="button"
          aria-label="Copy"
          onClick={() => {
            navigator.clipboard.writeText(value);
            setCopied(true);
          }}
          className={cn("inline-flex size-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-hover hover:text-fg [&_svg]:size-3.5", className)}
        >
          {copied ? <Check className="text-ok" /> : <Copy />}
        </button>
      </Tooltip>
    </BaseTooltip.Provider>
  );
}
