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
  const uptime = formatUptime(uptimeSeconds);
  const timestamp = new Date().toISOString();

  console.log(`[HEALTH CHECK] Server pinged at ${timestamp} | Uptime: ${uptime} (${uptimeSeconds}s)`);

  return NextResponse.json(
    {
      status: "ok",
      message: "Server is running",
      timestamp,
      uptime,
      uptimeSeconds,
    },
    { status: 200 }
  );
}
