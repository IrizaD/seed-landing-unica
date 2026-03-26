// ─────────────────────────────────────────────────────────────────────────────
// REGISTRO DE FUNNELS
// Para agregar un funnel nuevo:
// 1. Crea src/funnels/[slug]/copy.ts con el contenido
// 2. Agrégalo aquí
// 3. Crea el registro en Supabase (tabla funnels)
// ─────────────────────────────────────────────────────────────────────────────

import { COPY as seedMexicoCopy } from "@/app/content/funnel-copy";
import { COPY as seedMexicoQzCopy } from "@/funnels/seed-mexico-qz/copy";

export const FUNNEL_COPY: Record<string, typeof seedMexicoCopy> = {
  "seed-mexico":    seedMexicoCopy,
  "seed-mexico-qz": seedMexicoQzCopy,
};
