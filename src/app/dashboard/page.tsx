"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { parseUA } from "@/lib/parseUA";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Funnel {
  slug: string;
  nombre: string;
  fb_pixel_id: string;
  fb_event_name: string;
  ghl_webhook: string;
  activo: boolean;
}

const FB_EVENTS = [
  "Lead",
  "CompleteRegistration",
  "Contact",
  "SubmitApplication",
  "Schedule",
  "StartTrial",
  "Subscribe",
  "Purchase",
];

interface Registro {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  desde_slide: number;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  ip_country: string;
  ip_city: string;
  user_agent: string;
  created_at: string;
}

interface Breakdown { label: string; count: number }

interface AudienciaData {
  tipo:    Breakdown[];
  os:      Breakdown[];
  browser: Breakdown[];
  pais:    Breakdown[];
  ciudad:  Breakdown[];
}

interface MetricasData {
  totalSesiones:   number;
  totalRegistros:  number;
  tasaConversion:  string;
  eventosPorSlide: { slide_numero: number; tipo: string }[];
  clicksPorSlide:  { slide_numero: number }[];
  registradosDesde: Breakdown[];
  utmSources:      Breakdown[];
  registrosPorDia: Record<string, number>;
  visitantes:      AudienciaData;
  registrados:     AudienciaData;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function SlideBarChart({ data, label }: { data: { slide_numero: number }[]; label: string }) {
  const counts: Record<string, number> = {};
  data.forEach((e) => { const k = String(e.slide_numero); counts[k] = (counts[k] ?? 0) + 1; });
  const entries = Object.entries(counts).sort((a, b) => Number(a[0]) - Number(b[0]));
  const max = Math.max(...entries.map(([, v]) => v), 1);
  const BAR_H = 120;

  return (
    <div style={{ background:"#0d1117", border:"1px solid #1e2535", borderRadius:"12px", padding:"20px 24px" }}>
      <p style={{ color:"#9aa3b2", fontSize:"12px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"20px" }}>{label}</p>
      <div style={{ display:"flex", alignItems:"flex-end", gap:"12px" }}>
        {entries.map(([k, v]) => {
          const barH = Math.max(Math.round((v / max) * BAR_H), 6);
          return (
            <div key={k} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"6px" }}>
              <span style={{ color:"#fff", fontSize:"13px", fontWeight:700 }}>{v}</span>
              <div style={{ width:"100%", height:`${BAR_H}px`, display:"flex", alignItems:"flex-end" }}>
                <div style={{ width:"100%", height:`${barH}px`, background:"linear-gradient(to top, #14C9B8, rgba(20,201,184,0.4))", borderRadius:"6px 6px 0 0" }}/>
              </div>
              <span style={{ color:"#9aa3b2", fontSize:"11px", textAlign:"center", lineHeight:1.3 }}>
                Paso {Number(k) + 1}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BreakdownList({ items, label, color = "#14C9B8" }: { items: Breakdown[]; label: string; color?: string }) {
  const total = items.reduce((s, i) => s + i.count, 0);
  if (items.length === 0) return null;
  return (
    <div style={{ background:"#0d1117", border:"1px solid #1e2535", borderRadius:"12px", padding:"16px 20px" }}>
      <p style={{ color:"#9aa3b2", fontSize:"12px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"12px" }}>{label}</p>
      <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
        {items.slice(0, 6).map((item) => {
          const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
          return (
            <div key={item.label}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"3px" }}>
                <span style={{ color:"#cdd5e0", fontSize:"13px" }}>{item.label}</span>
                <span style={{ color, fontSize:"13px", fontWeight:700 }}>{item.count} <span style={{ color:"#7a8299", fontWeight:400 }}>({pct}%)</span></span>
              </div>
              <div style={{ height:"4px", background:"rgba(255,255,255,0.05)", borderRadius:"2px" }}>
                <div style={{ height:"100%", width:`${pct}%`, background:color, borderRadius:"2px" }}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AudienciaPanel({ data, title, color }: { data: AudienciaData; title: string; color: string }) {
  return (
    <div>
      <h3 style={{ color:"#fff", fontWeight:700, fontSize:"1rem", marginBottom:"12px" }}>{title}</h3>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:"12px" }}>
        <BreakdownList items={data.tipo}    label="Dispositivo" color={color} />
        <BreakdownList items={data.os}      label="Sistema operativo" color={color} />
        <BreakdownList items={data.browser} label="Navegador" color={color} />
        <BreakdownList items={data.pais}    label="País" color={color} />
        <BreakdownList items={data.ciudad}  label="Ciudad" color={color} />
      </div>
    </div>
  );
}

// ─── Secciones ────────────────────────────────────────────────────────────────

function SeccionMetricas({ slug }: { slug: string }) {
  const [data, setData]       = useState<MetricasData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setData(null);
    fetch(`/api/metricas?slug=${slug}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, [slug]);

  if (loading) return <p style={{ color:"#7a8299" }}>Cargando métricas...</p>;
  if (!data)   return <p style={{ color:"#f87171" }}>Error al cargar</p>;

  const hayDatos = data.totalSesiones > 0;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"28px" }}>

      {/* ── KPIs ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:"14px" }}>
        <StatCard label="Visitantes únicos"  value={data.totalSesiones} />
        <StatCard label="Registros"          value={data.totalRegistros} />
        <StatCard label="Tasa conversión"    value={`${data.tasaConversion}%`} />
      </div>

      {!hayDatos && (
        <div style={{ background:"rgba(20,201,184,0.05)", border:"1px solid rgba(20,201,184,0.15)", borderRadius:"12px", padding:"24px", textAlign:"center" }}>
          <p style={{ color:"#7a8299" }}>Aún no hay visitas registradas. Los datos aparecerán en cuanto lleguen visitas al funnel.</p>
        </div>
      )}

      {hayDatos && (
        <>
          {/* ── Funnel ── */}
          <div>
            <h3 style={{ color:"#fff", fontWeight:700, fontSize:"1rem", marginBottom:"12px" }}>Comportamiento en el funnel</h3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:"12px" }}>
              {data.eventosPorSlide.length > 0 && <SlideBarChart data={data.eventosPorSlide} label="Vistas por paso" />}
              {data.clicksPorSlide.length  > 0 && <SlideBarChart data={data.clicksPorSlide}  label="Clics en CTA por paso" />}
              {data.registradosDesde.length > 0 && (
                <BreakdownList items={data.registradosDesde} label="Registros desde qué paso" />
              )}
              {data.utmSources.length > 0 && (
                <BreakdownList items={data.utmSources} label="Fuentes UTM" />
              )}
            </div>
          </div>

          {/* ── Audiencia general ── */}
          <AudienciaPanel
            data={data.visitantes}
            title="Audiencia general (todos los visitantes)"
            color="#14C9B8"
          />

          {/* ── Audiencia registrados ── */}
          {data.totalRegistros > 0 && (
            <AudienciaPanel
              data={data.registrados}
              title="Audiencia registrada"
              color="#818cf8"
            />
          )}
        </>
      )}
    </div>
  );
}

function SeccionLeads({ slug }: { slug: string }) {
  const [leads, setLeads]     = useState<Registro[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setLeads([]);
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
    const header = "Nombre,Email,Teléfono,Paso,Fuente,Medio,Campaña,País,Ciudad,User Agent,Fecha";
    const rows = filtered.map((l) =>
      [l.nombre, l.email, l.telefono, l.desde_slide, l.utm_source, l.utm_medium, l.utm_campaign, l.ip_country, l.ip_city, l.user_agent, fmt(l.created_at)]
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
                {["","Nombre","Email","Teléfono","Paso","Fuente","País","Ciudad","Fecha"].map((h) => (
                  <th key={h} style={{ color:"#7a8299", fontWeight:600, padding:"10px 12px", textAlign:"left", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => {
                const isOpen = expandedId === l.id;
                const ua = parseUA(l.user_agent ?? "");
                return (
                  <>
                    <tr key={l.id}
                      style={{ borderBottom: isOpen ? "none" : "1px solid #111827", background: isOpen ? "rgba(20,201,184,0.04)" : "transparent" }}
                      onMouseEnter={(e) => { if (!isOpen) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
                      onMouseLeave={(e) => { if (!isOpen) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                      <td style={{ padding:"10px 8px 10px 12px" }}>
                        <button
                          onClick={() => setExpandedId(isOpen ? null : l.id)}
                          style={{ background: isOpen ? "rgba(20,201,184,0.15)" : "rgba(255,255,255,0.05)", border:"1px solid", borderColor: isOpen ? "rgba(20,201,184,0.4)" : "#1e2535", borderRadius:"6px", width:"24px", height:"24px", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color: isOpen ? "#14C9B8" : "#7a8299", flexShrink:0 }}>
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none"
                            style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition:"transform 0.2s" }}>
                            <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </td>
                      <td style={{ color:"#fff", padding:"10px 12px" }}>{l.nombre}</td>
                      <td style={{ color:"#cdd5e0", padding:"10px 12px" }}>{l.email}</td>
                      <td style={{ color:"#cdd5e0", padding:"10px 12px" }}>{l.telefono}</td>
                      <td style={{ color:"#14C9B8", padding:"10px 12px", textAlign:"center" }}>P{l.desde_slide}</td>
                      <td style={{ color:"#9aa3b2", padding:"10px 12px" }}>{l.utm_source || "—"}</td>
                      <td style={{ color:"#9aa3b2", padding:"10px 12px" }}>{l.ip_country || "—"}</td>
                      <td style={{ color:"#9aa3b2", padding:"10px 12px" }}>{l.ip_city || "—"}</td>
                      <td style={{ color:"#9aa3b2", padding:"10px 12px", whiteSpace:"nowrap" }}>{fmt(l.created_at)}</td>
                    </tr>
                    {isOpen && (
                      <tr key={`${l.id}-detail`} style={{ borderBottom:"1px solid #111827", background:"rgba(20,201,184,0.04)" }}>
                        <td colSpan={9} style={{ padding:"0 12px 14px 36px" }}>
                          <div style={{ display:"flex", flexWrap:"wrap", gap:"8px 24px" }}>
                            {[
                              { label:"Dispositivo", value: ua.tipo },
                              { label:"OS",          value: ua.osDetail },
                              { label:"Navegador",   value: ua.browser },
                              { label:"UTM Medium",  value: l.utm_medium  || "—" },
                              { label:"UTM Campaign",value: l.utm_campaign || "—" },
                            ].map(({ label, value }) => (
                              <span key={label} style={{ fontSize:"13px" }}>
                                <span style={{ color:"#7a8299" }}>{label}: </span>
                                <span style={{ color:"#cdd5e0" }}>{value}</span>
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
          <p style={{ color:"#7a8299", fontSize:"13px", marginTop:"8px" }}>{filtered.length} lead{filtered.length !== 1 ? "s" : ""}</p>
        </div>
      )}
    </div>
  );
}

function SeccionConfiguracion({
  funnels,
  onRefresh,
  onSelectSlug,
}: {
  funnels: Funnel[];
  onRefresh: () => Promise<void>;
  onSelectSlug: (slug: string) => void;
}) {
  const [localFunnels, setLocalFunnels] = useState<Funnel[]>(funnels);
  const [saving,    setSaving]    = useState<string | null>(null);
  const [saved,     setSaved]     = useState<string | null>(null);
  const [duplicating, setDuplicating] = useState<string | null>(null);

  useEffect(() => { setLocalFunnels(funnels); }, [funnels]);

  async function handleSave(funnel: Funnel) {
    setSaving(funnel.slug);
    await fetch(`/api/funnels/${funnel.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fb_pixel_id: funnel.fb_pixel_id, fb_event_name: funnel.fb_event_name, ghl_webhook: funnel.ghl_webhook }),
    });
    setSaving(null);
    setSaved(funnel.slug);
    setTimeout(() => setSaved(null), 2000);
  }

  async function handleDuplicate(funnel: Funnel) {
    setDuplicating(funnel.slug);
    const newSlug = `${funnel.slug}-copia`;
    const res = await fetch("/api/funnels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: newSlug,
        nombre: `${funnel.nombre} (copia)`,
        fb_pixel_id: funnel.fb_pixel_id,
        fb_event_name: funnel.fb_event_name,
        ghl_webhook: funnel.ghl_webhook,
      }),
    });
    setDuplicating(null);
    if (res.ok) {
      await onRefresh();
      onSelectSlug(newSlug);
    }
  }

  function update(slug: string, key: keyof Funnel, value: string) {
    setLocalFunnels((prev) => prev.map((f) => f.slug === slug ? { ...f, [key]: value } : f));
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
      {localFunnels.map((f) => (
        <div key={f.slug} style={{ background:"#0d1117", border:"1px solid #1e2535", borderRadius:"12px", padding:"24px" }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"4px" }}>
            <h3 style={{ color:"#fff", fontWeight:700, fontSize:"1.1rem", margin:0 }}>{f.nombre}</h3>
            <button
              onClick={() => handleDuplicate(f)}
              disabled={duplicating === f.slug}
              style={{ background:"rgba(255,255,255,0.04)", border:"1px solid #1e2535", color:"#9aa3b2",
                borderRadius:"8px", padding:"6px 14px", fontSize:"13px", fontWeight:600, cursor:"pointer",
                opacity: duplicating === f.slug ? 0.5 : 1, flexShrink:0 }}>
              {duplicating === f.slug ? "Duplicando..." : "Duplicar funnel"}
            </button>
          </div>
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
                Evento de conversión Meta (al enviar formulario)
              </label>
              <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                {FB_EVENTS.map((ev) => (
                  <button key={ev} type="button"
                    onClick={() => update(f.slug, "fb_event_name", ev)}
                    style={{
                      padding:"8px 14px", borderRadius:"8px", fontSize:"14px", fontWeight:600, cursor:"pointer",
                      background: f.fb_event_name === ev ? "#14C9B8" : "rgba(20,201,184,0.08)",
                      color:      f.fb_event_name === ev ? "#06080f" : "#14C9B8",
                      border:     f.fb_event_name === ev ? "none"    : "1px solid rgba(20,201,184,0.3)",
                    }}>
                    {ev}
                  </button>
                ))}
              </div>
              <p style={{ color:"#7a8299", fontSize:"12px", marginTop:"6px" }}>
                Seleccionado: <strong style={{ color:"#14C9B8" }}>{f.fb_event_name || "Lead"}</strong>
              </p>
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

      {localFunnels.length === 0 && (
        <p style={{ color:"#7a8299" }}>No hay funnels configurados aún.</p>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

type Tab = "metricas" | "leads" | "config";

export default function DashboardPage() {
  const [tab, setTab]               = useState<Tab>("metricas");
  const [funnels, setFunnels]       = useState<Funnel[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const router                      = useRouter();

  const loadFunnels = useCallback(async () => {
    const r = await fetch("/api/funnels");
    const d = await r.json();
    const list: Funnel[] = Array.isArray(d) ? d : [];
    setFunnels(list);
    setSelectedSlug((prev) => {
      if (prev && list.find((f) => f.slug === prev)) return prev;
      return list[0]?.slug ?? "";
    });
  }, []);

  useEffect(() => { loadFunnels(); }, [loadFunnels]);

  async function handleLogout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    router.push("/dashboard/login");
  }

  const selectedFunnel = funnels.find((f) => f.slug === selectedSlug);

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id:"metricas", label:"Métricas", emoji:"📊" },
    { id:"leads",    label:"Leads",    emoji:"👥" },
    { id:"config",   label:"Configuración", emoji:"⚙️" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#06080f", color:"#fff", fontFamily:"system-ui,sans-serif" }}>
      {/* Header */}
      <div style={{ background:"rgba(13,17,23,0.95)", borderBottom:"1px solid #1e2535", padding:"14px 24px",
        display:"flex", alignItems:"center", justifyContent:"space-between", gap:"16px",
        position:"sticky", top:0, zIndex:10 }}>

        {/* Selector de funnel */}
        <div style={{ display:"flex", alignItems:"center", gap:"12px", flex:1, minWidth:0 }}>
          <span style={{ color:"#14C9B8", fontWeight:800, fontSize:"1.1rem", flexShrink:0 }}>Dashboard</span>
          {funnels.length > 0 && (
            <div style={{ position:"relative", flex:1, maxWidth:"320px" }}>
              <select
                value={selectedSlug}
                onChange={(e) => setSelectedSlug(e.target.value)}
                style={{
                  width:"100%",
                  background:"#0d1117",
                  border:"1px solid #1e2535",
                  color:"#fff",
                  borderRadius:"8px",
                  padding:"8px 32px 8px 12px",
                  fontSize:"14px",
                  fontWeight:600,
                  cursor:"pointer",
                  appearance:"none",
                  WebkitAppearance:"none",
                }}>
                {funnels.map((f) => (
                  <option key={f.slug} value={f.slug}>{f.nombre}</option>
                ))}
              </select>
              <svg style={{ position:"absolute", right:"10px", top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}
                width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 4l4 4 4-4" stroke="#7a8299" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
          {selectedFunnel && (
            <span style={{ color:"#7a8299", fontSize:"12px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
              {selectedFunnel.slug}
            </span>
          )}
        </div>

        <button onClick={handleLogout}
          style={{ background:"transparent", border:"1px solid #1e2535", color:"#9aa3b2",
            borderRadius:"8px", padding:"8px 16px", fontSize:"13px", cursor:"pointer", flexShrink:0 }}>
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
        {!selectedSlug ? (
          <p style={{ color:"#7a8299" }}>Cargando funnels...</p>
        ) : (
          <>
            {tab === "metricas" && <SeccionMetricas slug={selectedSlug} />}
            {tab === "leads"    && <SeccionLeads    slug={selectedSlug} />}
            {tab === "config"   && (
              <SeccionConfiguracion
                funnels={funnels}
                onRefresh={loadFunnels}
                onSelectSlug={(slug) => { setSelectedSlug(slug); setTab("metricas"); }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
