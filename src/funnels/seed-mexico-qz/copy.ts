// ─────────────────────────────────────────────────────────────────────────────
// CONTENIDO DEL EMBUDO: seed-mexico-qz  (formato quiz)
// Steps 1 y 2 son preguntas con respuestas seleccionables.
// ─────────────────────────────────────────────────────────────────────────────

export const COPY = {

  // ── HEADER ────────────────────────────────────────────────────────────────
  header: {
    backLabel: "Atrás",
  },

  // ── STEP 0: HOOK ──────────────────────────────────────────────────────────
  step0: {
    headlineLine1: "Aprende a vender",
    headlineLine2: "por internet",
    body: "Transmisión en vivo con Jorge Serratos y Manuel de León para llevar tu negocio a internet — aunque no sepas nada de tecnología.",
    imageAlt: "Jorge Serratos y Manuel de León",
    cta: "EMPEZAR →",
  },

  // ── STEP 1: QUIZ — DOLOR ──────────────────────────────────────────────────
  step1: {
    question: "¿Cuál es el mayor obstáculo de tu negocio hoy?",
    subtitle: "Selecciona el que más te identifica",
    answers: [
      { icon: "📍", text: "Mis clientes solo son locales — no llego a más gente" },
      { icon: "⏳", text: "Si yo paro, el negocio para. No puedo escalar" },
      { icon: "📉", text: "La competencia está en internet y yo me estoy quedando atrás" },
      { icon: "🔍", text: "No sé por dónde empezar sin perder tiempo y dinero" },
    ],
  },

  // ── STEP 2: QUIZ — OBJETIVO ───────────────────────────────────────────────
  step2: {
    question: "¿Qué es lo que más quieres lograr?",
    subtitle: "Elige tu objetivo principal",
    answers: [
      { icon: "💰", text: "Generar más ventas sin que todo dependa de que yo esté" },
      { icon: "📱", text: "Conseguir clientes por internet de forma constante" },
      { icon: "🌐", text: "Llevar mi negocio del mundo físico al digital" },
      { icon: "🚀", text: "Crear un sistema que trabaje para mí aunque yo no esté" },
    ],
  },

  // ── STEP 3: CREDIBILIDAD ──────────────────────────────────────────────────
  step3: {
    headlineLine1: "Aprende de quienes",
    headlineLine2: "ya lo lograron",
    speakers: [
      {
        initials: "JS",
        photo: "/jorge.webp",
        name: "Jorge Serratos",
        title: "Conferencista · Autor Bestseller",
        bio: "Creador del movimiento Sinergético y el podcast #1 de negocios en México según Spotify. Más de 100K emprendedores en México y EE.UU. ya transformaron su negocio con su método.",
      },
      {
        initials: "ML",
        photo: "/manuel.webp",
        name: "Manuel de León",
        title: "Empresario & Conferencista",
        bio: "Llevó sus propios negocios del mundo físico al digital y documentó exactamente cómo lo hizo. En el seminario te comparte ese proceso, paso a paso.",
      },
    ],
    stats: [
      { number: "+100K", label: "negocios transformados" },
      { number: "#1",    label: "podcast de negocios en México" },
      { number: "+18 Millones", label: "de seguidores en redes" },
    ],
    question: "¿Con cuál de los dos te identificas más?",
    subtitle: "Selecciona para continuar",
    answers: [
      { icon: "🎤", text: "Con Jorge — quiero construir una marca y llegar a más gente" },
      { icon: "🏢", text: "Con Manuel — tengo un negocio físico y quiero digitalizarlo" },
    ],
  },

  // ── STEP 4: FECHA / URGENCIA ──────────────────────────────────────────────
  step4: {
    headlineLine1: "Todavía",
    headlineLine2: "llegas a tiempo",
    eventTime: "8:00 PM hora México · En vivo · Gratis",
    howItWorksLabel: "Cómo funciona",
    rows: [
      { icon: "✅", text: "Gratis. Sin costos al final ni sorpresas.", boldWord: "Gratis" },
      { icon: "💻", text: "En línea, desde tu computadora o teléfono" },
      { icon: "⚡", text: "En vivo con Jorge y Manuel — les puedes preguntar directamente" },
      { icon: "🎯", text: "Los lugares se asignan por orden de llegada" },
    ],
    question: "¿Listo para reservar tu lugar?",
    subtitle: "Es gratis — sin costos ni sorpresas",
    answers: [
      { icon: "🚀", text: "Sí, quiero asegurar mi lugar ahora" },
      { icon: "📋", text: "Sí, tengo dudas pero me apunto igual" },
    ],
  },

  // ── STEP 5: FORMULARIO ────────────────────────────────────────────────────
  step5: {
    headlineLine1: "Rellena tus datos",
    headlineLine2: "y reserva tu lugar gratis",
    form: {
      nameLabel: "Nombre completo",
      namePlaceholder: "Tu nombre completo",
      phoneLabel: "WhatsApp",
      emailLabel: "Correo electrónico",
      emailPlaceholder: "tu@correo.com",
    },
    cta: "TERMINAR REGISTRO →",
    ctaLoading: "RESERVANDO...",
  },

  // ── STEP 6: GRACIAS ───────────────────────────────────────────────────────
  step6: {
    badge: "¡Quedaste registrado!",
    headlineLine1: "Bienvenido al seminario,",
    body: "Ya tienes tu lugar. Revisa tu correo y WhatsApp — te mandamos los detalles en los próximos minutos. Si no llega, revisa spam.",
    detailsLabel: "Detalles del evento",
    rows: [
      { icon: "📅", text: "· 8:00 PM hora México" },
      { icon: "💻", text: "Seminario en vivo · 100% online" },
      { icon: "🎯", text: "Con Jorge Serratos y Manuel de León" },
    ],
  },

};
