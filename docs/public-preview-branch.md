# Dedicated public marketplace preview branch

## Prepared locally; not pushed

- Repository: Said199710/directrent-website
- Pages project: `directrent`, confirmed by the owner as serving directrent.app, www.directrent.app and admin.directrent.app.
- Production branch: `main`, automatic deployment, remote head `c5c3d5a272369d9c857eb87810102a212f9e624c` at read-only inspection.
- Existing admin preview: `staging/admin-refresh`, remote head `275f565dbd6f064642e59c03dc59bd2a39f4e47f` at inspection. Its worktree and ref are untouched.
- New local branch: `staging/public-marketplace`, based on the confirmed main head, isolated at `/tmp/directrent-public-marketplace-preview`.
- No remote branch push, Pages deployment, settings mutation, database migration or remote write test has been performed.

The changes include the public catalogue, SSR property pages, dynamic sitemap, download/handoff UI and association generators, private feedback/moderated-comment/admin-statistics UI, their two small existing-admin navigation links, and review documentation/browser checks. Payments, withdrawals, unrelated admin refresh changes, backend/mobile working-tree edits, local credentials, APKs, caches, build outputs and bytecode are excluded. This branch depends on separately deployed staging API changes from the backend repository; putting website code on a branch does not deploy those API changes.

## Environment finding and fail-closed build

Both existing website worktrees' tracked `.env.production` files point to `https://api.directrent.app`. The known successful admin preview therefore cannot be treated as proof of an isolated API/database. The Cloudflare dashboard's actual environment overrides and Preview branch include/exclude rules remain uninspected because account read access is unavailable. Owner-provided screenshots confirmed project/domain/main/admin-preview identity, not those settings.

`tools/public-preview-environment.mjs` now requires `STAGING_PUBLIC_API_URL` whenever CF_PAGES_BRANCH starts with `staging/public-marketplace` (or DIRECTRENT_REQUIRE_STAGING_API=1). It rejects known production origins, localhost/private-IP origins, credentials, paths and query strings. The resolved value sets BOTH PUBLIC_API_URL (SSR) and NEXT_PUBLIC_API_URL (browser/admin UI). The tracked production fallback cannot silently become this branch's preview API. Other branches keep their existing API resolution behavior.

The helper validates the URL configuration only. It cannot certify database isolation from an API hostname. No actual staging-origin build or staging database verification has passed yet.

Validation commands:

- `node tools/check-public-preview-environment.mjs` passed: missing/production/local API values rejected, explicit staging value selected, existing main/admin branch behavior retained.
- Loading the actual Next config with CF_PAGES_BRANCH=staging/public-marketplace and no staging value correctly fails before a build with STAGING_PUBLIC_API_URL required.
- A local-only production compilation with PUBLIC_API_URL and NEXT_PUBLIC_API_URL explicitly set to the existing synthetic loopback API passed. Its output is not a staging artifact and must not be uploaded.
- `git diff --check` passed.

## Required before push or remote writes

1. Read-only Cloudflare Pages access or a settings export showing: production branch remains main; automatic Preview deployment controls include `staging/public-marketplace`; all current admin-preview include/exclude controls remain; and the actual GitHub build command/output/runtime settings for Preview. This is discovery, not authorization to change project-wide settings.
2. Confirm the staging API HTTPS origin and its deployment owner/service. It must serve the public catalogue/detail, authenticated app-detail, `/web` submissions/moderation/events/stats and existing admin password/MFA APIs. It must allow the new Preview origins in CORS without opening production account access.
3. Confirm the staging database identity and secure connection/migration mechanism, explicitly separate from production, with an authorized listing/photo fixture and authorized admin/MFA account. Supply credentials through secure local configuration, not a commit. Only after isolation is verified may the engagement migration or any feedback/comment/rate-limit write test run there.
4. Add STAGING_PUBLIC_API_URL only for the intended Preview build context. Do not replace the shared Preview NEXT_PUBLIC_API_URL globally, since that could change the existing admin preview. This new variable is consumed by this branch's guard; the existing admin branch does not use it. Leave Production values unchanged.
5. Confirm the existing GitHub build path can produce the SSR worker output for this branch: `npm run pages:build` and `.vercel/output/static`, with `nodejs_compat`. If current project-wide settings differ, determine a branch-specific solution rather than changing main/admin behavior. No manual `npm run deploy` or Wrangler direct upload is authorized as a substitute for GitHub Preview.
6. Provide a staging Flutter-Web deployment built against the same isolated API for the cross-application handoff check. Production app-link associations cannot prove staging routing.

## After those prerequisites are confirmed

Rebuild with CF_PAGES_BRANCH=staging/public-marketplace and STAGING_PUBLIC_API_URL set to the confirmed origin. Audit the emitted client and Edge worker modules for the intended API and absence of configured loopback/production API dependencies. Push only this dedicated branch. Observe the GitHub-triggered Cloudflare deployment and confirm project `directrent`, environment label **Preview**, source branch `staging/public-marketplace`, and exact pushed commit SHA before testing its generated HTTPS preview URL. Do not attach production custom domains, merge to main, change the production branch or modify the admin preview.

Apply the engagement migration to the confirmed staging database only. Then run deployed proxy/browser checks for authorized real-photo presentation, search, raw HTML title/price, sitemap and unavailable 404, actual admin password/MFA, private feedback, approved/rejected comments, event aggregates, limits/client-IP behavior, and property/Flutter-Web/download-return flows. These checks are pending, not passed.

## Confirmed Preview build path (current update)

The owner confirmed staging API `https://directrent-backend-staging.onrender.com`, a separate staging database, STAGING_PUBLIC_API_URL in Cloudflare Preview, and all non-production branches enabled. The shared Pages build command is `npx next build`, output `out`. No project-wide settings were changed.

On this exact public branch and only in the Cloudflare production-build phase, next.config.mjs delegates to tools/cloudflare-public-preview-build.mjs. The adapter's child sets DIRECTRENT_ADAPTER_INNER_BUILD=1 so its normal Next build cannot recurse. After the adapter finishes, the bridge verifies the property SSR function and copies the complete generated `.vercel/output/static` tree, including `_worker.js`, into `out`, then exits the outer Next CLI successfully to avoid a duplicate build overwriting the worker. wrangler.toml now also declares `out`. Main/admin branches are excluded by the bridge condition, and their source/configuration remains unchanged.

The actual Next build entry point passed locally with CF_PAGES=1, CF_PAGES_BRANCH=staging/public-marketplace and the confirmed STAGING_PUBLIC_API_URL. The resulting `out` has both property and sitemap Edge functions. The output audit passed for 27 client and 8 worker modules: confirmed staging API present in both, no configured localhost/emulator or production API dependency. `node tools/check-cloudflare-preview-build.mjs` verifies production/admin/dev/recursive invocations do not run the bridge. `tools/audit-public-preview-output.mjs` is the repeatable artifact check.

Read-only staging API verification found the current OpenAPI document lacks `/listings/public-web`, `/listings/app-detail/*` and all `/web` engagement routes. Live GET /listings/public-web returned 405; public comments and admin stats paths returned 404; /admin-console/capabilities returned 401, and password/MFA endpoints exist in OpenAPI. API deployment of the backend changes is required. Database schema/table readiness cannot be certified from OpenAPI or inspected without authorized staging database/admin access. No database migration or remote write test has been run. Do not interpret the owner's separate-database confirmation as proof that the new schema has been installed.

### Push and remote-test blockers

The authorized push command was attempted with the single refspec `HEAD:refs/heads/staging/public-marketplace`. Git rejected it before transfer: `could not read Username for https://github.com: terminal prompts disabled`. No GitHub HTTPS token/helper credentials were available; the SSH agent had no identities. Follow-up remote/SSH requests also encountered DNS failures. No remote branch or Cloudflare deployment was created by this attempt, and no Preview environment label or deployed URL has been verified. Enable repository-scoped GitHub Contents write access through secure local Git authentication, then push only the prepared branch. No broad Cloudflare OAuth grant is needed.

A read-only CORS preflight from `https://staging-public-marketplace.directrent.pages.dev` to the staging API's /web/events returned HTTP 400 without Access-Control-Allow-Origin. That exact Preview alias and any generated commit Preview origin must be authorized in the staging backend's CORS policy. This does not authorize changes to production CORS.

The complete `out` artifact was also loaded by local Cloudflare workerd on port 3022. Static feedback and download-return pages returned HTTP 200. Property and sitemap requests failed HTTP 500 because the local runtime could not resolve the Render API hostname; logs identify `DNS lookup failed` for directrent-backend-staging.onrender.com. These are failed dependency checks, not passed property/sitemap behavior. The confirmed missing routes and schema/admin access remain separate blockers. No remote feedback/comment/moderation writes were attempted, and no staging migration ran. Original synthetic local preview on port 3019 remains separate.
