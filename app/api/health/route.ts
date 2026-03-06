import { apiSuccess } from "@/lib/api/utils"
import { siteConfig } from "@/lib/platphorm/config"

export const runtime = "edge"

export async function GET() {
  return apiSuccess({
    status: "healthy",
    service: siteConfig.name,
    version: siteConfig.version,
    uptime: process.uptime?.() ?? null,
    environment: process.env.NODE_ENV,
  })
}
