import { Menu as BaseMenu } from "@base-ui/react/menu";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import * as React from "react";
import { buttonVariants } from "@/components/react/ui/button";
import { Menu, MenuContent, MenuTrigger } from "@/components/react/ui/menu";

// Same storage as Starlight's theme picker, so the docs and these pages agree.
const storageKey = "starlight-theme";
type Theme = "auto" | "light" | "dark";

const options = [
  { value: "auto", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
] as const;

function apply(theme: Theme) {
  const resolved = theme === "auto" ? (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark") : theme;
  document.documentElement.dataset.theme = resolved;
  try {
    localStorage.setItem(storageKey, theme === "auto" ? "" : theme);
  } catch {}
}

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<Theme>("auto");
  React.useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(storageKey);
    } catch {}
    const current: Theme = stored === "light" || stored === "dark" ? stored : "auto";
    setTheme(current);
    const media = matchMedia("(prefers-color-scheme: light)");
    const onChange = () => current === "auto" && apply("auto");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  return (
    <Menu>
      <MenuTrigger className={buttonVariants({ variant: "ghost", size: "icon" })} aria-label="Theme">
        <Sun className="dark:hidden" />
        <Moon className="hidden dark:block" />
      </MenuTrigger>
      <MenuContent className="min-w-36">
        <BaseMenu.RadioGroup
          value={theme}
          onValueChange={(value) => {
            setTheme(value as Theme);
            apply(value as Theme);
          }}
        >
          {options.map(({ value, label, icon: Icon }) => (
            <BaseMenu.RadioItem
              key={value}
              value={value}
              className="flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-fg-2 outline-none select-none data-[highlighted]:bg-hover data-[highlighted]:text-fg [&_svg]:size-4 [&_svg]:text-muted"
            >
              <Icon />
              <span className="flex-1">{label}</span>
              <BaseMenu.RadioItemIndicator>
                <Check />
              </BaseMenu.RadioItemIndicator>
            </BaseMenu.RadioItem>
          ))}
        </BaseMenu.RadioGroup>
      </MenuContent>
    </Menu>
  );
}
