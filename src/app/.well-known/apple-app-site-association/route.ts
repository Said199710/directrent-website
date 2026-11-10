export const dynamic = "force-static";
export function GET() {
  const prefix = process.env.APPLE_APP_ID_PREFIX || "";
  if (prefix && !/^[A-Z0-9]{10}$/.test(prefix)) throw new Error("Invalid Apple App ID prefix");
  return Response.json({ applinks: { apps: [], details: prefix ? [{ appID: `${prefix}.com.example.directrentApp`, paths: ["/properties/*"] }] : [] } });
}
