import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src/data/directives.json");

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    const { directives } = await import("@/lib/data");
    await fs.writeFile(DATA_FILE, JSON.stringify(directives, null, 2));
  }
}

async function readDirectives() {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

async function writeDirectives(data: unknown) {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

function checkAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const adminPass = process.env.ADMIN_PASSWORD || "hermesgo2025";
  return authHeader === `Bearer ${adminPass}`;
}

// GET — list all directives
export async function GET() {
  try {
    const directives = await readDirectives();
    return Response.json(directives);
  } catch (err) {
    console.error("GET directives error:", err);
    return Response.json({ error: "failed to read directives" }, { status: 500 });
  }
}

// POST — add a new directive
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const directives = await readDirectives();

    const newDirective = {
      id: `HGO-${String(directives.length + 1).padStart(3, "0")}`,
      title: body.title,
      description: body.description,
      reward: body.reward || "0.5",
      status: body.status || "open",
      category: body.category || "content",
      locked: body.locked || false,
      featured: body.featured || false,
      pumpFunUrl: body.pumpFunUrl || "https://pump.fun",
    };

    directives.push(newDirective);
    await writeDirectives(directives);

    return Response.json(newDirective, { status: 201 });
  } catch (err) {
    console.error("POST directive error:", err);
    return Response.json({ error: "failed to create directive" }, { status: 500 });
  }
}

// PUT — update an existing directive by id
export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return Response.json({ error: "id required" }, { status: 400 });
    }

    const body = await req.json();
    const directives = await readDirectives();
    const idx = directives.findIndex((d: { id: string }) => d.id === id);

    if (idx === -1) {
      return Response.json({ error: "directive not found" }, { status: 404 });
    }

    directives[idx] = { ...directives[idx], ...body, id }; // keep id immutable
    await writeDirectives(directives);
    return Response.json(directives[idx]);
  } catch (err) {
    console.error("PUT directive error:", err);
    return Response.json({ error: "failed to update directive" }, { status: 500 });
  }
}

// DELETE — remove a directive by id
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return Response.json({ error: "id required" }, { status: 400 });
    }

    let directives = await readDirectives();
    const original = directives.length;
    directives = directives.filter((d: { id: string }) => d.id !== id);

    if (directives.length === original) {
      return Response.json({ error: "directive not found" }, { status: 404 });
    }

    await writeDirectives(directives);
    return Response.json({ success: true });
  } catch (err) {
    console.error("DELETE directive error:", err);
    return Response.json({ error: "failed to delete directive" }, { status: 500 });
  }
}
