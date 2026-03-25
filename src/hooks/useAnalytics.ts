"use client";
import { useEffect, useRef } from "react";

const SESSION_KEY = "seed_session_id";
const UTM_KEY = "seed_utms";

function getOrCreateSession(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function readUtms(): Record<string, string> {
  const stored = sessionStorage.getItem(UTM_KEY);
  if (stored) return JSON.parse(stored);

  const params = new URLSearchParams(window.location.search);
  const utms: Record<string, string> = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((k) => {
    const v = params.get(k);
    if (v) utms[k] = v;
  });
  sessionStorage.setItem(UTM_KEY, JSON.stringify(utms));
  return utms;
}

export function useAnalytics(funnelSlug: string) {
  const sessionId = useRef<string>("");
  const utms = useRef<Record<string, string>>({});

  useEffect(() => {
    sessionId.current = getOrCreateSession();
    utms.current = readUtms();
  }, []);

  function trackStep(slideNumero: number) {
    fetch("/api/evento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        funnel_slug: funnelSlug,
        session_id: sessionId.current,
        tipo: "step_view",
        slide_numero: slideNumero,
        ...utms.current,
      }),
    }).catch(() => {});
  }

  function trackCta(slideNumero: number) {
    fetch("/api/evento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        funnel_slug: funnelSlug,
        session_id: sessionId.current,
        tipo: "cta_click",
        slide_numero: slideNumero,
        ...utms.current,
      }),
    }).catch(() => {});
  }

  async function submitRegistro(data: {
    nombre: string;
    email: string;
    telefono: string;
    desde_slide: number;
  }) {
    const res = await fetch("/api/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        funnel_slug: funnelSlug,
        ...data,
        ...utms.current,
      }),
    });
    return res.ok;
  }

  return { trackStep, trackCta, submitRegistro };
}
