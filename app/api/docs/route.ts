import { NextResponse } from "next/server"
import { openApiSpec } from "@/lib/api/openapi"

export async function GET() {
  return NextResponse.json(openApiSpec)
}
