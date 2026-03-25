import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      funnel_slug,
      session_id,
      tipo,
      slide_numero,
      utm_source = "",
      utm_medium = "",
      utm_campaign = "",
    } = body;

    if (!funnel_slug || !session_id || !tipo) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    const user_agent = req.headers.get("user-agent")             ?? "";
    const ip_country = req.headers.get("x-vercel-ip-country")    ?? "";
    const ip_city    = req.headers.get("x-vercel-ip-city")       ?? "";
    const ip_region  = req.headers.get("x-vercel-ip-country-region") ?? "";

    const { error } = await supabaseAdmin.from("eventos").insert({
      funnel_slug,
      session_id,
      tipo,
      slide_numero: slide_numero ?? null,
      utm_source,
      utm_medium,
      utm_campaign,
      user_agent,
      ip_country,
      ip_city,
      ip_region,
    });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[/api/evento]", e);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
