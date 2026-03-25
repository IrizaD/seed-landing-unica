"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { COPY } from "@/app/content/funnel-copy";
import { useAnalytics } from "@/hooks/useAnalytics";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  nombre: string;
  phone: string;
  dialCode: string;
  email: string;
}

interface EventDate {
  formatted: string;
}

interface CountryCode {
  code: string;
  dial: string;
  flag: string;
  name: string;
  tzTokens: string[];
}

// ─── Country codes ────────────────────────────────────────────────────────────

const COUNTRY_CODES: CountryCode[] = [
  { code: "MX", dial: "+52",  flag: "🇲🇽", name: "México",         tzTokens: ["Mexico_City","Monterrey","Merida","Chihuahua","Hermosillo","Mazatlan","Bahia_Banderas"] },
  { code: "US", dial: "+1",   flag: "🇺🇸", name: "Estados Unidos",  tzTokens: ["New_York","Chicago","Denver","Los_Angeles","Phoenix","Anchorage","Honolulu","Indiana"] },
  { code: "CO", dial: "+57",  flag: "🇨🇴", name: "Colombia",        tzTokens: ["Bogota"] },
  { code: "AR", dial: "+54",  flag: "🇦🇷", name: "Argentina",       tzTokens: ["Argentina"] },
  { code: "VE", dial: "+58",  flag: "🇻🇪", name: "Venezuela",       tzTokens: ["Caracas"] },
  { code: "PE", dial: "+51",  flag: "🇵🇪", name: "Perú",            tzTokens: ["Lima"] },
  { code: "CL", dial: "+56",  flag: "🇨🇱", name: "Chile",           tzTokens: ["Santiago"] },
  { code: "EC", dial: "+593", flag: "🇪🇨", name: "Ecuador",         tzTokens: ["Guayaquil"] },
  { code: "GT", dial: "+502", flag: "🇬🇹", name: "Guatemala",       tzTokens: ["Guatemala"] },
  { code: "DO", dial: "+1",   flag: "🇩🇴", name: "Rep. Dominicana", tzTokens: ["Santo_Domingo"] },
  { code: "PA", dial: "+507", flag: "🇵🇦", name: "Panamá",          tzTokens: ["Panama"] },
  { code: "CR", dial: "+506", flag: "🇨🇷", name: "Costa Rica",      tzTokens: ["Costa_Rica"] },
  { code: "ES", dial: "+34",  flag: "🇪🇸", name: "España",          tzTokens: ["Madrid"] },
  { code: "BR", dial: "+55",  flag: "🇧🇷", name: "Brasil",          tzTokens: ["Sao_Paulo","Brasilia","Manaus","Belem","Recife"] },
];

function detectDialCode(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const match = COUNTRY_CODES.find((c) => c.tzTokens.some((t) => tz.includes(t)));
    return match?.dial ?? "+52";
  } catch {
    return "+52";
  }
}

// ─── Date helper ──────────────────────────────────────────────────────────────

const MONTHS_ES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

function getNextThursday(): EventDate {
  const now = new Date();
  const mx  = new Date(now.toLocaleString("en-US", { timeZone: "America/Mexico_City" }));
  let days  = (4 - mx.getDay() + 7) % 7;
  if (days === 0 && mx.getHours() >= 20) days = 7;
  const t   = new Date(mx);
  t.setDate(mx.getDate() + days);
  return { formatted: `Jueves ${t.getDate()} de ${MONTHS_ES[t.getMonth()]}, ${t.getFullYear()}` };
}

// ─── PhoneInput ───────────────────────────────────────────────────────────────

function PhoneInput({ dialCode, phone, onDialChange, onPhoneChange }: {
  dialCode: string; phone: string;
  onDialChange: (d: string) => void; onPhoneChange: (p: string) => void;
}) {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const selected = COUNTRY_CODES.find((c) => c.dial === dialCode) ?? COUNTRY_CODES[0];
  const filtered = COUNTRY_CODES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.dial.includes(search)
  );

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false); setSearch("");
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex gap-2 w-full" ref={ref}>
      <div className="relative flex-shrink-0">
        <button type="button" onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 rounded-xl transition-all duration-200 focus:outline-none"
          style={{ background:"#0d1117", border:`1px solid ${open?"#14C9B8":"#1e2535"}`, padding:"14px 12px", color:"#fff", minWidth:"96px" }}>
          <span className="text-lg leading-none">{selected.flag}</span>
          <span style={{ fontSize:"16px", fontWeight:600 }}>{selected.dial}</span>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none"
            style={{ color:"#7a8299", marginLeft:"2px", transform:open?"rotate(180deg)":"rotate(0deg)", transition:"transform 0.2s" }}>
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {open && (
          <div className="absolute left-0 top-full mt-1 rounded-xl overflow-hidden z-50"
            style={{ background:"#0d1117", border:"1px solid #1e2535", width:"min(240px, calc(100vw - 120px))", boxShadow:"0 16px 40px rgba(0,0,0,0.6)" }}>
            <div style={{ padding:"8px", borderBottom:"1px solid #1e2535" }}>
              <input autoFocus type="text" placeholder="Buscar país..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full focus:outline-none"
                style={{ background:"#111827", border:"1px solid #1e2535", color:"#fff", borderRadius:"8px", padding:"10px 12px", fontSize:"16px" }}/>
            </div>
            <div style={{ maxHeight:"220px", overflowY:"auto" }}>
              {filtered.map((c) => (
                <button key={c.code+c.dial} type="button"
                  onClick={() => { onDialChange(c.dial); setOpen(false); setSearch(""); }}
                  className="w-full flex items-center gap-2.5 text-left transition-colors"
                  style={{ padding:"14px 14px", fontSize:"15px", color:c.dial===dialCode?"#14C9B8":"#ccc", background:c.dial===dialCode?"rgba(20,201,184,0.08)":"transparent" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(20,201,184,0.06)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = c.dial===dialCode?"rgba(20,201,184,0.08)":"transparent")}>
                  <span className="text-lg">{c.flag}</span>
                  <span className="flex-1 truncate">{c.name}</span>
                  <span style={{ color:"#7a8299", fontSize:"13px" }}>{c.dial}</span>
                </button>
              ))}
              {filtered.length === 0 && <p className="text-center py-4" style={{ color:"#7a8299", fontSize:"15px" }}>Sin resultados</p>}
            </div>
          </div>
        )}
      </div>
      <input type="tel" required placeholder="55 1234 5678" value={phone}
        onChange={(e) => onPhoneChange(e.target.value)}
        className="flex-1 min-w-0 rounded-xl transition-all duration-200 focus:outline-none"
        style={{ background:"#0d1117", border:"1px solid #1e2535", color:"#fff", padding:"14px 16px", fontSize:"16px", letterSpacing:"0.01em", minWidth:0 }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "#14C9B8")}
        onBlur={(e)  => (e.currentTarget.style.borderColor = "#1e2535")}/>
    </div>
  );
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function DateChip({ date }: { date: EventDate }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full"
      style={{ background:"rgba(20,201,184,0.08)", border:"1px solid rgba(20,201,184,0.22)", padding:"9px 16px" }}>
      <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
        <span className="animate-ping-teal absolute inline-flex h-full w-full rounded-full" style={{ background:"#14C9B8", opacity:0.4 }}/>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background:"#14C9B8" }}/>
      </span>
      <span style={{ color:"#14C9B8", fontSize:"16px", fontWeight:700 }}>{date.formatted}</span>
      <span style={{ color:"#9aa3b2", fontSize:"15px" }}>· 8:00 PM hora México</span>
    </div>
  );
}

// Botón principal — teal sólido
function TealBtn({ children, onClick, type = "button", form, disabled }: {
  children: React.ReactNode; onClick?: () => void; type?: "button" | "submit"; form?: string; disabled?: boolean;
}) {
  return (
    <button type={type} form={form} onClick={onClick} disabled={disabled}
      className="w-full rounded-xl transition-all duration-200 active:scale-[0.98]"
      style={{ background: disabled ? "#0a8a80" : "#14C9B8", color:"#06080f", padding:"15px 24px",
        fontSize:"1.0625rem", fontFamily:"var(--font-barlow)", fontWeight:800, letterSpacing:"0.04em",
        lineHeight:1.2, cursor: disabled ? "not-allowed" : "pointer" }}
      onMouseEnter={(e) => { if (!disabled) (e.currentTarget as HTMLElement).style.background = "#1FE5D2"; }}
      onMouseLeave={(e) => { if (!disabled) (e.currentTarget as HTMLElement).style.background = "#14C9B8"; }}>
      {children}
    </button>
  );
}

// Botón secundario — sólido teal con glow
function GhostBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="w-full rounded-xl transition-all duration-200 active:scale-[0.98]"
      style={{
        background:"#14C9B8",
        border:"none",
        color:"#06080f",
        padding:"15px 24px",
        fontSize:"1.0625rem",
        fontFamily:"var(--font-barlow)",
        fontWeight:800,
        letterSpacing:"0.04em",
        lineHeight:1.2,
        cursor:"pointer",
        boxShadow:"0 0 20px rgba(20,201,184,0.45)"
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "#1FE5D2";
        el.style.boxShadow = "0 0 32px rgba(20,201,184,0.65)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "#14C9B8";
        el.style.boxShadow = "0 0 20px rgba(20,201,184,0.45)";
      }}>
      {children}
    </button>
  );
}

function Row({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 md:gap-3" style={{ color:"#cdd5e0", fontSize:"clamp(1rem, 1.6vw, 1.0625rem)", lineHeight:1.65, letterSpacing:"0.01em" }}>
      <span className="flex-shrink-0 text-base md:text-lg mt-0.5">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

function Headline({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="uppercase mb-2 md:mb-4"
      style={{ fontFamily:"var(--font-barlow)", fontWeight:900, lineHeight:1.1,
        fontSize:"clamp(1.3rem, 3.5vw, 2.75rem)", color:"#fff", letterSpacing:"-0.01em" }}>
      {children}
    </h2>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border" style={{ background:"#0d1117", borderColor:"#1e2535", padding:"clamp(14px, 2vw, 24px)" }}>
      {children}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function SeedFunnel({ fbEventName = "Lead" }: { fbEventName?: string }) {
  const [step, setStep]       = useState(0);
  const [form, setForm]       = useState<FormData>({ nombre:"", phone:"", dialCode:"+52", email:"" });
  const [submitting, setSubmitting] = useState(false);
  const [eventDate]           = useState<EventDate>(getNextThursday);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showArrows, setShowArrows]   = useState(true);
  const TOTAL                 = 6;
  const contentRef  = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const isDragging  = useRef(false);
  const arrowTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const desdeSlide  = useRef(0); // slide donde el usuario hizo clic en "Registrarme ahora"

  const { trackStep, trackCta, submitRegistro } = useAnalytics("seed-mexico");

  function flashArrows() {
    setShowArrows(true);
    if (arrowTimer.current) clearTimeout(arrowTimer.current);
    arrowTimer.current = setTimeout(() => setShowArrows(false), 2500);
  }

  useEffect(() => {
    setForm((p) => ({ ...p, dialCode: detectDialCode() }));
    // Deep linking: ?step=X
    const params = new URLSearchParams(window.location.search);
    const stepParam = parseInt(params.get("step") ?? "0", 10);
    const initialStep = (!isNaN(stepParam) && stepParam >= 0 && stepParam <= 5) ? stepParam : 0;
    setStep(initialStep);
    trackStep(initialStep);
    flashArrows();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function goToStep(n: number, fromCta = false) {
    if (isAnimating) return;
    if (fromCta) {
      desdeSlide.current = step;
      trackCta(step);
    }
    const el = contentRef.current;
    if (!el) { setStep(n); trackStep(n); return; }
    const dir = n >= step ? "left" : "right";
    const w = window.innerWidth;
    setIsAnimating(true);
    el.style.transition = "transform 0.32s cubic-bezier(0.4,0,0.2,1)";
    el.style.transform  = `translateX(${dir === "left" ? -w : w}px)`;
    setTimeout(() => {
      el.style.transition = "none";
      el.style.transform  = `translateX(${dir === "left" ? w : -w}px)`;
      setStep(n);
      trackStep(n);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.style.transition = "transform 0.32s cubic-bezier(0.4,0,0.2,1)";
        el.style.transform  = "translateX(0)";
        setTimeout(() => setIsAnimating(false), 320);
      }));
      flashArrows();
    }, 320);
  }

  function handleTouchStart(e: React.TouchEvent) {
    if (isAnimating || step > 4) return;
    touchStartX.current = e.touches[0].clientX;
    isDragging.current  = true;
    const el = contentRef.current;
    if (el) el.style.transition = "none";
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!isDragging.current || !contentRef.current || step > 4) return;
    const delta = e.touches[0].clientX - touchStartX.current;
    let offset = delta;
    if (delta > 0 && step === 0) offset = Math.min(delta * 0.25, 40);
    else if (delta < 0 && step >= 4) offset = Math.max(delta * 0.25, -40);
    contentRef.current.style.transform = `translateX(${offset}px)`;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (!isDragging.current) return;
    isDragging.current = false;
    const delta     = touchStartX.current - e.changedTouches[0].clientX;
    const threshold = window.innerWidth * 0.3;
    if (delta > threshold && step < 4)       goToStep(step + 1);
    else if (delta < -threshold && step > 0) goToStep(step - 1);
    else if (contentRef.current) {
      contentRef.current.style.transition = "transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94)";
      contentRef.current.style.transform  = "translateX(0)";
    }
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setSubmitting(true);
    await submitRegistro({
      nombre: form.nombre,
      email:  form.email,
      telefono: `${form.dialCode} ${form.phone}`,
      desde_slide: desdeSlide.current,
    });

    // Disparar conversión en Meta Pixel
    try {
      const fbq = (window as unknown as Record<string, unknown>).fbq as ((...a: unknown[]) => void) | undefined;
      if (fbq && fbEventName) fbq("track", fbEventName);
    } catch {}

    goToStep(6);
    setSubmitting(false);
  }

  const showBar = step >= 1 && step <= 5;

  return (
    <div style={{ height:"100dvh" }} className="flex flex-col overflow-hidden relative"
      aria-label="Registro al seminario">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0" aria-hidden="true"
        style={{ backgroundImage:"url('/bg-glow.png')", backgroundSize:"cover", backgroundPosition:"center", opacity:0.6 }}/>
      <div className="pointer-events-none fixed inset-0" aria-hidden="true"
        style={{ background:"radial-gradient(ellipse 80% 60% at 10% 80%, rgba(14,80,180,0.10) 0%, transparent 60%)" }}/>

      {/* ── STICKY HEADER ─────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 relative z-10 px-5 md:px-12 pt-3 pb-2"
        style={{ background:"rgba(6,8,15,0.85)", backdropFilter:"blur(8px)" }}>
        <div className="max-w-[900px] md:max-w-[900px] mx-auto">
          <Image
            src="/logo-seed.webp"
            alt="Seminario de Emprendedor a Empresario Digital"
            width={220} height={53}
            style={{ objectFit:"contain", objectPosition:"left" }}
            priority
          />
          {/* Botón volver en el formulario */}
          {step === 5 && (
            <div className="flex items-center mt-2">
              <button type="button" onClick={() => goToStep(4)}
                className="flex items-center gap-1.5 transition-all duration-200 font-semibold"
                style={{ color:"#9aa3b2", background:"none", border:"none", padding:"8px 0", fontSize:"0.875rem", cursor:"pointer" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#14C9B8")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#9aa3b2")}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {COPY.header.backLabel}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── CONTENT AREA + SIDE ARROWS ───────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden">

        {/* Flecha izquierda */}
        {step >= 1 && step <= 4 && (
          <button type="button" onClick={() => goToStep(step - 1)} aria-label="Paso anterior"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full active:scale-90 select-none md:left-4 animate-cta-pulse"
            style={{ width:"44px", height:"44px",
              background:"linear-gradient(135deg, #FF8C00 0%, #FFD600 100%)",
              border:"none", color:"#fff", cursor:"pointer",
              textShadow:"0 1px 4px rgba(0,0,0,0.4)" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {/* Flecha derecha */}
        {step >= 0 && step <= 4 && (
          <button type="button" onClick={() => goToStep(step + 1)} aria-label="Paso siguiente"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full active:scale-90 select-none md:right-4 animate-cta-pulse"
            style={{ width:"44px", height:"44px",
              background:"linear-gradient(135deg, #FF8C00 0%, #FFD600 100%)",
              border:"none", color:"#fff", cursor:"pointer",
              textShadow:"0 1px 4px rgba(0,0,0,0.4)" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3l5 5-5 5" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {/* Scrollable inner */}
        <div className="h-full overflow-y-auto relative z-10"
          style={{ touchAction:"pan-y" }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}>
        <div className="px-14 md:px-24 pt-3 pb-1 md:pt-8" style={{ maxWidth:"900px", margin:"0 auto" }}>
          <div ref={contentRef} style={{ willChange:"transform" }}>

            {/* ── 0: HOOK ────────────────────────────────────────────── */}
            {step === 0 && (
              <div>
                <h1 className="uppercase mb-2 md:mb-4"
                  style={{ fontFamily:"var(--font-barlow)", fontWeight:900, lineHeight:1.15,
                    fontSize:"clamp(1.5rem, 5vw, 4rem)", color:"#fff", letterSpacing:"-0.02em" }}>
                  {COPY.step0.headlineLine1} <span style={{ color:"#14C9B8", fontStyle:"italic" }}>{COPY.step0.headlineLine2}</span>
                </h1>

                <div className="mb-3" style={{ width:"40px", height:"3px", background:"#14C9B8", borderRadius:"2px" }}/>

                <p className="mb-3" style={{ fontSize:"1.0625rem", color:"#cdd5e0", lineHeight:1.65, letterSpacing:"0.01em" }}>
                  {COPY.step0.body}
                </p>

                <div className="mb-2">
                  <DateChip date={eventDate}/>
                </div>

                <div className="flex justify-center">
                  <Image
                    src="/manujorge.png"
                    alt={COPY.step0.imageAlt}
                    width={520} height={520}
                    className="w-full max-h-[30vh] md:max-h-[58vh]"
                    style={{ objectFit:"contain", objectPosition:"center bottom" }}
                  />
                </div>
              </div>
            )}

            {/* ── 1: EL PROBLEMA ─────────────────────────────────────── */}
            {step === 1 && (
              <div>
                <Headline>
                  {COPY.step1.headlineLine1} <span style={{ color:"#14C9B8" }}>{COPY.step1.headlineLine2}</span>
                </Headline>

                <Card>
                  <div className="space-y-3">
                    {COPY.step1.rows.map((r) => (
                      <Row key={r.icon} icon={r.icon}>{r.text}</Row>
                    ))}
                  </div>
                </Card>

                <div className="mt-3 rounded-xl border"
                  style={{ background:"rgba(20,201,184,0.06)", borderColor:"rgba(20,201,184,0.18)", padding:"12px 14px" }}>
                  <p style={{ color:"#cdd5e0", fontSize:"1.0625rem", lineHeight:1.65 }}>
                    <strong style={{ color:"#14C9B8" }}>{COPY.step1.calloutBold}</strong>{COPY.step1.calloutBody}
                  </p>
                </div>
              </div>
            )}

            {/* ── 2: LO QUE APRENDERÁN ───────────────────────────────── */}
            {step === 2 && (
              <div>
                <Headline>
                  {COPY.step2.headlineLine1} <span style={{ color:"#14C9B8" }}>{COPY.step2.headlineLine2}</span>
                </Headline>

                <Card>
                  <div className="space-y-3">
                    {COPY.step2.rows.map((r) => (
                      <Row key={r.icon} icon={r.icon}>
                        <strong style={{ color:"#fff" }}>{r.label}</strong>{r.text}
                      </Row>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* ── 3: CREDIBILIDAD ────────────────────────────────────── */}
            {step === 3 && (
              <div>
                <Headline>
                  {COPY.step3.headlineLine1} <span style={{ color:"#14C9B8" }}>{COPY.step3.headlineLine2}</span>
                </Headline>

                <div className="space-y-2 mb-3">
                  {COPY.step3.speakers.map((s, i) => (
                    <Card key={s.initials}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex-shrink-0 rounded-full flex items-center justify-center font-black"
                          style={{ width:"40px", height:"40px", fontSize:"14px",
                            background: i === 0 ? "linear-gradient(135deg,#14C9B8,#0a8a80)" : "linear-gradient(135deg,#1e3a5f,#2d6aad)",
                            color: i === 0 ? "#06080f" : "#7ab3d4" }}>
                          {s.initials}
                        </div>
                        <div>
                          <p style={{ color:"#fff", fontWeight:700, fontSize:"1.0625rem" }}>{s.name}</p>
                          <p style={{ color:"#9aa3b2", fontSize:"14px" }}>{s.title}</p>
                        </div>
                      </div>
                      <p style={{ color:"#cdd5e0", fontSize:"1rem", lineHeight:1.65 }}>{s.bio}</p>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {COPY.step3.stats.map((s) => (
                    <div key={s.number} className="text-center rounded-xl border py-3"
                      style={{ background:"#0d1117", borderColor:"#1e2535" }}>
                      <p style={{ color:"#14C9B8", fontFamily:"var(--font-barlow)", fontWeight:900, fontSize:"1.4rem" }}>{s.number}</p>
                      <p style={{ color:"#9aa3b2", fontSize:"15px", marginTop:"4px" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── 4: FECHA / URGENCIA ────────────────────────────────── */}
            {step === 4 && (
              <div>
                <Headline>
                  {COPY.step4.headlineLine1} <span style={{ color:"#14C9B8" }}>{COPY.step4.headlineLine2}</span>
                </Headline>

                <div className="rounded-xl border mb-3"
                  style={{ background:"rgba(20,201,184,0.05)", borderColor:"rgba(20,201,184,0.22)", padding:"14px 16px" }}>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 rounded-xl flex flex-col items-center justify-center"
                      style={{ width:"48px", height:"48px", background:"rgba(20,201,184,0.12)", border:"1px solid rgba(20,201,184,0.25)" }}>
                      <p style={{ color:"#14C9B8", fontSize:"10px", fontWeight:700, lineHeight:1, textTransform:"uppercase" }}>JUE</p>
                      <p style={{ color:"#fff", fontFamily:"var(--font-barlow)", fontWeight:900, fontSize:"1.1rem", lineHeight:1, marginTop:"2px" }}>8PM</p>
                    </div>
                    <div>
                      <p style={{ color:"#fff", fontWeight:700, fontSize:"0.9375rem" }}>{eventDate.formatted}</p>
                      <p style={{ color:"#9aa3b2", fontSize:"15px", marginTop:"4px" }}>{COPY.step4.eventTime}</p>
                    </div>
                  </div>
                </div>

                <p style={{ color:"#9aa3b2", fontSize:"0.9375rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"10px" }}>
                  {COPY.step4.howItWorksLabel}
                </p>

                <Card>
                  <div className="space-y-3">
                    {COPY.step4.rows.map((r) => (
                      <Row key={r.icon} icon={r.icon}>{r.text}</Row>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* ── 5: FORM ────────────────────────────────────────────── */}
            {step === 5 && (
              <div>
                <Headline>
                  {COPY.step5.headlineLine1} <span style={{ color:"#14C9B8" }}>{COPY.step5.headlineLine2}</span>
                </Headline>

                <p style={{ color:"#cdd5e0", fontSize:"1.0625rem", lineHeight:1.65, marginBottom:"16px" }}>
                  {COPY.step5.body}
                </p>

                <form id="seed-form" onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <div>
                    <label className="block font-semibold uppercase mb-2"
                      style={{ color:"#cdd5e0", fontSize:"1rem", letterSpacing:"0.03em" }}>
                      {COPY.step5.form.nameLabel}<span style={{color:"#14C9B8"}}> *</span>
                    </label>
                    <input type="text" required placeholder={COPY.step5.form.namePlaceholder} inputMode="text"
                      value={form.nombre} onChange={(e) => setForm((p) => ({ ...p, nombre:e.target.value }))}
                      className="w-full rounded-xl transition-all duration-200 focus:outline-none"
                      style={{ background:"#0d1117", border:"1px solid #1e2535", color:"#fff", padding:"14px 16px", fontSize:"16px", letterSpacing:"0.01em" }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#14C9B8")}
                      onBlur={(e)  => (e.currentTarget.style.borderColor = "#1e2535")}/>
                  </div>

                  <div>
                    <label className="block font-semibold uppercase mb-2"
                      style={{ color:"#cdd5e0", fontSize:"1rem", letterSpacing:"0.03em" }}>
                      {COPY.step5.form.phoneLabel}<span style={{color:"#14C9B8"}}> *</span>
                    </label>
                    <PhoneInput
                      dialCode={form.dialCode} phone={form.phone}
                      onDialChange={(d) => setForm((p) => ({ ...p, dialCode:d }))}
                      onPhoneChange={(v) => setForm((p) => ({ ...p, phone:v }))}/>
                    <p style={{ color:"#9aa3b2", fontSize:"0.875rem", marginTop:"6px" }}>
                      Te enviamos el link del evento por aquí
                    </p>
                  </div>

                  <div>
                    <label className="block font-semibold uppercase mb-2"
                      style={{ color:"#cdd5e0", fontSize:"1rem", letterSpacing:"0.03em" }}>
                      {COPY.step5.form.emailLabel}<span style={{color:"#14C9B8"}}> *</span>
                    </label>
                    <input type="email" required placeholder={COPY.step5.form.emailPlaceholder}
                      value={form.email} onChange={(e) => setForm((p) => ({ ...p, email:e.target.value }))}
                      className="w-full rounded-xl transition-all duration-200 focus:outline-none"
                      style={{ background:"#0d1117", border:"1px solid #1e2535", color:"#fff", padding:"14px 16px", fontSize:"16px", letterSpacing:"0.01em" }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#14C9B8")}
                      onBlur={(e)  => (e.currentTarget.style.borderColor = "#1e2535")}/>
                  </div>
                </form>
              </div>
            )}

            {/* ── 6: GRACIAS ─────────────────────────────────────────── */}
            {step === 6 && (
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="flex items-center justify-center rounded-full border-2"
                    style={{ width:"56px", height:"56px", borderColor:"#14C9B8", background:"rgba(20,201,184,0.07)" }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#14C9B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                </div>

                <p style={{ color:"#14C9B8", fontSize:"0.9375rem", fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:"10px" }}>
                  {COPY.step6.badge}
                </p>
                <Headline>
                  {COPY.step6.headlineLine1}{" "}
                  <span style={{ color:"#14C9B8" }}>
                    {form.nombre.trim().split(" ")[0] || "amigo"}
                  </span>
                </Headline>

                <p style={{ color:"#cdd5e0", fontSize:"1.0625rem", lineHeight:1.65, marginBottom:"16px" }}>
                  {COPY.step6.body}
                </p>

                <Card>
                  <p style={{ color:"#14C9B8", fontSize:"0.9rem", fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:"10px" }}>
                    {COPY.step6.detailsLabel}
                  </p>
                  <div className="space-y-3">
                    <Row icon={COPY.step6.rows[0].icon}>{eventDate.formatted} {COPY.step6.rows[0].text}</Row>
                    {COPY.step6.rows.slice(1).map((r) => (
                      <Row key={r.icon} icon={r.icon}>{r.text}</Row>
                    ))}
                  </div>
                </Card>
              </div>
            )}

          </div>
        </div>
        </div>
      </div>

      {/* ── STICKY FOOTER ─────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 relative z-10 px-5 md:px-16 pt-2 pb-3"
        style={{ background:"rgba(6,8,15,0.9)", backdropFilter:"blur(8px)" }}>
        <div style={{ maxWidth:"900px", margin:"0 auto" }}>

          {step >= 0 && step <= 4 && (
            <div className="flex flex-col gap-2">
              <button onClick={() => goToStep(5, true)}
                className="w-full rounded-xl active:scale-[0.97] animate-cta-pulse"
                style={{ background:"linear-gradient(135deg, #FF8C00 0%, #FFD600 100%)",
                  color:"#fff", padding:"17px 24px",
                  fontSize:"1.2rem", fontFamily:"var(--font-poppins)", fontWeight:900,
                  letterSpacing:"0.05em", lineHeight:1.2, cursor:"pointer", border:"none",
                  textShadow:"0 2px 6px rgba(0,0,0,0.45)" }}>
                REGISTRARME AHORA →
              </button>
              <div style={{ maxHeight: showArrows ? "2rem" : "0", overflow:"hidden",
                opacity: showArrows ? 1 : 0, transition:"max-height 0.6s ease, opacity 0.5s ease" }}>
                <p className="text-center" style={{ color:"#7a8299", fontSize:"0.85rem", letterSpacing:"0.05em" }}>
                  Paso {step + 1} de 5
                </p>
              </div>
            </div>
          )}


          {step === 5 && (
            <>
              <TealBtn type="submit" form="seed-form" disabled={submitting}>
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin-slow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.2"/>
                      <path d="M12 2a10 10 0 0 1 10 10"/>
                    </svg>
                    {COPY.step5.ctaLoading}
                  </span>
                ) : COPY.step5.cta}
              </TealBtn>
              <p className="text-center mt-2" style={{ color:"#7a8299", fontSize:"13px" }}>
                {COPY.step5.disclaimer}
              </p>
            </>
          )}

          {step === 6 && (
            <button
              className="w-full font-bold rounded-xl transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2.5"
              style={{ background:"#25D366", color:"#fff", padding:"18px 24px", fontSize:"1.0625rem" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1ebe5a")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#25D366")}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Unirme al grupo de WhatsApp
            </button>
          )}

        </div>
      </div>

    </div>
  );
}
