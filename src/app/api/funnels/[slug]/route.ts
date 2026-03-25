import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await req.json();
  const { nombre, fb_pixel_id, fb_event_name, ghl_webhook, activo } = body;

  const updates: Record<string, unknown> = {};
  if (nombre !== undefined) updates.nombre = nombre;
  if (fb_pixel_id !== undefined) updates.fb_pixel_id = fb_pixel_id;
  if (fb_event_name !== undefined) updates.fb_event_name = fb_event_name;
  if (ghl_webhook !== undefined) updates.ghl_webhook = ghl_webhook;
  if (activo !== undefined) updates.activo = activo;

  const { data, error } = await supabaseAdmin
    .from("funnels")
    .update(updates)
    .eq("slug", slug)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const { data, error } = await supabaseAdmin
    .from("funnels")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}
