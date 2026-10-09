import { NextResponse } from "next/server";

function formatUptime(totalSeconds: number): string {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

export async function GET() {
  const uptimeSeconds = Math.floor(process.uptime());

  return NextResponse.json(
    {
      status: "ok",
      message: "Server is running",
      timestamp: new Date().toISOString(),
      uptime: formatUptime(uptimeSeconds),
      uptimeSeconds,
    },
    { status: 200 }
  );
}
