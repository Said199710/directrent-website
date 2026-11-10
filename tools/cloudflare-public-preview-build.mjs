import { spawn } from "node:child_process";
import { cp, mkdir, readFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { resolvePublicApi } from "./public-preview-environment.mjs";

export function needsAdapterBridge(phase, environment = process.env) {
  return phase === "phase-production-build" && environment.CF_PAGES === "1"
    && environment.CF_PAGES_BRANCH === "staging/public-marketplace"
    && environment.DIRECTRENT_ADAPTER_INNER_BUILD !== "1";
}

export async function buildPublicPreview() {
  const api = resolvePublicApi();
  const root = process.cwd();
  const adapter = resolve(root, "node_modules/@cloudflare/next-on-pages/bin/index.js");
  if (!existsSync(adapter)) throw new Error("Cloudflare adapter is not installed");
  console.log(`[public-preview] Building SSR adapter output for ${process.env.CF_PAGES_BRANCH}; API ${api}`);
  const result = await new Promise((done, reject) => {
    const child = spawn(process.execPath, [adapter], {
      cwd: root, stdio: "inherit",
      env: { ...process.env, DIRECTRENT_ADAPTER_INNER_BUILD: "1", PUBLIC_API_URL: api, NEXT_PUBLIC_API_URL: api },
    });
    child.on("error", reject);
    child.on("exit", (code, signal) => code === 0 ? done() : reject(new Error(`Adapter build failed (${signal || code})`)));
  });
  const source = resolve(root, ".vercel/output/static");
  if (!existsSync(resolve(source, "_worker.js/index.js"))) throw new Error("Missing generated Cloudflare SSR worker");
  const summary = JSON.parse(await readFile(resolve(source, "_worker.js/nop-build-log.json"), "utf8"));
  // Require an actual generated worker; success must not mean a static-only export.
  if (!existsSync(resolve(source, "_worker.js/__next-on-pages-dist__/functions/properties/[id].func.js"))) {
    throw new Error("Property SSR function is missing from adapter output");
  }
  await rm(resolve(root, "out"), { recursive: true, force: true });
  await mkdir(resolve(root, "out"), { recursive: true });
  await cp(source, resolve(root, "out"), { recursive: true });
  console.log("[public-preview] Cloudflare SSR artifact published to out; shared Pages build settings unchanged.");
}
