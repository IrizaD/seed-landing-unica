"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

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
  return {
    formatted: `Jueves ${t.getDate()} de ${MONTHS_ES[t.getMonth()]}, ${t.getFullYear()}`,
  };
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
    <div className="flex gap-2" ref={ref}>
      <div className="relative flex-shrink-0">
        <button type="button" onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 rounded-xl transition-all duration-200 focus:outline-none"
          style={{ background:"#0d1117", border:`1px solid ${open?"#14C9B8":"#1e2535"}`, padding:"12px 12px", color:"#fff", minWidth:"90px" }}>
          <span className="text-base leading-none">{selected.flag}</span>
          <span className="text-sm font-semibold">{selected.dial}</span>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none"
            style={{ color:"#7a8299", marginLeft:"2px", transform:open?"rotate(180deg)":"rotate(0deg)", transition:"transform 0.2s" }}>
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {open && (
          <div className="absolute left-0 top-full mt-1 rounded-xl overflow-hidden z-50"
            style={{ background:"#0d1117", border:"1px solid #1e2535", width:"220px", boxShadow:"0 16px 40px rgba(0,0,0,0.6)" }}>
            <div style={{ padding:"8px", borderBottom:"1px solid #1e2535" }}>
              <input autoFocus type="text" placeholder="Buscar país..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full focus:outline-none"
                style={{ background:"#111827", border:"1px solid #1e2535", color:"#fff", borderRadius:"8px", padding:"8px 10px", fontSize:"16px" }}/>
            </div>
            <div style={{ maxHeight:"200px", overflowY:"auto" }}>
              {filtered.map((c) => (
                <button key={c.code+c.dial} type="button"
                  onClick={() => { onDialChange(c.dial); setOpen(false); setSearch(""); }}
                  className="w-full flex items-center gap-2.5 text-left text-sm transition-colors"
                  style={{ padding:"10px 14px", color:c.dial===dialCode?"#14C9B8":"#ccc", background:c.dial===dialCode?"rgba(20,201,184,0.08)":"transparent" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(20,201,184,0.06)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = c.dial===dialCode?"rgba(20,201,184,0.08)":"transparent")}>
                  <span className="text-base">{c.flag}</span>
                  <span className="flex-1 truncate">{c.name}</span>
                  <span style={{ color:"#3d4a5c", fontSize:"0.75rem" }}>{c.dial}</span>
                </button>
              ))}
              {filtered.length === 0 && <p className="text-center text-sm py-4" style={{ color:"#3d4a5c" }}>Sin resultados</p>}
            </div>
          </div>
        )}
      </div>
      <input type="tel" required placeholder="55 1234 5678" value={phone}
        onChange={(e) => onPhoneChange(e.target.value)}
        className="flex-1 rounded-xl transition-all duration-200 focus:outline-none"
        style={{ background:"#0d1117", border:"1px solid #1e2535", color:"#fff", padding:"12px 16px", fontSize:"16px" }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "#14C9B8")}
        onBlur={(e)  => (e.currentTarget.style.borderColor = "#1e2535")}/>
    </div>
  );
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function DateChip({ date }: { date: EventDate }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full"
      style={{ background:"rgba(20,201,184,0.08)", border:"1px solid rgba(20,201,184,0.22)", padding:"7px 14px" }}>
      <span className="relative flex h-2 w-2 flex-shrink-0">
        <span className="animate-ping-teal absolute inline-flex h-full w-full rounded-full" style={{ background:"#14C9B8", opacity:0.6 }}/>
        <span className="relative inline-flex rounded-full h-2 w-2" style={{ background:"#14C9B8" }}/>
      </span>
      <span className="text-xs font-semibold" style={{ color:"#14C9B8" }}>{date.formatted}</span>
      <span className="text-xs" style={{ color:"#3d4a5c" }}>· 8:00 PM hora México</span>
    </div>
  );
}

function TealBtn({ children, onClick, type = "button", form, disabled }: {
  children: React.ReactNode; onClick?: () => void; type?: "button" | "submit"; form?: string; disabled?: boolean;
}) {
  return (
    <button type={type} form={form} onClick={onClick} disabled={disabled}
      className="w-full font-black rounded-xl transition-all duration-200 active:scale-[0.98]"
      style={{ background: disabled ? "#0a8a80" : "#14C9B8", color:"#06080f", padding:"15px 24px",
        fontSize:"0.95rem", fontFamily:"var(--font-barlow)", fontWeight:800,
        cursor: disabled ? "not-allowed" : "pointer" }}
      onMouseEnter={(e) => { if (!disabled) (e.currentTarget as HTMLElement).style.background = "#1FE5D2"; }}
      onMouseLeave={(e) => { if (!disabled) (e.currentTarget as HTMLElement).style.background = "#14C9B8"; }}>
      {children}
    </button>
  );
}

function Row({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 text-sm leading-snug" style={{ color:"#7a8299" }}>
      <span className="flex-shrink-0 text-base mt-0.5">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

function Headline({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="uppercase leading-tight mb-3"
      style={{ fontFamily:"var(--font-barlow)", fontWeight:900,
        fontSize:"clamp(1.55rem, 3vw, 2.1rem)", color:"#fff", letterSpacing:"-0.01em" }}>
      {children}
    </h2>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border" style={{ background:"#0d1117", borderColor:"#1e2535", padding:"14px 16px" }}>
      {children}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function SeedFunnel() {
  const [step, setStep]       = useState(0);
  const [visible, setVisible] = useState(true);
  const [form, setForm]       = useState<FormData>({ nombre:"", phone:"", dialCode:"+52", email:"" });
  const [submitting, setSubmitting] = useState(false);
  const [eventDate]           = useState<EventDate>(getNextThursday);
  const TOTAL                 = 6; // steps 1–5 tracked

  useEffect(() => {
    setForm((p) => ({ ...p, dialCode: detectDialCode() }));
  }, []);

  function goToStep(n: number) {
    setVisible(false);
    setTimeout(() => { setStep(n); setVisible(true); }, 250);
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setSubmitting(true);
    // TODO: connect to webhook / CRM
    await new Promise((r) => setTimeout(r, 1400));
    goToStep(6);
  }

  const showBar = step >= 1 && step <= 5;

  return (
    <div style={{ height:"100dvh" }} className="flex flex-col overflow-hidden relative"
      aria-label="Registro al seminario">

      {/* Background image */}
      <div className="pointer-events-none fixed inset-0" aria-hidden="true"
        style={{ backgroundImage:"url('/bg-glow.webp')", backgroundSize:"cover", backgroundPosition:"center", opacity:0.6 }}/>
      <div className="pointer-events-none fixed inset-0" aria-hidden="true"
        style={{ background:"radial-gradient(ellipse 80% 60% at 10% 80%, rgba(14,80,180,0.10) 0%, transparent 60%)" }}/>

      {/* ── STICKY HEADER ─────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 relative z-10 px-5 md:px-12 pt-5 pb-3"
        style={{ background:"rgba(6,8,15,0.85)", backdropFilter:"blur(8px)" }}>
        <div style={{ maxWidth:"700px", margin:"0 auto" }}>
          <Image
            src="/logo-seed.webp"
            alt="Seminario de Emprendedor a Empresario Digital"
            width={220}
            height={53}
            style={{ objectFit:"contain", objectPosition:"left" }}
            priority
          />
          {showBar && (
            <div className="flex items-center justify-between mt-3">
              <button
                type="button"
                onClick={() => goToStep(step - 1)}
                className="flex items-center gap-1.5 rounded-lg transition-all duration-200 focus:outline-none text-xs font-semibold"
                style={{ color:"#7a8299", background:"none", border:"none", padding:0 }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#14C9B8")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#7a8299")}
                aria-label="Paso anterior"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Atrás
              </button>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: TOTAL }).map((_, i) => (
                  <div key={i} className="rounded-full transition-all duration-500"
                    style={{ height:"4px", width: i < step ? "20px" : "4px",
                      background: i < step ? "#14C9B8" : "#1e2535" }}/>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── SCROLLABLE CONTENT ────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="px-5 md:px-12 pt-4 pb-2" style={{ maxWidth:"700px", margin:"0 auto" }}>

          {/* Animated content */}
          <div style={{ opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(14px)", transition:"opacity 0.25s ease, transform 0.25s ease" }}>

            {/* ── 0: HOOK ────────────────────────────────────────────── */}
            {step === 0 && (
              <div>
                <h1 className="uppercase leading-tight mb-3"
                  style={{ fontFamily:"var(--font-barlow)", fontWeight:900,
                    fontSize:"clamp(2rem, 5vw, 3rem)", color:"#fff", letterSpacing:"-0.02em" }}>
                  Aprende a vender
                  <br/>
                  <span style={{ color:"#14C9B8", fontStyle:"italic" }}>por internet</span>
                </h1>

                <div className="mb-4" style={{ width:"40px", height:"3px", background:"#14C9B8", borderRadius:"2px" }}/>

                <p className="leading-relaxed mb-5" style={{ fontSize:"0.95rem", color:"#7a8299" }}>
                  El Seminario de Emprendedor a Empresario Digital te muestra cómo usar redes sociales, publicidad e IA para vender más allá de tu círculo, sin necesidad de saber de tecnología.
                </p>

                <div className="mb-5">
                  <DateChip date={eventDate}/>
                </div>

                <div className="flex justify-center">
                  <Image
                    src="/manujorge.webp"
                    alt="Jorge Serratos y Manuel de León"
                    width={520}
                    height={520}
                    className="w-full"
                    style={{ objectFit:"contain", objectPosition:"center bottom", maxHeight:"42vh" }}
                  />
                </div>
              </div>
            )}

            {/* ── 1: EL PROBLEMA ─────────────────────────────────────── */}
            {step === 1 && (
              <div>
                <Headline>
                  Tu negocio podría<br/>quedarse obsoleto
                </Headline>

                <p className="leading-relaxed mb-4" style={{ fontSize:"0.95rem", color:"#7a8299" }}>
                  Tener un buen producto ya no alcanza: si no apareces en redes, no existes para la mitad de tus clientes potenciales.
                </p>

                <Card>
                  <div className="space-y-2.5">
                    <Row icon="📍">Solo vendes a quien ya te conoce, un radio de acción chico sin importar qué tan bueno seas</Row>
                    <Row icon="⏳">Cada venta depende de que <strong style={{ color:"#cdd5e0" }}>tú</strong> estés ahí, y el negocio solo avanza cuando tú lo empujas</Row>
                    <Row icon="📉">Tu competencia crece en redes y tú lo ves sin saber <strong style={{ color:"#cdd5e0" }}>por dónde entrar</strong></Row>
                    <Row icon="😰">Lo intentaste y aprendiste algo, pero sin una guía clara crecer en digital se siente lento</Row>
                  </div>
                </Card>

                <div className="mt-3 rounded-xl border"
                  style={{ background:"rgba(20,201,184,0.06)", borderColor:"rgba(20,201,184,0.18)", padding:"11px 15px" }}>
                  <p className="text-sm leading-relaxed" style={{ color:"#cdd5e0" }}>
                    <strong style={{ color:"#14C9B8" }}>Tiene solución</strong> y no necesitas saber de tecnología para aplicarla
                  </p>
                </div>
              </div>
            )}

            {/* ── 2: LO QUE APRENDERÁN ───────────────────────────────── */}
            {step === 2 && (
              <div>
                <Headline>
                  Lo que vas a aprender<br/>en el seminario
                </Headline>

                <p className="leading-relaxed mb-4" style={{ fontSize:"0.95rem", color:"#7a8299" }}>
                  Una sesión en vivo donde vas directo a lo que funciona para vender por internet, sin importar en qué punto está tu negocio.
                </p>

                <Card>
                  <div className="space-y-2.5">
                    <Row icon="📱"><strong style={{ color:"#cdd5e0" }}>Redes sociales:</strong> cómo publicar para que la gente llegue a ti queriendo comprar, no solo a ver</Row>
                    <Row icon="🎯"><strong style={{ color:"#cdd5e0" }}>Publicidad:</strong> cómo invertir sin tirar el dinero y crear anuncios que sí venden</Row>
                    <Row icon="🤖"><strong style={{ color:"#cdd5e0" }}>IA:</strong> herramientas concretas que puedes usar desde mañana en tu negocio</Row>
                    <Row icon="🌐"><strong style={{ color:"#cdd5e0" }}>Escala geográfica:</strong> cómo vender fuera de tu ciudad o tu país sin moverte de donde estás</Row>
                    <Row icon="🤝"><strong style={{ color:"#cdd5e0" }}>Networking:</strong> conexiones con otros empresarios donde 1+1 termina valiendo 3</Row>
                  </div>
                </Card>
              </div>
            )}

            {/* ── 3: CREDIBILIDAD ────────────────────────────────────── */}
            {step === 3 && (
              <div>
                <Headline>
                  Aprende de quienes<br/><span style={{ color:"#14C9B8" }}>ya lo lograron</span>
                </Headline>

                <p className="leading-relaxed mb-4" style={{ fontSize:"0.95rem", color:"#7a8299" }}>
                  No es teoría lo que vas a escuchar, es lo que ellos aplicaron para construir sus propios negocios en el mundo digital
                </p>

                <div className="space-y-2.5 mb-4">
                  <Card>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-shrink-0 rounded-full flex items-center justify-center font-black text-sm"
                        style={{ width:"40px", height:"40px", background:"linear-gradient(135deg,#14C9B8,#0a8a80)", color:"#06080f" }}>
                        JS
                      </div>
                      <div>
                        <p className="font-bold text-sm" style={{ color:"#fff" }}>Jorge Serratos</p>
                        <p className="text-xs" style={{ color:"#3d4a5c" }}>Conferencista · Autor Bestseller</p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color:"#7a8299" }}>
                      Fundador del movimiento Sinergéticos y del podcast #1 de negocios en México según Spotify, con más de 100,000 personas que han pasado por sus programas y conferencias en México y EE.UU.
                    </p>
                  </Card>

                  <Card>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-shrink-0 rounded-full flex items-center justify-center font-black text-sm"
                        style={{ width:"40px", height:"40px", background:"linear-gradient(135deg,#1e3a5f,#2d6aad)", color:"#7ab3d4" }}>
                        ML
                      </div>
                      <div>
                        <p className="font-bold text-sm" style={{ color:"#fff" }}>Manuel de León</p>
                        <p className="text-xs" style={{ color:"#3d4a5c" }}>Empresario & Conferencista</p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color:"#7a8299" }}>
                      Referente en la industria digital y de negocios, de los que cuando comparten no solo te inspiran sino que te hacen ver que lo que quieres construir es más alcanzable de lo que crees
                    </p>
                  </Card>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { n:"+100K", l:"personas impactadas" },
                    { n:"#1",   l:"podcast de negocios" },
                    { n:"100%", l:"en vivo y gratis" },
                  ].map((s) => (
                    <div key={s.n} className="text-center rounded-xl border py-2.5"
                      style={{ background:"#0d1117", borderColor:"#1e2535" }}>
                      <p className="font-black text-lg" style={{ color:"#14C9B8", fontFamily:"var(--font-barlow)" }}>{s.n}</p>
                      <p className="text-xs mt-0.5" style={{ color:"#3d4a5c" }}>{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── 4: FECHA / URGENCIA ────────────────────────────────── */}
            {step === 4 && (
              <div>
                <Headline>
                  Tu lugar todavía<br/><span style={{ color:"#14C9B8" }}>está disponible</span>
                </Headline>

                <div className="rounded-xl border mb-4"
                  style={{ background:"rgba(20,201,184,0.05)", borderColor:"rgba(20,201,184,0.22)", padding:"14px 16px" }}>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 rounded-xl flex flex-col items-center justify-center"
                      style={{ width:"48px", height:"48px", background:"rgba(20,201,184,0.12)", border:"1px solid rgba(20,201,184,0.25)" }}>
                      <p className="text-xs font-bold uppercase" style={{ color:"#14C9B8", lineHeight:1 }}>JUE</p>
                      <p className="font-black text-xl leading-none mt-0.5" style={{ color:"#fff", fontFamily:"var(--font-barlow)" }}>8PM</p>
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color:"#fff" }}>{eventDate.formatted}</p>
                      <p className="text-xs mt-0.5" style={{ color:"#3d4a5c" }}>8:00 PM hora México · En vivo · Gratis</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs font-semibold tracking-wider uppercase mb-2" style={{ color:"#3d4a5c" }}>
                  Cómo funciona
                </p>

                <Card>
                  <div className="space-y-2.5">
                    <Row icon="✅">Es <strong style={{ color:"#cdd5e0" }}>gratis</strong>, sin costo ni sorpresas al final</Row>
                    <Row icon="💻">100% online, entras desde donde estés</Row>
                    <Row icon="⚡">En vivo, puedes preguntar en el momento</Row>
                    <Row icon="🎯">Los cupos son limitados y se llenan por orden de llegada</Row>
                  </div>
                </Card>
              </div>
            )}

            {/* ── 5: FORM ────────────────────────────────────────────── */}
            {step === 5 && (
              <div>
                <Headline>
                  Tu lugar está<br/>casi asegurado
                </Headline>

                <div className="flex items-center gap-3 rounded-xl border mb-4"
                  style={{ background:"rgba(20,201,184,0.05)", borderColor:"rgba(20,201,184,0.2)", padding:"11px 14px" }}>
                  <span className="text-xl">📅</span>
                  <div>
                    <p className="text-sm font-bold" style={{ color:"#fff" }}>{eventDate.formatted}</p>
                    <p className="text-xs" style={{ color:"#3d4a5c" }}>8:00 PM hora México · En vivo · Gratis</p>
                  </div>
                </div>

                <form id="seed-form" onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold tracking-wider uppercase mb-1.5" style={{ color:"#3d4a5c" }}>
                      Nombre completo
                    </label>
                    <input type="text" required placeholder="Tu nombre completo"
                      value={form.nombre} onChange={(e) => setForm((p) => ({ ...p, nombre:e.target.value }))}
                      className="w-full rounded-xl transition-all duration-200 focus:outline-none"
                      style={{ background:"#0d1117", border:"1px solid #1e2535", color:"#fff", padding:"12px 16px", fontSize:"16px" }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#14C9B8")}
                      onBlur={(e)  => (e.currentTarget.style.borderColor = "#1e2535")}/>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold tracking-wider uppercase mb-1.5" style={{ color:"#3d4a5c" }}>
                      WhatsApp
                    </label>
                    <PhoneInput
                      dialCode={form.dialCode} phone={form.phone}
                      onDialChange={(d) => setForm((p) => ({ ...p, dialCode:d }))}
                      onPhoneChange={(v) => setForm((p) => ({ ...p, phone:v }))}/>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold tracking-wider uppercase mb-1.5" style={{ color:"#3d4a5c" }}>
                      Correo electrónico
                    </label>
                    <input type="email" required placeholder="tu@correo.com"
                      value={form.email} onChange={(e) => setForm((p) => ({ ...p, email:e.target.value }))}
                      className="w-full rounded-xl transition-all duration-200 focus:outline-none"
                      style={{ background:"#0d1117", border:"1px solid #1e2535", color:"#fff", padding:"12px 16px", fontSize:"16px" }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#14C9B8")}
                      onBlur={(e)  => (e.currentTarget.style.borderColor = "#1e2535")}/>
                  </div>
                </form>
              </div>
            )}

            {/* ── 6: GRACIAS ─────────────────────────────────────────── */}
            {step === 6 && (
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center rounded-full border-2"
                    style={{ width:"64px", height:"64px", borderColor:"#14C9B8", background:"rgba(20,201,184,0.07)" }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#14C9B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                </div>

                <p className="text-xs font-semibold tracking-[0.22em] uppercase mb-2" style={{ color:"#14C9B8" }}>
                  ¡Registro confirmado!
                </p>
                <Headline>
                  Tu lugar está reservado,{" "}
                  <span style={{ color:"#14C9B8" }}>
                    {form.nombre.trim().split(" ")[0] || "amigo"}
                  </span>
                </Headline>

                <p className="text-sm leading-relaxed mb-4" style={{ color:"#7a8299" }}>
                  Te enviamos un correo de confirmación, así que revisa también tu carpeta de spam por si acaso.
                </p>

                <Card>
                  <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2.5" style={{ color:"#14C9B8" }}>
                    Detalles del evento
                  </p>
                  <div className="space-y-2.5">
                    <Row icon="📅">{eventDate.formatted} · 8:00 PM hora México</Row>
                    <Row icon="💻">Seminario en vivo · 100% online</Row>
                    <Row icon="🎯">Con Jorge Serratos y expertos invitados</Row>
                  </div>
                </Card>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── STICKY FOOTER ─────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 relative z-10 px-5 md:px-12 pt-3 pb-6"
        style={{ background:"rgba(6,8,15,0.9)", backdropFilter:"blur(8px)" }}>
        <div style={{ maxWidth:"700px", margin:"0 auto" }}>

          {/* Steps 0–4: next-step button + skip to form */}
          {step === 0 && <TealBtn onClick={() => goToStep(1)}>QUIERO SABER MÁS →</TealBtn>}
          {step === 1 && <TealBtn onClick={() => goToStep(2)}>DIME CÓMO →</TealBtn>}
          {step === 2 && <TealBtn onClick={() => goToStep(3)}>¿QUIÉNES LO IMPARTEN? →</TealBtn>}
          {step === 3 && <TealBtn onClick={() => goToStep(4)}>VER FECHA Y HORA →</TealBtn>}
          {step === 4 && <TealBtn onClick={() => goToStep(5)}>RESERVAR MI LUGAR AHORA →</TealBtn>}

          {step <= 4 && (
            <button type="button" onClick={() => goToStep(5)}
              className="w-full text-center text-xs mt-2 transition-colors duration-200"
              style={{ background:"none", border:"none", color:"#3d4a5c", cursor:"pointer", padding:"4px 0" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#14C9B8")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#3d4a5c")}>
              Ya quiero unirme →
            </button>
          )}

          {/* Step 5: external submit button tied to form */}
          {step === 5 && (
            <>
              <TealBtn type="submit" form="seed-form" disabled={submitting}>
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin-slow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.2"/>
                      <path d="M12 2a10 10 0 0 1 10 10"/>
                    </svg>
                    RESERVANDO...
                  </span>
                ) : "¡RESERVAR MI LUGAR GRATIS →"}
              </TealBtn>
              <p className="text-center text-xs mt-2" style={{ color:"#3d4a5c" }}>
                Sin spam. Solo información relevante del evento.
              </p>
            </>
          )}

          {/* Step 6: WhatsApp CTA */}
          {step === 6 && (
            <button
              className="w-full font-bold rounded-xl transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2.5"
              style={{ background:"#25D366", color:"#fff", padding:"15px 24px", fontSize:"0.9rem" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1ebe5a")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#25D366")}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
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
