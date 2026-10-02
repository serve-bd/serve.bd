# Working on serve.bd

How to build and change the serve.bd website.

## Develop

```bash
bun install
bun dev          # http://localhost:7070, runs in the background: astro dev stop | status | logs
bun run build    # static files in dist/
bun run preview
bun run check    # Biome, then astro check
bun run build && bun run check:links   # every internal link and #section must exist
```

If a React part of a page stays empty in `bun dev`, the dev server's dependency cache is stale. Run
`bunx astro dev stop && rm -rf node_modules/.vite`, then `bun dev` again. Production builds are not
affected.

## Layout

| Path | What it holds |
| --- | --- |
| `src/pages` | Landing page, `/features`, `/templates`, the API reference pages, 404 |
| `src/pages/features/*.astro` | One page per feature |
| `src/content/docs/docs/*.mdx` | Docs pages, served at `/docs/...` |
| `src/lib/docs.ts` | Docs sidebar order |
| `src/lib/site.ts` | Name, tagline, version, install command, feature pages, header links |
| `src/lib/openapi.ts` | Reads the OpenAPI spec for the API reference |
| `src/components/site` | Header, footer, sections and the canvas drawings |
| `src/components/starlight` | Starlight overrides: header, sidebar, page title |
| `src/components/react` | Interactive islands: Features menu, theme, FAQ, template search, copy, mobile menu |
| `src/components/api` | Endpoint and field lists of the API reference |
| `src/styles` | `tokens.css` (Serve design tokens), `site.css` (marketing), `docs.css` (Starlight in Serve's style) |
| `src/data` | `templates.json` (catalog, copied from `serve/templates`) and `openapi.json` |
| `scripts` | API, installer and template sync, link check, share image |

## Add a docs page

1. Write `src/content/docs/docs/<slug>.mdx` with `title` and `description` in the frontmatter.
2. Add the slug to its group in `src/lib/docs.ts`.

Use Starlight asides (`:::note`, `:::tip`, `:::caution`, `:::danger`) and components such as `LinkCard`
and `CardGrid`. Write in plain words, with no em dashes, and never name other products.

## Add a feature page

1. Write `src/pages/features/<slug>.astro`. Copy an existing page for the hero, sections and call to action.
2. Draw its canvas in `src/components/site/<Name>Canvas.astro` from `CanvasCard`, `CanvasPill` and
   `CanvasDefs`, so it looks like the dashboard's project canvas. Labels sit above lines, animations
   never loop back to an earlier state, and every drawing has a wide and a phone version.
3. Add it to `featurePages` in `src/lib/site.ts` and give it an icon in
   `src/components/react/features-menu.tsx`.

## API reference

`/docs/api/<group>/` pages are built from `src/data/openapi.json`: one page per tag, with each endpoint's
permissions, fields and a curl example. After a Serve release, refresh it from a running instance or a
saved spec file:

```bash
bun run api:sync https://serve.example.com
bun run api:sync ./openapi.json
```

The getting-started guide is `src/content/docs/docs/api.mdx`. The version shown on the site is `version`
in `src/lib/site.ts`.

## Templates

`src/data/templates.json` and the logos in `public/templates` come from the `templates` folder of the Serve
repository. After templates change there, copy them over:

```bash
bun run templates:sync ../serve
```

The templates page, the counts on the landing and feature pages, and the search all read this file. The table
of categories in `src/content/docs/docs/templates.mdx` is written by hand: update it too.

## Share image

`public/og.png` is the 1200 × 630 picture that link previews show. Its source is `scripts/og/og.html`.
After changing it, run `bash scripts/og/render.sh` (needs Chromium).

## License

Apache 2.0, like Serve.
