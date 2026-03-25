import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Cliente público (browser-safe)
export const supabase = createClient(url, anon);

// Cliente con privilegios de servicio (solo server-side / API routes)
export const supabaseAdmin = createClient(url, service);
