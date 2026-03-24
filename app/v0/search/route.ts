import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  return NextResponse.json({
    status: "ok",
    query,
    results: [] // Placeholder
  })
}
