import SeedFunnel from "./components/SeedFunnel";
import { FacebookPixel } from "./components/FacebookPixel";
import { supabaseAdmin } from "@/lib/supabase";

export const revalidate = 60;

async function getFunnelConfig(): Promise<{ pixelId: string; fbEventName: string }> {
  try {
    const { data } = await supabaseAdmin
      .from("funnels")
      .select("fb_pixel_id, fb_event_name")
      .eq("slug", "seed-mexico")
      .single();
    return {
      pixelId:     data?.fb_pixel_id   ?? "",
      fbEventName: data?.fb_event_name ?? "Lead",
    };
  } catch {
    return { pixelId: "", fbEventName: "Lead" };
  }
}

export default async function Home() {
  const { pixelId, fbEventName } = await getFunnelConfig();
  return (
    <>
      <FacebookPixel pixelId={pixelId} />
      <SeedFunnel fbEventName={fbEventName} />
    </>
  );
}
