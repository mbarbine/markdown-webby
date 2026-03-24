import { NextResponse } from "next/server"

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return NextResponse.json({
    status: "ok",
    agentRun: {
      id: parseInt(id, 10),
      type: "agent_run",
      status: "active"
    }
  })
}
