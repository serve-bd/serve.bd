# serve-site

Marketing site and docs for [Serve](https://github.com/serve-bd/serve). A fully static site.

Astro, Starlight (docs), Tailwind CSS 4, React + Base UI (only for the few interactive parts), Biome, TypeScript and Bun.
The colors, fonts and status lamp come from the Serve dashboard (`src/styles/tokens.css`).

```bash
bun install
bun dev          # http://localhost:7070 (runs in the background: astro dev stop | status | logs)
bun run build    # static files in dist/
bun run preview
bun run check    # Biome, then astro check
bun run build && bun run check:links   # every internal link and #section must exist
```

## Layout

- `src/pages`: landing page, `/features`, `/templates`, 404
- `src/content/docs/docs/*.mdx`: docs pages, served at `/docs/...`
- `src/lib/docs.ts`: docs sidebar order
- `src/styles/tokens.css`: Serve design tokens, shared by both parts
- `src/styles/site.css`: marketing pages; `src/styles/docs.css`: Starlight in Serve's style
- `src/components/starlight`: Starlight overrides (header, page title)
- `src/components/react`: interactive islands (theme, FAQ, template search, copy, mobile menu)
- `src/data/templates.json`, `public/templates`: the template catalog, copied from `serve/templates`

## Add a docs page

1. Write `src/content/docs/docs/<slug>.mdx` with `title` and `description` in the frontmatter.
2. Add the slug to `src/lib/docs.ts`.

Use Starlight asides (`:::note`, `:::tip`, `:::caution`) and components such as `LinkCard` and `CardGrid`.

## API reference

`/docs/api/<group>/` pages are built from `src/data/openapi.json` (one page per tag, endpoints with
permissions, fields and a curl example). After a Serve release, refresh it from any instance:

```bash
bun run api:sync https://serve.example.com
```

The getting-started guide is `src/content/docs/docs/api.mdx`.

## Share image

`public/og.png` is the 1200 × 630 picture that link previews show. Its source is
`scripts/og/og.html`; after changing it, run `bash scripts/og/render.sh` (needs Chromium).

## Feature pages

`src/pages/features/*.astro`, each with a canvas drawing in `src/components/site/*Canvas.astro`, built from
`CanvasCard`, `CanvasPill` and `CanvasDefs` to look like the dashboard's project canvas. Labels sit above lines,
and every drawing has a wide and a phone version. List a new page in `featurePages` in `src/lib/site.ts`
so it shows in the Features menu.

## Hosting

`dist/` is plain files. Any web server works. One redirect is needed: `/install.sh` must go to the
installer on GitHub, so `curl -fsSL https://serve.bd/install.sh | bash` always gets the latest one.
Use a temporary redirect (302 or 307) so nobody caches an old copy.

- Cloudflare Pages and Netlify: `public/_redirects` does it.
- nginx:

  ```nginx
  location = /install.sh {
    return 302 https://raw.githubusercontent.com/serve-bd/serve/main/install.sh;
  }
  ```

- Caddy:

  ```caddy
  redir /install.sh https://raw.githubusercontent.com/serve-bd/serve/main/install.sh 302
  ```
