# DirectRent Website

Investor-grade landing page for DirectRent — Verified Connections. Transparent Renting.

## Local setup

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build

```bash
npm run build
```

## Cloudflare Pages deployment

1. Push this project to GitHub.
2. In Cloudflare Pages, create a new project from the repository.
3. Framework preset: Next.js.
4. Build command:

```bash
npx @cloudflare/next-on-pages@latest
```

5. Build output directory:

```bash
.vercel/output/static
```

6. Add custom domain: `directrent.app`.
7. Configure DNS so `directrent.app` points to Cloudflare Pages.

Optional CLI deploy:

```bash
npm run pages:build
npm run deploy
```
