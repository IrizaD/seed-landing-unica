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
