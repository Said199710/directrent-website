# Property-to-app handoff

## Local review

- Website/property: http://127.0.0.1:3019/properties/901
- Download options with return context: http://127.0.0.1:3019/download?property=901
- Compiled Flutter web target: http://127.0.0.1:3031/#/properties/901 (requires a local synthetic session to load authenticated details).
- Android association preview: http://127.0.0.1:3019/.well-known/assetlinks.json
- iOS association preview: http://127.0.0.1:3019/.well-known/apple-app-site-association

No production domain, database, store account or distributed APK was changed. The current preview artifact embeds the synthetic API origin and, for local association verification only, the measured Android debug/beta certificate. Do not deploy this artifact as a production release.

## Implemented flow

Flutter's built-in deep-link handler receives `https://directrent.app/properties/{id}` on cold and warm launches. Strict parsing accepts only this host/HTTPS scheme or its platform-relative path, positive bounded IDs and optional query parameters. It rejects arbitrary redirect hosts and unsupported paths. Named routes preserve the property ID in the initial navigation stack.

A shared-property screen checks the existing auth token. Missing/expired sessions show the existing LoginScreen with a route-local continuation. Password and Google sign-in both resume this property rather than navigating away to a role home. Normal login behavior is unchanged when there is no property continuation. Registration still returns through the existing login flow. This is link-based continuation, not deferred app-install attribution; after installing, reopen the property link.

The authenticated `/listings/app-detail/{id}` endpoint applies the same eligibility query as the public catalogue and returns the existing app listing representation while omitting exact location, coordinates and reserved payment identifiers. It preserves actual monthly price, minimum rental months, owner identity for reputation display, and media. It returns 404 for unavailable properties. The existing ListingDetailsScreen and its viewing-request dialog are reused. Exact location remains behind the existing viewing approval/location service; the handoff neither auto-requests a viewing nor unlocks a location.

The website's Android action uses a package-targeted HTTPS Android intent with a browser fallback to the current origin's property page. Without JavaScript, its relative property URL also retains browser access. Desktop and current iPhone visitors remain on the property with accurate availability guidance. Download options retain the property ID and provide a safe return link. No arbitrary return URL is accepted. An Android beta download remains available; its existing URL returned HTTP 200, APK content type, 58,491,683-byte Content-Length during verification. No official Google Play, Apple App Store or TestFlight URL was found in the repositories or confirmed by web search, so none is displayed. This does not establish that no listing exists; the owner must supply verified URLs.

`open_app`, `download` and `android_beta` clicks count under app clicks. Google Play/App Store clicks have separate store counters when verified links exist. Neither category is reported as verified installs.

## Actual identifiers and signing

- Android namespace/application ID: `com.example.directrent_app`, confirmed in Gradle and the APK manifest.
- iOS Runner bundle ID: `com.example.directrentApp` in all three Runner build configurations.
- Existing Android Gradle release configuration explicitly uses `signingConfigs.debug`. No dedicated production release keystore configuration was found. Existing local beta and newly built debug APK have this same public certificate SHA-256:

  `CB:0D:49:1F:82:30:45:03:5E:C8:BF:10:33:8F:35:BF:A3:CD:1D:3E:CC:A1:4B:93:DE:29:B3:2E:F3:13:F6:DE`

- Android manifest now enables built-in Flutter deep linking and an auto-verified VIEW/BROWSABLE filter scoped to HTTPS `directrent.app/properties/`.
- iOS Info.plist enables Flutter deep links. Runner.entitlements declares `applinks:directrent.app`; all Runner build configurations reference it. No `DEVELOPMENT_TEAM`, real App ID prefix or signing/provisioning profile was found. An entitlement file alone does not establish a working Universal Link.

Association endpoints are JSON with no redirect. They prerender at build time:

- `ANDROID_APP_SHA256_FINGERPRINTS`: comma-separated colon-delimited SHA-256 signing certificate fingerprints. Values are format-validated; no value gives `[]`. The final local preview was explicitly built with the measured debug/beta fingerprint above; it is not a production trust decision.
- `APPLE_APP_ID_PREFIX`: the Apple-registered ten-character App ID prefix. If absent, the association has no app details. If supplied, the configured app ID is `{prefix}.com.example.directrentApp` and only `/properties/*` paths are associated. No placeholder team ID is published.

## Verification results

Passed:

- Flutter: `flutter test --no-pub test/property_link_test.dart test/shared_property_test.dart`: 5 tests. Covers strict link parsing, cold-start route retained through login, same-property continuation into the real details widget, and unavailable state.
- `flutter analyze --no-pub`: 145 pre-existing diagnostics before and after. No new diagnostics; analysis is not globally clean. Baseline and after logs: `/tmp/directrent-analyze-before.txt`, `/tmp/directrent-analyze-after.txt`.
- `flutter build apk --debug --no-pub --dart-define=API_BASE_URL=http://10.0.2.2:8020`: passed. Artifact is `build/app/outputs/flutter-apk/app-debug.apk` in the app repo; the root `directrent-latest.apk` was not replaced. The built manifest and certificate were inspected with aapt/apksigner.
- `flutter build web --no-pub --no-web-resources-cdn --dart-define=API_BASE_URL=http://127.0.0.1:8020`: passed. Served at port 3031 with `python3 -m http.server 3031 --bind 127.0.0.1 --directory build/web`.
- Running Flutter on the available Chrome target loaded authenticated property 901 with HTTP 200 and rendered its actual title, Kigamboni, TZS 450000, verification status and hidden-location notice. Existing Request Viewing dialog opened with date, time, optional message and Submit. No viewing was submitted. Screenshots: `/tmp/directrent-flutter-shared-property.png`, `/tmp/directrent-flutter-viewing-dialog.png`. Browser test uses a short-lived synthetic session, not a live account; sign-in continuation itself is tested with widgets, not real Google sign-in.
- API: `.venv/bin/python -m pytest tests/test_web_engagement.py tests/test_public_web_catalog.py tests/test_admin_mfa_boundary.py -q`: 42 tests passed, including shared-app detail authorization/privacy/404 and separate open-app click counters.
- Next.js production build and Cloudflare adapter build passed. The latter includes `npm run build` and generates both association routes.
- Chromium desktop 1440×1000 and iPhone-UA 390×844 verified: unavailable handoff retains browser page, property ID survives download-options/return journey, APK link remains present, unverified store links are absent. `tools/check_handoff_cdp.py`.
- Local association endpoint certificate matches both measured APKs; iOS endpoint has no invented association. XML/plist files parse, and all three repos pass `git diff --check`.

Not verified:

- Native OS App Link dispatch, cold/warm app launch on Android or iPhone, domain verification, real Google/password login on a device, post-install behavior, and an actual viewing request submitted from the device. `flutter devices` lists only Linux and Chrome; adb lists no devices; `flutter emulators` reports none, and no Android system images are installed. The Chrome target validates Flutter routing/rendering, not native link verification.
- iOS compile/signing: this is Linux with no Xcode or iOS device.
- Remote Cloudflare/staging, deployed association files and real store-account records.

## Exact owner/release steps

1. Confirm the final Android application ID and iOS bundle ID; the current `com.example.*` IDs were preserved. Renaming requires coordinated account/signing/Google-login changes.
2. Configure real Android release signing locally. Supply the public SHA-256 certificate of the actually distributed app (the Play App Signing certificate if Play distribution is used), not only an upload-key fingerprint. Set the association build variable to those approved certificate fingerprints. Private keystore/password material should stay in local secure signing configuration.
3. For iOS, supply the registered App ID prefix, Development Team ID and provisioning/signing setup for the intended bundle ID. Enable Associated Domains for that App ID, sign the entitlement using Xcode/macOS, and set APPLE_APP_ID_PREFIX for the website build.
4. Provide the verified official Google Play, App Store and/or TestFlight URL when each exists. Until then, release status and the existing Android beta option remain.
5. As a separate authorized release, deploy the freshly built association files at the real HTTPS domain without redirects and distribute a mobile build containing these changes. The currently published beta was not updated here. Apple same-domain Safari navigation may remain in Safari; cross-app/shared-link tests on a signed device are required.
6. Connect an Android device or install an emulator system image; provide a signed iPhone build/device for native tests. Example Android checks after release: `adb shell pm verify-app-links --re-verify com.example.directrent_app`, `adb shell pm get-app-links com.example.directrent_app`, and `adb shell am start -a android.intent.action.VIEW -d 'https://directrent.app/properties/REAL_ELIGIBLE_ID'`. Test signed-out resume, signed-in warm/cold launch, unavailable property and no-app browser fallback.

Implementation references: [Flutter deep links](https://docs.flutter.dev/ui/navigation/deep-linking), [Android App Links](https://developer.android.com/training/app-links/add-applinks), [Apple associated domains](https://developer.apple.com/documentation/xcode/supporting-associated-domains).

Final regression reruns: existing public journey passed at 1440×1000, 390×844 and 320×740; feedback/private admin/moderation/counter browser checks passed after handoff changes. A final same-worker occupied/404/sitemap-exclusion test passed, followed by review-service reapproval and SSR/canonical/sitemap-inclusion verification. Property 901 was left available. The website preview, synthetic API and compiled Flutter web server were left running.
