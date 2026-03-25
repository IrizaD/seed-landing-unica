import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug") ?? "seed-mexico";

  // Registros por día (últimos 30 días)
  const { data: registrosPorDia } = await supabaseAdmin
    .from("registros")
    .select("created_at")
    .eq("funnel_slug", slug)
    .gte("created_at", new Date(Date.now() - 30 * 86400000).toISOString());

  // Eventos por slide
  const { data: eventosPorSlide } = await supabaseAdmin
    .from("eventos")
    .select("slide_numero, tipo")
    .eq("funnel_slug", slug)
    .eq("tipo", "step_view");

  // Clicks CTA por slide
  const { data: clicksPorSlide } = await supabaseAdmin
    .from("eventos")
    .select("slide_numero")
    .eq("funnel_slug", slug)
    .eq("tipo", "cta_click");

  // Desde qué slide se registraron
  const { data: registrosDesdeSlide } = await supabaseAdmin
    .from("registros")
    .select("desde_slide")
    .eq("funnel_slug", slug);

  // UTM breakdown
  const { data: utms } = await supabaseAdmin
    .from("registros")
    .select("utm_source, utm_medium, utm_campaign")
    .eq("funnel_slug", slug)
    .neq("utm_source", "");

  // Total registros
  const { count: totalRegistros } = await supabaseAdmin
    .from("registros")
    .select("id", { count: "exact", head: true })
    .eq("funnel_slug", slug);

  // Total sesiones únicas
  const { data: sesiones } = await supabaseAdmin
    .from("eventos")
    .select("session_id")
    .eq("funnel_slug", slug);

  const sesionesUnicas = new Set(sesiones?.map((e) => e.session_id) ?? []).size;

  return NextResponse.json({
    totalRegistros: totalRegistros ?? 0,
    sesionesUnicas,
    registrosPorDia: registrosPorDia ?? [],
    eventosPorSlide: eventosPorSlide ?? [],
    clicksPorSlide: clicksPorSlide ?? [],
    registrosDesdeSlide: registrosDesdeSlide ?? [],
    utms: utms ?? [],
  });
}
