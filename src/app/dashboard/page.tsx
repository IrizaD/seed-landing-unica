"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Funnel {
  slug: string;
  nombre: string;
  fb_pixel_id: string;
  ghl_webhook: string;
  activo: boolean;
}

interface Registro {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  desde_slide: number;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  created_at: string;
}

interface MetricasData {
  totalRegistros: number;
  sesionesUnicas: number;
  registrosPorDia: { created_at: string }[];
  eventosPorSlide: { slide_numero: number }[];
  clicksPorSlide:  { slide_numero: number }[];
  registrosDesdeSlide: { desde_slide: number }[];
  utms: { utm_source: string; utm_medium: string; utm_campaign: string }[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SLUG = "seed-mexico";

function countBy<T>(arr: T[], key: keyof T): Record<string, number> {
  const out: Record<string, number> = {};
  arr.forEach((item) => {
    const k = String(item[key] ?? "");
    out[k] = (out[k] ?? 0) + 1;
  });
  return out;
}

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-MX", { day:"2-digit", month:"short", year:"numeric" });
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ background:"#0d1117", border:"1px solid #1e2535", borderRadius:"12px", padding:"20px 24px" }}>
      <p style={{ color:"#7a8299", fontSize:"13px", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"8px" }}>{label}</p>
      <p style={{ color:"#fff", fontSize:"2rem", fontWeight:800 }}>{value}</p>
    </div>
  );
}

function BarChart({ data, label }: { data: Record<string, number>; label: string }) {
  const entries = Object.entries(data).sort((a, b) => Number(a[0]) - Number(b[0]));
  const max = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <div style={{ background:"#0d1117", border:"1px solid #1e2535", borderRadius:"12px", padding:"20px" }}>
      <p style={{ color:"#9aa3b2", fontSize:"13px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"16px" }}>{label}</p>
      <div style={{ display:"flex", alignItems:"flex-end", gap:"8px", height:"120px" }}>
        {entries.map(([k, v]) => (
          <div key={k} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"4px" }}>
            <span style={{ color:"#9aa3b2", fontSize:"11px" }}>{v}</span>
            <div style={{ width:"100%", background:"rgba(20,201,184,0.15)", borderRadius:"4px 4px 0 0",
              height:`${(v/max)*100}%`, minHeight:"4px", position:"relative" }}>
              <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"#14C9B8",
                borderRadius:"4px 4px 0 0", height:`${(v/max)*100}%` }}/>
            </div>
            <span style={{ color:"#7a8299", fontSize:"11px" }}>P{k}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Secciones ────────────────────────────────────────────────────────────────

function SeccionMetricas({ slug }: { slug: string }) {
  const [data, setData]     = useState<MetricasData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/metricas?slug=${slug}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, [slug]);

  if (loading) return <p style={{ color:"#7a8299" }}>Cargando métricas...</p>;
  if (!data)   return <p style={{ color:"#f87171" }}>Error al cargar</p>;

  const tasa = data.sesionesUnicas > 0
    ? ((data.totalRegistros / data.sesionesUnicas) * 100).toFixed(1)
    : "0";

  const vistasSlide  = countBy(data.eventosPorSlide, "slide_numero");
  const clicksSlide  = countBy(data.clicksPorSlide, "slide_numero");
  const desdeSlide   = countBy(data.registrosDesdeSlide, "desde_slide");
  const utmSources   = countBy(data.utms, "utm_source");

  // Registros por día (últimos 7 días)
  const porDia: Record<string, number> = {};
  data.registrosPorDia.forEach(({ created_at }) => {
    const d = new Date(created_at).toLocaleDateString("es-MX", { day:"2-digit", month:"short" });
    porDia[d] = (porDia[d] ?? 0) + 1;
  });

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
      {/* Stats principales */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:"16px" }}>
        <StatCard label="Total registros" value={data.totalRegistros} />
        <StatCard label="Sesiones únicas" value={data.sesionesUnicas} />
        <StatCard label="Tasa de conversión" value={`${tasa}%`} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"16px" }}>
        {Object.keys(vistasSlide).length > 0 && (
          <BarChart data={vistasSlide} label="Vistas por paso" />
        )}
        {Object.keys(clicksSlide).length > 0 && (
          <BarChart data={clicksSlide} label="Clics en CTA por paso" />
        )}
        {Object.keys(desdeSlide).length > 0 && (
          <BarChart data={desdeSlide} label="Registros: desde qué paso" />
        )}
      </div>

      {/* UTMs */}
      {Object.keys(utmSources).length > 0 && (
        <div style={{ background:"#0d1117", border:"1px solid #1e2535", borderRadius:"12px", padding:"20px" }}>
          <p style={{ color:"#9aa3b2", fontSize:"13px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"12px" }}>Fuentes de tráfico (UTM)</p>
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {Object.entries(utmSources).sort((a,b) => b[1]-a[1]).map(([source, count]) => (
              <div key={source} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ color:"#cdd5e0", fontSize:"15px" }}>{source || "(directo)"}</span>
                <span style={{ color:"#14C9B8", fontWeight:700 }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {Object.keys(vistasSlide).length === 0 && (
        <div style={{ background:"rgba(20,201,184,0.05)", border:"1px solid rgba(20,201,184,0.15)", borderRadius:"12px", padding:"24px", textAlign:"center" }}>
          <p style={{ color:"#7a8299" }}>Aún no hay eventos registrados. Las métricas aparecerán cuando haya visitas al funnel.</p>
        </div>
      )}
    </div>
  );
}

function SeccionLeads({ slug }: { slug: string }) {
  const [leads, setLeads]   = useState<Registro[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`/api/leads?slug=${slug}`)
      .then((r) => r.json())
      .then((d) => { setLeads(Array.isArray(d) ? d : []); setLoading(false); });
  }, [slug]);

  const filtered = leads.filter((l) =>
    l.nombre.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase()) ||
    l.telefono.includes(search)
  );

  function exportCsv() {
    const header = "Nombre,Email,Teléfono,Paso,Fuente,Medio,Campaña,Fecha";
    const rows = filtered.map((l) =>
      [l.nombre, l.email, l.telefono, l.desde_slide, l.utm_source, l.utm_medium, l.utm_campaign, fmt(l.created_at)]
        .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [header, ...rows].join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = `leads-${slug}-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
      <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
        <input
          placeholder="Buscar por nombre, email o teléfono..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex:1, minWidth:"200px", background:"#0d1117", border:"1px solid #1e2535", color:"#fff",
            borderRadius:"10px", padding:"12px 16px", fontSize:"15px" }}
        />
        <button onClick={exportCsv}
          style={{ background:"rgba(20,201,184,0.1)", border:"1px solid rgba(20,201,184,0.3)", color:"#14C9B8",
            borderRadius:"10px", padding:"12px 20px", fontSize:"15px", fontWeight:700, cursor:"pointer" }}>
          Exportar CSV
        </button>
      </div>

      {loading ? (
        <p style={{ color:"#7a8299" }}>Cargando leads...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color:"#7a8299" }}>No hay leads aún.</p>
      ) : (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"14px" }}>
            <thead>
              <tr style={{ borderBottom:"1px solid #1e2535" }}>
                {["Nombre","Email","Teléfono","Paso","Fuente","Fecha"].map((h) => (
                  <th key={h} style={{ color:"#7a8299", fontWeight:600, padding:"10px 12px", textAlign:"left", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} style={{ borderBottom:"1px solid #111827" }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"}
                  onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                  <td style={{ color:"#fff", padding:"10px 12px" }}>{l.nombre}</td>
                  <td style={{ color:"#cdd5e0", padding:"10px 12px" }}>{l.email}</td>
                  <td style={{ color:"#cdd5e0", padding:"10px 12px" }}>{l.telefono}</td>
                  <td style={{ color:"#14C9B8", padding:"10px 12px", textAlign:"center" }}>P{l.desde_slide}</td>
                  <td style={{ color:"#9aa3b2", padding:"10px 12px" }}>{l.utm_source || "—"}</td>
                  <td style={{ color:"#9aa3b2", padding:"10px 12px", whiteSpace:"nowrap" }}>{fmt(l.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ color:"#7a8299", fontSize:"13px", marginTop:"8px" }}>{filtered.length} lead{filtered.length !== 1 ? "s" : ""}</p>
        </div>
      )}
    </div>
  );
}

function SeccionConfiguracion() {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [saving, setSaving]   = useState<string | null>(null);
  const [saved, setSaved]     = useState<string | null>(null);

  const loadFunnels = useCallback(async () => {
    const r = await fetch("/api/funnels");
    const d = await r.json();
    setFunnels(Array.isArray(d) ? d : []);
  }, []);

  useEffect(() => { loadFunnels(); }, [loadFunnels]);

  async function handleSave(funnel: Funnel) {
    setSaving(funnel.slug);
    await fetch(`/api/funnels/${funnel.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fb_pixel_id: funnel.fb_pixel_id, ghl_webhook: funnel.ghl_webhook }),
    });
    setSaving(null);
    setSaved(funnel.slug);
    setTimeout(() => setSaved(null), 2000);
  }

  function update(slug: string, key: keyof Funnel, value: string) {
    setFunnels((prev) => prev.map((f) => f.slug === slug ? { ...f, [key]: value } : f));
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
      {funnels.map((f) => (
        <div key={f.slug} style={{ background:"#0d1117", border:"1px solid #1e2535", borderRadius:"12px", padding:"24px" }}>
          <h3 style={{ color:"#fff", fontWeight:700, fontSize:"1.1rem", marginBottom:"4px" }}>{f.nombre}</h3>
          <p style={{ color:"#7a8299", fontSize:"13px", marginBottom:"20px" }}>slug: {f.slug}</p>

          <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
            <div>
              <label style={{ color:"#9aa3b2", fontSize:"13px", fontWeight:600, display:"block", marginBottom:"6px", textTransform:"uppercase", letterSpacing:"0.05em" }}>
                Facebook Pixel ID
              </label>
              <input
                value={f.fb_pixel_id}
                onChange={(e) => update(f.slug, "fb_pixel_id", e.target.value)}
                placeholder="123456789012345"
                style={{ width:"100%", background:"#111827", border:"1px solid #1e2535", color:"#fff",
                  borderRadius:"8px", padding:"12px 14px", fontSize:"15px", boxSizing:"border-box" }}
              />
            </div>
            <div>
              <label style={{ color:"#9aa3b2", fontSize:"13px", fontWeight:600, display:"block", marginBottom:"6px", textTransform:"uppercase", letterSpacing:"0.05em" }}>
                GoHighLevel Webhook URL
              </label>
              <input
                value={f.ghl_webhook}
                onChange={(e) => update(f.slug, "ghl_webhook", e.target.value)}
                placeholder="https://services.leadconnectorhq.com/hooks/..."
                style={{ width:"100%", background:"#111827", border:"1px solid #1e2535", color:"#fff",
                  borderRadius:"8px", padding:"12px 14px", fontSize:"15px", boxSizing:"border-box" }}
              />
            </div>
            <button
              onClick={() => handleSave(f)}
              disabled={saving === f.slug}
              style={{ alignSelf:"flex-start", background: saved === f.slug ? "rgba(20,201,184,0.15)" : "#14C9B8",
                color: saved === f.slug ? "#14C9B8" : "#06080f", border: saved === f.slug ? "1px solid #14C9B8" : "none",
                borderRadius:"8px", padding:"11px 24px", fontSize:"15px", fontWeight:700, cursor:"pointer" }}>
              {saving === f.slug ? "Guardando..." : saved === f.slug ? "✓ Guardado" : "Guardar cambios"}
            </button>
          </div>
        </div>
      ))}

      {funnels.length === 0 && (
        <p style={{ color:"#7a8299" }}>No hay funnels configurados aún.</p>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

type Tab = "metricas" | "leads" | "config";

export default function DashboardPage() {
  const [tab, setTab]   = useState<Tab>("metricas");
  const router          = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    router.push("/dashboard/login");
  }

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id:"metricas", label:"Métricas", emoji:"📊" },
    { id:"leads",    label:"Leads",    emoji:"👥" },
    { id:"config",   label:"Configuración", emoji:"⚙️" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#06080f", color:"#fff", fontFamily:"system-ui,sans-serif" }}>
      {/* Header */}
      <div style={{ background:"rgba(13,17,23,0.95)", borderBottom:"1px solid #1e2535", padding:"16px 24px",
        display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:10 }}>
        <div>
          <h1 style={{ color:"#14C9B8", fontWeight:800, fontSize:"1.1rem", margin:0 }}>Dashboard SEED</h1>
          <p style={{ color:"#7a8299", fontSize:"12px", margin:"2px 0 0" }}>seed-mexico</p>
        </div>
        <button onClick={handleLogout}
          style={{ background:"transparent", border:"1px solid #1e2535", color:"#9aa3b2",
            borderRadius:"8px", padding:"8px 16px", fontSize:"13px", cursor:"pointer" }}>
          Cerrar sesión
        </button>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom:"1px solid #1e2535", padding:"0 24px", display:"flex", gap:"4px" }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ background:"none", border:"none", borderBottom: tab === t.id ? "2px solid #14C9B8" : "2px solid transparent",
              color: tab === t.id ? "#14C9B8" : "#7a8299", padding:"14px 16px", fontSize:"15px",
              fontWeight: tab === t.id ? 700 : 400, cursor:"pointer", transition:"all 0.15s" }}>
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"24px 20px" }}>
        {tab === "metricas" && <SeccionMetricas slug={SLUG} />}
        {tab === "leads"    && <SeccionLeads    slug={SLUG} />}
        {tab === "config"   && <SeccionConfiguracion />}
      </div>
    </div>
  );
}
