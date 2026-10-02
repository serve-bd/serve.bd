# Working on serve.bd

How to build, change and deploy the serve.bd website.

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
| `scripts` | API sync, link check, share image |
| `docker` | nginx config for the Docker image |

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

## Share image

`public/og.png` is the 1200 × 630 picture that link previews show. Its source is `scripts/og/og.html`.
After changing it, run `bash scripts/og/render.sh` (needs Chromium).

## Deploy

One redirect is needed: `/install.sh` must go to the installer on GitHub, so
`curl -fsSL https://serve.bd/install.sh | bash` always gets the latest one. Use a temporary redirect
(302 or 307) so nobody caches an old copy.

### With Serve or Docker

The `Dockerfile` builds the site with Bun and serves it with nginx on port 80. `docker/nginx.conf` has
the `/install.sh` redirect, the 404 page and long caching for the hashed files in `/_astro/`.

On Serve:

1. Add this repository as a Git app.
2. Pick the **Dockerfile** builder and port **80**.
3. Add the domain `serve.bd`.

Anywhere else:

```bash
docker build -t serve-site .
docker run -p 8080:80 serve-site
```

### Other hosts

`dist/` is plain files, so any web server works.

- Cloudflare Pages and Netlify: `public/_redirects` sets up the redirect.
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

## License

Apache 2.0, like Serve.
