import SeedFunnel from "./components/SeedFunnel";
import { FacebookPixel } from "./components/FacebookPixel";
import { supabaseAdmin } from "@/lib/supabase";

export const revalidate = 60; // revalidar config cada minuto

async function getPixelId(): Promise<string> {
  try {
    const { data } = await supabaseAdmin
      .from("funnels")
      .select("fb_pixel_id")
      .eq("slug", "seed-mexico")
      .single();
    return data?.fb_pixel_id ?? "";
  } catch {
    return "";
  }
}

export default async function Home() {
  const pixelId = await getPixelId();
  return (
    <>
      <FacebookPixel pixelId={pixelId} />
      <SeedFunnel />
    </>
  );
}
