// ─────────────────────────────────────────────────────────────────────────────
// REGISTRO DE FUNNELS
// Para agregar un funnel nuevo:
// 1. Crea src/funnels/[slug]/copy.ts con el contenido
// 2. Agrégalo aquí con su tipo ("webinar" o "quiz")
// 3. Crea el registro en Supabase (tabla funnels)
// ─────────────────────────────────────────────────────────────────────────────

import { COPY as seedMexicoCopy } from "@/app/content/funnel-copy";
import { COPY as seedMexicoQzCopy } from "@/funnels/seed-mexico-qz/copy";

export type FunnelEntry =
  | { type: "webinar"; copy: typeof seedMexicoCopy }
  | { type: "quiz";    copy: typeof seedMexicoQzCopy };

export const FUNNELS: Record<string, FunnelEntry> = {
  "seed-mexico":    { type: "webinar", copy: seedMexicoCopy },
  "seed-mexico-qz": { type: "quiz",    copy: seedMexicoQzCopy },
};
