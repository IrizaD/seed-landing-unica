import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { FacebookPixel } from "@/app/components/FacebookPixel";
import SeedFunnel from "@/app/components/SeedFunnel";
import { FUNNEL_COPY } from "@/config/funnels";

export const revalidate = 60;

export async function generateStaticParams() {
  return Object.keys(FUNNEL_COPY).map((slug) => ({ slug }));
}

export default async function FunnelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const copy = FUNNEL_COPY[slug];
  if (!copy) notFound();

  let pixelId = "";
  let fbEventName = "Lead";
  try {
    const { data } = await supabaseAdmin
      .from("funnels")
      .select("fb_pixel_id, fb_event_name")
      .eq("slug", slug)
      .single();
    pixelId = data?.fb_pixel_id ?? "";
    fbEventName = data?.fb_event_name ?? "Lead";
  } catch {
    // usar defaults si falla Supabase
  }

  return (
    <>
      <FacebookPixel pixelId={pixelId} />
      <SeedFunnel fbEventName={fbEventName} copy={copy} slug={slug} />
    </>
  );
}
