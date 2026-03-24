import { NextResponse } from "next/server"

export async function GET(request: Request, context: { params: Promise<{ traceId: string }> }) {
  const { traceId } = await context.params;
  return NextResponse.json({
    status: "ok",
    trace: {
      id: traceId,
      type: "trace",
      events: []
    }
  })
}
