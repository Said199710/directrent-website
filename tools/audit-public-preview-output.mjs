import { readdir, readFile, access } from "node:fs/promises";
import { resolve } from "node:path";
import { resolvePublicApi } from "./public-preview-environment.mjs";
async function files(root) { const result=[];for(const item of await readdir(root,{withFileTypes:true})){const path=resolve(root,item.name);if(item.isDirectory())result.push(...await files(path));else if(item.name.endsWith('.js'))result.push(path);}return result; }
const api=resolvePublicApi();
const root=resolve(process.argv[2] || 'out');
await access(resolve(root,'_worker.js/index.js'));
for(const route of ['properties/[id].func.js','sitemap.xml.func.js'])await access(resolve(root,'_worker.js/__next-on-pages-dist__/functions',route));
const clients=await files(resolve(root,'_next/static/chunks/app'));
const workers=await files(resolve(root,'_worker.js'));
const local=/https?:\/\/(?:127(?:\.\d+){3}|localhost:\d+|10\.0\.2\.2|\[::1\])(?::\d+)?/;
for(const [kind,paths] of [['client',clients],['worker',workers]]) {
 let found=false;
 for(const path of paths) {
  const body=await readFile(path,'utf8');found ||= body.includes(api);
  if(local.test(body)||body.includes('https://api.directrent.app'))throw new Error(`Non-staging API dependency in ${path}`);
 }
 if(!found)throw new Error(`Staging origin absent in ${kind} bundles`);
}
console.log(`PASS: ${clients.length} client and ${workers.length} worker files audited; property/sitemap SSR present; API ${api}; no configured loopback/production API dependency.`);
