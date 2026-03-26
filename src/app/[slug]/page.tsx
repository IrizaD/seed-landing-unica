import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { FacebookPixel } from "@/app/components/FacebookPixel";
import SeedFunnel from "@/app/components/SeedFunnel";
import QuizFunnel from "@/app/components/QuizFunnel";
import { FUNNELS } from "@/config/funnels";

export const revalidate = 60;

export async function generateStaticParams() {
  return Object.keys(FUNNELS).map((slug) => ({ slug }));
}

export default async function FunnelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const funnel = FUNNELS[slug];
  if (!funnel) notFound();

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
      {funnel.type === "quiz" ? (
        <QuizFunnel fbEventName={fbEventName} copy={funnel.copy} slug={slug} />
      ) : (
        <SeedFunnel fbEventName={fbEventName} copy={funnel.copy} slug={slug} />
      )}
    </>
  );
}
