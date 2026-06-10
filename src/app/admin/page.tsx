"use client";

import { useState, useEffect, useCallback } from "react";

interface DirectiveData {
  id: string;
  title: string;
  description: string;
  reward: string;
  status: string;
  category: string;
  locked: boolean;
  featured: boolean;
  pumpFunUrl: string;
}

interface StatData {
  value: string;
  label: string;
  suffix?: string;
}

type Tab = "directives" | "stats";

const CATEGORIES = [
  "content", "community", "development", "research",
  "video", "design", "real world", "hustle", "creative", "general",
];

const EMPTY_FORM: Omit<DirectiveData, "id"> = {
  title: "", description: "", reward: "0.5", category: "content",
  status: "open", featured: false, locked: true, pumpFunUrl: "https://pump.fun",
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("directives");

  // ── Directives ────────────────────────────────────────────────────
  const [directives, setDirectives] = useState<DirectiveData[]>([]);
  const [addForm, setAddForm] = useState({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<DirectiveData | null>(null);
  const [saving, setSaving] = useState(false);

  // ── Stats ─────────────────────────────────────────────────────────
  const [stats, setStats] = useState<StatData[]>([]);
  const [statsSaving, setStatsSaving] = useState(false);
  const [statsMsg, setStatsMsg] = useState("");

  // ── Helpers ───────────────────────────────────────────────────────
  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${password}`,
  };

  const fetchDirectives = useCallback(async () => {
    const res = await fetch("/api/directives");
    if (res.ok) setDirectives(await res.json());
  }, []);

  const fetchStats = useCallback(async () => {
    const res = await fetch("/api/stats");
    if (res.ok) setStats(await res.json());
  }, []);

  useEffect(() => {
    if (authed) { fetchDirectives(); fetchStats(); }
  }, [authed, fetchDirectives, fetchStats]);

  // ── Login ─────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setError("Verifying…");
    try {
      const res = await fetch("/api/stats", {
        method: "HEAD",
        headers: { Authorization: `Bearer ${password.trim()}` },
      });
      if (res.ok) {
        setAuthed(true);
        setError("");
      } else {
        setError("Wrong password. Try again.");
      }
    } catch {
      setError("Network error. Is the server running?");
    }
  };

  // ── Add ───────────────────────────────────────────────────────────
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.title.trim() || !addForm.description.trim()) {
      setError("Title and description are required"); return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/directives", {
        method: "POST", headers: authHeaders, body: JSON.stringify(addForm),
      });
      if (!res.ok) { setError((await res.json()).error || "Failed"); setSaving(false); return; }
      setAddForm({ ...EMPTY_FORM });
      setError("");
      await fetchDirectives();
    } catch { setError("Network error"); }
    setSaving(false);
  };

  // ── Edit ──────────────────────────────────────────────────────────
  const startEdit = (d: DirectiveData) => { setEditingId(d.id); setEditForm({ ...d }); };
  const cancelEdit = () => { setEditingId(null); setEditForm(null); };

  const handleSaveEdit = async () => {
    if (!editForm) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/directives?id=${editForm.id}`, {
        method: "PUT", headers: authHeaders, body: JSON.stringify(editForm),
      });
      if (!res.ok) { setError((await res.json()).error || "Failed to save"); setSaving(false); return; }
      cancelEdit();
      await fetchDirectives();
    } catch { setError("Network error"); }
    setSaving(false);
  };

  // ── Toggle lock (quick action) ─────────────────────────────────────────
  const handleToggleLock = async (d: DirectiveData) => {
    try {
      const res = await fetch(`/api/directives?id=${d.id}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ ...d, locked: !d.locked }),
      });
      if (res.ok) await fetchDirectives();
      else setError("Failed to toggle lock");
    } catch { setError("Network error"); }
  };

  // ── Delete ────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm(`Delete directive ${id}?`)) return;
    try {
      const res = await fetch(`/api/directives?id=${id}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${password}` },
      });
      if (!res.ok) { setError((await res.json()).error || "Failed to delete"); return; }
      if (editingId === id) cancelEdit();
      await fetchDirectives();
    } catch { setError("Network error"); }
  };

  // ── Stats save ────────────────────────────────────────────────────
  const handleStatsSave = async () => {
    setStatsSaving(true); setStatsMsg("");
    try {
      const res = await fetch("/api/stats", {
        method: "PUT", headers: authHeaders, body: JSON.stringify(stats),
      });
      setStatsMsg(res.ok ? "✓ Stats saved" : "✗ Save failed — wrong password?");
    } catch { setStatsMsg("✗ Network error"); }
    setStatsSaving(false);
  };

  const updateStat = (i: number, field: keyof StatData, value: string) =>
    setStats((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));

  // ── Login screen ──────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="admin">
        <div className="admin__login">
          <h1 className="admin__login-title">Admin Access</h1>
          <form onSubmit={handleLogin}>
            <input type="password" className="admin__input" placeholder="Enter admin password"
              value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
            <button type="submit" className="admin__submit">Enter</button>
          </form>
          {error && <p className="admin__error">{error}</p>}
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────
  return (
    <div className="admin">
      <div className="admin__inner">
        <h1 className="admin__title">HermesGo Admin</h1>

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem" }}>
          {(["directives", "stats"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`directives__filter-btn${tab === t ? " directives__filter-btn--active" : ""}`}
              style={{ textTransform: "capitalize" }}>
              {t}
            </button>
          ))}
        </div>

        {/* ── DIRECTIVES TAB ────────────────────────────────────── */}
        {tab === "directives" && (
          <>
            {/* Add form */}
            <div className="admin__form">
              <h2 className="admin__form-title">Add New Directive</h2>
              <form onSubmit={handleAdd}>
                <div className="admin__field">
                  <label htmlFor="add-title">Title</label>
                  <input id="add-title" className="admin__input" placeholder="e.g. Create a viral meme thread"
                    value={addForm.title} onChange={(e) => setAddForm({ ...addForm, title: e.target.value })} />
                </div>
                <div className="admin__field">
                  <label htmlFor="add-desc">Description</label>
                  <textarea id="add-desc" className="admin__textarea" placeholder="Describe the bounty in detail..."
                    value={addForm.description} onChange={(e) => setAddForm({ ...addForm, description: e.target.value })} />
                </div>
                <div className="admin__row">
                  <div className="admin__field">
                    <label htmlFor="add-reward">Reward (SOL)</label>
                    <input id="add-reward" className="admin__input" placeholder="0.5"
                      value={addForm.reward} onChange={(e) => setAddForm({ ...addForm, reward: e.target.value })} />
                  </div>
                  <div className="admin__field">
                    <label htmlFor="add-category">Category</label>
                    <select id="add-category" className="admin__select"
                      value={addForm.category} onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </div>
                </div>
                <div className="admin__row">
                  <div className="admin__field">
                    <label htmlFor="add-status">Status</label>
                    <select id="add-status" className="admin__select"
                      value={addForm.status} onChange={(e) => setAddForm({ ...addForm, status: e.target.value })}>
                      <option value="open">Open</option>
                      <option value="claimed">Claimed</option>
                      <option value="settled">Settled</option>
                    </select>
                  </div>
                  <div className="admin__field">
                    <label htmlFor="add-pump">Pump.fun GO URL</label>
                    <input id="add-pump" className="admin__input" placeholder="https://pump.fun/..."
                      value={addForm.pumpFunUrl} onChange={(e) => setAddForm({ ...addForm, pumpFunUrl: e.target.value })} />
                  </div>
                </div>
                <div className="admin__row" style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", cursor: "pointer" }}>
                    <input type="checkbox" checked={addForm.featured}
                      onChange={(e) => setAddForm({ ...addForm, featured: e.target.checked })} /> Featured
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", cursor: "pointer" }}>
                    <input type="checkbox" checked={addForm.locked}
                      onChange={(e) => setAddForm({ ...addForm, locked: e.target.checked })} /> Locked
                  </label>
                </div>
                <button type="submit" className="admin__submit" disabled={saving}>
                  {saving ? "Adding…" : "Add Directive"}
                </button>
                {error && <p className="admin__error">{error}</p>}
              </form>
            </div>

            {/* Existing directives */}
            <h2 className="admin__form-title" style={{ marginBottom: "1rem" }}>
              Existing Directives ({directives.length})
            </h2>
            <div className="admin__directive-list">
              {directives.length === 0 && (
                <p style={{ color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}>
                  No directives yet. Add one above.
                </p>
              )}

              {directives.map((d) => (
                <div key={d.id} className="admin__directive-item">

                  {/* ── View mode ── */}
                  {editingId !== d.id && (
                    <>
                      <div className="admin__directive-info">
                        <p className="admin__directive-id">{d.id}</p>
                        <p className="admin__directive-title-text">{d.title}</p>
                        <p className="admin__directive-meta">
                          {d.reward} SOL
                          <span style={{ opacity: 0.4 }}> · </span>{d.status}
                          <span style={{ opacity: 0.4 }}> · </span>{d.category}
                          {d.featured && <span style={{ color: "#f6c90e" }}> · ★ featured</span>}
                          {d.locked
                            ? <span style={{ color: "var(--muted)" }}> · 🔒 locked</span>
                            : <span style={{ color: "hsl(145,65%,48%)" }}> · ✓ open</span>}
                        </p>
                        {d.pumpFunUrl && (
                          <a href={d.pumpFunUrl} target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: "0.72rem", color: "var(--primary)", fontFamily: "var(--font-mono)", opacity: 0.7, wordBreak: "break-all", display: "block", marginTop: "0.375rem" }}>
                            {d.pumpFunUrl}
                          </a>
                        )}
                      </div>

                      <div className="admin__directive-actions">
                        <button
                          onClick={() => handleToggleLock(d)}
                          title={d.locked ? "Unlock directive" : "Lock directive"}
                          style={{
                            padding: "0.35rem 0.8rem",
                            fontSize: "0.78rem",
                            fontFamily: "var(--font-mono)",
                            border: `1px solid ${d.locked ? "var(--border)" : "hsl(145,65%,38%)"}`,
                            borderRadius: "4px",
                            background: d.locked ? "transparent" : "hsla(145,65%,48%,0.1)",
                            color: d.locked ? "var(--muted)" : "hsl(145,65%,52%)",
                            cursor: "pointer",
                            transition: "all 0.15s",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {d.locked ? "🔒 Locked" : "✓ Open"}
                        </button>
                        <button
                          className="admin__submit"
                          style={{ padding: "0.35rem 0.9rem", fontSize: "0.78rem" }}
                          onClick={() => startEdit(d)}
                        >
                          Edit
                        </button>
                        <button className="admin__delete-btn" onClick={() => handleDelete(d.id)}>Delete</button>
                      </div>
                    </>
                  )}

                  {/* ── Edit mode ── */}
                  {editingId === d.id && editForm && (
                    <div style={{ width: "100%" }}>
                      <p className="admin__directive-id" style={{ marginBottom: "1rem" }}>Editing {d.id}</p>

                      <div className="admin__field">
                        <label>Title</label>
                        <input className="admin__input" value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                      </div>
                      <div className="admin__field">
                        <label>Description</label>
                        <textarea className="admin__textarea" value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                      </div>
                      <div className="admin__row">
                        <div className="admin__field">
                          <label>Reward (SOL)</label>
                          <input className="admin__input" value={editForm.reward}
                            onChange={(e) => setEditForm({ ...editForm, reward: e.target.value })} />
                        </div>
                        <div className="admin__field">
                          <label>Category</label>
                          <select className="admin__select" value={editForm.category}
                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}>
                            {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="admin__row">
                        <div className="admin__field">
                          <label>Status</label>
                          <select className="admin__select" value={editForm.status}
                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                            <option value="open">Open</option>
                            <option value="claimed">Claimed</option>
                            <option value="settled">Settled</option>
                          </select>
                        </div>
                        <div className="admin__field">
                          <label>Pump.fun GO URL</label>
                          <input className="admin__input" value={editForm.pumpFunUrl}
                            onChange={(e) => setEditForm({ ...editForm, pumpFunUrl: e.target.value })} />
                        </div>
                      </div>
                      <div className="admin__row" style={{ marginBottom: "1.25rem" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", cursor: "pointer" }}>
                          <input type="checkbox" checked={editForm.featured}
                            onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })} /> Featured
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", cursor: "pointer" }}>
                          <input type="checkbox" checked={editForm.locked}
                            onChange={(e) => setEditForm({ ...editForm, locked: e.target.checked })} /> Locked
                        </label>
                      </div>
                      <div style={{ display: "flex", gap: "0.75rem" }}>
                        <button className="admin__submit" onClick={handleSaveEdit} disabled={saving}>
                          {saving ? "Saving…" : "Save Changes"}
                        </button>
                        <button className="admin__delete-btn" onClick={cancelEdit} style={{ background: "transparent" }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── STATS TAB ─────────────────────────────────────────── */}
        {tab === "stats" && (
          <div className="admin__form">
            <h2 className="admin__form-title">Edit Hero Stats</h2>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "1.5rem", fontFamily: "var(--font-mono)" }}>
              These values appear in the stats bar on the homepage. Changes are live on save.
            </p>
            {stats.map((stat, i) => (
              <div key={i} className="admin__row" style={{ alignItems: "flex-end", marginBottom: "1.25rem", gap: "1rem" }}>
                <div className="admin__field" style={{ flex: 2 }}>
                  <label>Label</label>
                  <input className="admin__input" value={stat.label}
                    onChange={(e) => updateStat(i, "label", e.target.value)} />
                </div>
                <div className="admin__field" style={{ flex: 1 }}>
                  <label>Value</label>
                  <input className="admin__input" value={stat.value}
                    onChange={(e) => updateStat(i, "value", e.target.value)} />
                </div>
                <div className="admin__field" style={{ flex: 1 }}>
                  <label>Suffix (optional)</label>
                  <input className="admin__input" value={stat.suffix ?? ""} placeholder="e.g. ◎"
                    onChange={(e) => updateStat(i, "suffix", e.target.value)} />
                </div>
              </div>
            ))}
            <button className="admin__submit" onClick={handleStatsSave} disabled={statsSaving}
              style={{ marginTop: "0.5rem" }}>
              {statsSaving ? "Saving…" : "Save Stats"}
            </button>
            {statsMsg && (
              <p style={{
                marginTop: "0.75rem", fontFamily: "var(--font-mono)", fontSize: "0.875rem",
                color: statsMsg.startsWith("✓") ? "var(--accent)" : "#f87171",
              }}>
                {statsMsg}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
