// Mock next/server to avoid Request not defined in test environment
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body: unknown, init?: { status?: number }) => ({
      body,
      status: init?.status || 200,
    })),
  },
}))

import {
  generateRequestId,
  checkRateLimit,
  parsePagination,
  corsHeaders,
} from "@/lib/api/utils"

describe("generateRequestId", () => {
  it("returns a string starting with req_", () => {
    const id = generateRequestId()
    expect(id).toMatch(/^req_/)
  })

  it("generates unique IDs", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateRequestId()))
    expect(ids.size).toBe(100)
  })
})

describe("checkRateLimit", () => {
  it("allows first request", () => {
    const result = checkRateLimit("test-unique-1", 10, 60000)
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(9)
  })

  it("tracks request count", () => {
    const id = "test-unique-2"
    checkRateLimit(id, 5, 60000)
    checkRateLimit(id, 5, 60000)
    const result = checkRateLimit(id, 5, 60000)
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(2)
  })

  it("blocks when rate limit is exceeded", () => {
    const id = "test-unique-3"
    for (let i = 0; i < 3; i++) {
      checkRateLimit(id, 3, 60000)
    }
    const result = checkRateLimit(id, 3, 60000)
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })
})

describe("parsePagination", () => {
  it("returns default values for empty params", () => {
    const params = new URLSearchParams()
    const result = parsePagination(params)
    expect(result.page).toBe(1)
    expect(result.limit).toBe(20)
    expect(result.offset).toBe(0)
  })

  it("parses page and limit", () => {
    const params = new URLSearchParams({ page: "3", limit: "50" })
    const result = parsePagination(params)
    expect(result.page).toBe(3)
    expect(result.limit).toBe(50)
    expect(result.offset).toBe(100) // (3-1) * 50
  })

  it("clamps page to minimum of 1", () => {
    const params = new URLSearchParams({ page: "0" })
    const result = parsePagination(params)
    expect(result.page).toBe(1)
  })

  it("clamps limit to max 100", () => {
    const params = new URLSearchParams({ limit: "500" })
    const result = parsePagination(params)
    expect(result.limit).toBe(100)
  })

  it("clamps limit to min 1", () => {
    const params = new URLSearchParams({ limit: "0" })
    const result = parsePagination(params)
    expect(result.limit).toBe(1)
  })
})

describe("corsHeaders", () => {
  it("returns wildcard origin by default", () => {
    const headers = corsHeaders()
    expect(headers["Access-Control-Allow-Origin"]).toBe("*")
  })

  it("returns specific origin when provided", () => {
    const headers = corsHeaders("https://example.com")
    expect(headers["Access-Control-Allow-Origin"]).toBe("https://example.com")
  })

  it("includes standard CORS headers", () => {
    const headers = corsHeaders()
    expect(headers["Access-Control-Allow-Methods"]).toContain("GET")
    expect(headers["Access-Control-Allow-Methods"]).toContain("POST")
    expect(headers["Access-Control-Allow-Headers"]).toContain("Content-Type")
  })
})
