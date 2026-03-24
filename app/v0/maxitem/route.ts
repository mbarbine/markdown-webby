import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    status: "ok",
    max_item_id: 1000 // Placeholder
  })
}
