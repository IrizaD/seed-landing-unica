import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      funnel_slug,
      nombre,
      email,
      telefono,
      desde_slide = 0,
      utm_source = "",
      utm_medium = "",
      utm_campaign = "",
      utm_content = "",
      utm_term = "",
    } = body;

    if (!funnel_slug || !nombre || !email || !telefono) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    // Geo + User Agent (Vercel headers)
    const user_agent = req.headers.get("user-agent") ?? "";
    const ip_country = req.headers.get("x-vercel-ip-country") ?? "";
    const ip_city    = decodeURIComponent(req.headers.get("x-vercel-ip-city") ?? "");
    const ip_region  = decodeURIComponent(req.headers.get("x-vercel-ip-country-region") ?? "");

    // 1. Guardar en Supabase
    const { error } = await supabaseAdmin.from("registros").insert({
      funnel_slug,
      nombre,
      email,
      telefono,
      desde_slide,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      user_agent,
      ip_country,
      ip_city,
      ip_region,
    });

    if (error) throw error;

    // 2. Webhook GoHighLevel (si el funnel lo tiene configurado)
    const { data: funnel } = await supabaseAdmin
      .from("funnels")
      .select("ghl_webhook")
      .eq("slug", funnel_slug)
      .single();

    if (funnel?.ghl_webhook) {
      await fetch(funnel.ghl_webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, telefono, funnel_slug, utm_source, utm_medium, utm_campaign }),
      }).catch((e) => console.error("[GHL webhook]", e));
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[/api/registro]", e);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
