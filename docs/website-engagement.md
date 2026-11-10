# Website engagement: local implementation and verification

## Review pages

- Local Cloudflare preview: http://127.0.0.1:3019/
- Feedback form: http://127.0.0.1:3019/feedback
- Property comments: http://127.0.0.1:3019/properties/901
- Authorized admin feedback/comments/statistics: http://127.0.0.1:3019/admin/website (linked from the existing dashboard and navigation).

The preview API is http://127.0.0.1:8020, using only `/tmp/directrent-public-preview-901.sqlite`. No production database, domain or deployment was changed.

## Storage and permissions

New `web_submissions`, `web_metrics` and `web_rate_limits` tables keep this separate from app reviews. `scripts/migrate_web_engagement.py` follows the existing additive, idempotent migration pattern: dry run by default, `--apply` to create only these tables. Tested on isolated SQLite; the local preview migration is already applied. A production migration/deployment remains a separate release step.

All `/web/admin/*` routes use the existing `require_mfa_admin` guard. Moderator changes use the existing audit service, recording actor and old/new status. Private feedback is never returned from public endpoints. Public comment responses explicitly allow only id, approved text and creation time; there are no author/contact or moderation-note fields. They only serve eligible properties. Comments start Pending, and can be approved or rejected by admins. Moderators should review text for contact details and exact addresses before approving. Email, phone-number and link patterns are rejected server-side as well as bounded plain-text validation. Feedback is private even if it contains sensitive text; the form asks visitors to leave that out.

## Spam and analytics

Submissions have a honeypot and database-backed fixed-minute rate limits (five per feedback/comment lane, 120 events). Rate rows use an HMAC of the peer IP with a daily salt and expire after two minutes; expired rows are removed on subsequent writes. No raw IP is persisted by this feature. Forwarding headers supplied by callers are ignored. Production proxy trust must be configured at the server boundary so request.client reflects trusted proxy handling; a shared proxy address can otherwise make the limit apply to several visitors together.

Events permit only search, no_results, property_view, app_click, store_click; fixed neighbourhood categories, bounded eligible listing IDs and fixed click targets. Unknown search text becomes `other` in the browser and is never sent to analytics. No user/session/contact/coordinate/free-text fields are accepted. Database metrics are daily aggregate increments, with no individual event history or visitor tracking cookie. These are self-reported event counts, not unique people or verified installs. Store and app clicks have separate counters. No unverified store URLs were added; the store-click check uses a synthetic API event.

## Verification

- API: `.venv/bin/python -m pytest tests/test_web_engagement.py tests/test_public_web_catalog.py tests/test_admin_mfa_boundary.py -q` with `DATABASE_URL=sqlite://`; actual JWT/MFA guards, no auth dependency bypass.
- Website: `npm run build`; Cloudflare artifact via `NEXT_PUBLIC_API_URL=http://127.0.0.1:8020 PUBLIC_API_URL=http://127.0.0.1:8020 node node_modules/@cloudflare/next-on-pages/bin/index.js`.
- Browser: `python3 tools/check_engagement_cdp.py` uses Chromium CDP on port 9337. Verified feedback submission -> authorized admin, pending invisibility, approval through admin UI -> public appearance on property 901, rejection -> continued invisibility, unauthenticated API denial, and browser-generated search/no-results/view/app-click aggregate increases. A synthetic store event verifies its separate count and installs remain unmeasured.
- Screenshots: `/tmp/directrent-engagement-admin-feedback.png`, `/tmp/directrent-engagement-approved.png`, `/tmp/directrent-engagement-admin-stats.png`.
- Existing public journey browser tests also rerun at 1440×1000, 390×844 and 320×740.

The synthetic helper `engagement-init` provisions local-only MFA test data and a short-lived signed test session in `/tmp/directrent-web-preview.token` (mode 0600); its key is in `/tmp/directrent-web-preview.key`. These never enter the repository or build artifact. Browser tests load that session into sessionStorage. This checks actual authorization on a synthetic session; the password/TOTP login UI was not exercised by this browser test. Production sign-in is unchanged. A browser tab with that session can review admin data until expiration; normal browsers must log in with an authorized admin account. To regenerate the local session: `DATABASE_URL=sqlite:////tmp/directrent-public-preview-901.sqlite .venv/bin/python -m tools.public_preview engagement-init` in the backend repo.

Remaining verification: remote Cloudflare/staging, real admin account sign-in on staging, and production proxy rate-limit behavior. These do not block local implementation. Rebuild with the intended API origin before release; the current preview artifact embeds localhost.

Final results: **40 API tests passed** (engagement, catalogue and existing admin MFA boundary suite); final Next.js build and Cloudflare adapter build passed; browser engagement checks passed again on the final artifact. Existing three-viewport public-journey checks passed. A no-rebuild HTTP regression marked synthetic property 901 occupied, verified 404 and sitemap exclusion, then restored it through request_review/review_listing and verified raw SSR title, TZS price, canonical and sitemap inclusion. Both repositories passed `git diff --check`. The preview remains local and running.
