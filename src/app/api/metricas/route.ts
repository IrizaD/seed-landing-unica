import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { parseUA, groupCount } from "@/lib/parseUA";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug") ?? "seed-mexico";

  // ── Eventos (todos los visitantes) ──────────────────────────────────────────
  const { data: eventosRaw } = await supabaseAdmin
    .from("eventos")
    .select("session_id, tipo, slide_numero, user_agent, ip_country, ip_city, utm_source, utm_medium, utm_campaign")
    .eq("funnel_slug", slug);

  const eventos = eventosRaw ?? [];

  // Sesiones únicas (primera ocurrencia por session_id)
  const sesionesMap = new Map<string, typeof eventos[number]>();
  eventos.forEach((e) => { if (!sesionesMap.has(e.session_id)) sesionesMap.set(e.session_id, e); });
  const sesiones = Array.from(sesionesMap.values());

  // Breakdowns de visitantes
  const visitantesTipo    = groupCount(sesiones, (s) => parseUA(s.user_agent).tipo);
  const visitantesOS      = groupCount(sesiones, (s) => parseUA(s.user_agent).os);
  const visitantesBrowser = groupCount(sesiones, (s) => parseUA(s.user_agent).browser);
  const visitantesPais    = groupCount(sesiones, (s) => s.ip_country || "Desconocido");
  const visitantesCiudad  = groupCount(sesiones, (s) => s.ip_city    || "Desconocido");

  // Vistas y clicks por slide
  const eventosPorSlide = eventos.filter((e) => e.tipo === "step_view");
  const clicksPorSlide  = eventos.filter((e) => e.tipo === "cta_click");
  const utmSources      = sesiones.filter((s) => s.utm_source);

  // ── Registros ───────────────────────────────────────────────────────────────
  const { data: registrosRaw } = await supabaseAdmin
    .from("registros")
    .select("id, nombre, email, telefono, desde_slide, user_agent, ip_country, ip_city, utm_source, utm_medium, utm_campaign, created_at")
    .eq("funnel_slug", slug)
    .order("created_at", { ascending: false })
    .limit(500);

  const registros = registrosRaw ?? [];

  // Breakdowns de registrados
  const registradosTipo    = groupCount(registros, (r) => parseUA(r.user_agent).tipo);
  const registradosOS      = groupCount(registros, (r) => parseUA(r.user_agent).os);
  const registradosBrowser = groupCount(registros, (r) => parseUA(r.user_agent).browser);
  const registradosPais    = groupCount(registros, (r) => r.ip_country || "Desconocido");
  const registradosCiudad  = groupCount(registros, (r) => r.ip_city    || "Desconocido");
  const registradosDesde   = groupCount(registros, (r) => `Paso ${r.desde_slide}`);

  // Registros por día
  const porDia: Record<string, number> = {};
  registros.forEach(({ created_at }) => {
    const d = new Date(created_at).toLocaleDateString("es-MX", { day:"2-digit", month:"short" });
    porDia[d] = (porDia[d] ?? 0) + 1;
  });

  return NextResponse.json({
    // ── Totales ──────────────────────────────────────────
    totalSesiones:   sesiones.length,
    totalRegistros:  registros.length,
    tasaConversion:  sesiones.length > 0
      ? ((registros.length / sesiones.length) * 100).toFixed(1)
      : "0",

    // ── Funnel ───────────────────────────────────────────
    eventosPorSlide,
    clicksPorSlide,
    registradosDesde,
    utmSources: groupCount(utmSources, (s) => s.utm_source),
    registrosPorDia: porDia,

    // ── Audiencia general (visitantes) ───────────────────
    visitantes: {
      tipo:    visitantesTipo,
      os:      visitantesOS,
      browser: visitantesBrowser,
      pais:    visitantesPais,
      ciudad:  visitantesCiudad,
    },

    // ── Audiencia registrados ─────────────────────────────
    registrados: {
      tipo:    registradosTipo,
      os:      registradosOS,
      browser: registradosBrowser,
      pais:    registradosPais,
      ciudad:  registradosCiudad,
    },
  });
}
