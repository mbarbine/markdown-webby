import { NextResponse } from "next/server"
import { siteConfig } from "@/lib/platphorm/config"

// Standard API response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: ApiError
  meta?: ApiMeta
}

export interface ApiError {
  code: string
  message: string
  details?: unknown
}

export interface ApiMeta {
  version: string
  timestamp: string
  requestId: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Generate unique request ID
export function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`
}

// Standard success response
export function apiSuccess<T>(data: T, meta?: Partial<ApiMeta>): NextResponse<ApiResponse<T>> {
  const requestId = generateRequestId()
  return NextResponse.json({
    success: true,
    data,
    meta: {
      version: siteConfig.api.version,
      timestamp: new Date().toISOString(),
      requestId,
      ...meta,
    },
  })
}

// Standard error response
export function apiError(
  code: string,
  message: string,
  status: number = 400,
  details?: unknown
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      error: { code, message, details },
      meta: {
        version: siteConfig.api.version,
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      },
    },
    { status }
  )
}

// Common error helpers
export const errors = {
  badRequest: (message: string, details?: unknown) => 
    apiError("BAD_REQUEST", message, 400, details),
  unauthorized: (message = "Unauthorized") => 
    apiError("UNAUTHORIZED", message, 401),
  forbidden: (message = "Forbidden") => 
    apiError("FORBIDDEN", message, 403),
  notFound: (resource = "Resource") => 
    apiError("NOT_FOUND", `${resource} not found`, 404),
  methodNotAllowed: (allowed: string[]) => 
    apiError("METHOD_NOT_ALLOWED", `Allowed methods: ${allowed.join(", ")}`, 405),
  rateLimited: () => 
    apiError("RATE_LIMITED", "Too many requests", 429),
  serverError: (message = "Internal server error") => 
    apiError("SERVER_ERROR", message, 500),
}

// Rate limiting (simple in-memory, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  if (!record || record.resetAt < now) {
    rateLimitStore.set(identifier, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs }
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt }
  }

  record.count++
  return { allowed: true, remaining: limit - record.count, resetAt: record.resetAt }
}

// Parse pagination params
export function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)))
  const offset = (page - 1) * limit
  return { page, limit, offset }
}

// CORS headers
export function corsHeaders(origin?: string) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Request-ID",
    "Access-Control-Max-Age": "86400",
  }
}
