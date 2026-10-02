import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { apiSidebar, docId, sidebar } from "./src/lib/docs";
import { site } from "./src/lib/site";

export default defineConfig({
  site: site.url,
  integrations: [
    react(),
    starlight({
      title: site.name,
      // The site has its own 404 page.
      disable404Route: true,
      description: site.tagline,
      favicon: "/icon.svg",
      head: [
        { tag: "link", attrs: { rel: "icon", href: "/favicon.ico", sizes: "16x16 32x32 48x48" } },
        { tag: "meta", attrs: { property: "og:image", content: `${site.url}/og.png` } },
        { tag: "meta", attrs: { property: "og:image:width", content: "1200" } },
        { tag: "meta", attrs: { property: "og:image:height", content: "630" } },
        { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } },
        { tag: "meta", attrs: { name: "twitter:image", content: `${site.url}/og.png` } },
      ],
      social: [{ icon: "github", label: "GitHub", href: site.github }],
      customCss: ["./src/styles/docs.css"],
      components: {
        Header: "./src/components/starlight/Header.astro",
        Sidebar: "./src/components/starlight/Sidebar.astro",
        PageTitle: "./src/components/starlight/PageTitle.astro",
      },
      expressiveCode: {
        themes: ["github-dark-dimmed", "github-light"],
        // Plain blocks with a copy button, no editor or terminal chrome.
        defaultProps: { frame: "none" },
        styleOverrides: {
          borderRadius: "12px",
          borderColor: "var(--line)",
          codeBackground: "var(--surface)",
          codeFontFamily: "var(--font-mono)",
          codeFontSize: "13px",
          uiFontFamily: "var(--font-sans)",
        },
      },
      sidebar: [...sidebar.map(([label, slugs]) => ({ label, items: slugs.map(docId) })), apiSidebar],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    // Prepare the islands' libraries when the dev server starts. Found later, Vite re-bundles them and
    // pages that already loaded fail to hydrate ("Outdated Optimize Dep"). Dev only.
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "lucide-react",
        "clsx",
        "tailwind-merge",
        "class-variance-authority",
        "@base-ui/react/accordion",
        "@base-ui/react/dialog",
        "@base-ui/react/menu",
        "@base-ui/react/toggle",
        "@base-ui/react/toggle-group",
        "@base-ui/react/tooltip",
      ],
    },
  },
});
