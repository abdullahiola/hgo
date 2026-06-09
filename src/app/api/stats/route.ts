import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src/data/stats.json");

const DEFAULT_STATS = [
  { value: "10", label: "Directives issued" },
  { value: "6", label: "Open now" },
  { value: "16.50", label: "Escrowed rewards", suffix: "◎" },
];

async function ensureFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_STATS, null, 2));
  }
}

async function readStats() {
  await ensureFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

async function writeStats(data: unknown) {
  await ensureFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

function checkAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const adminPass = process.env.ADMIN_PASSWORD || "hermesgo2025";
  return authHeader === `Bearer ${adminPass}`;
}

export async function GET() {
  try {
    const stats = await readStats();
    return Response.json(stats);
  } catch (err) {
    console.error("GET stats error:", err);
    return Response.json(DEFAULT_STATS);
  }
}

export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    await writeStats(body);
    return Response.json({ success: true });
  } catch (err) {
    console.error("PUT stats error:", err);
    return Response.json({ error: "failed to update stats" }, { status: 500 });
  }
}
