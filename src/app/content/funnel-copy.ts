// ─────────────────────────────────────────────────────────────────────────────
// CONTENIDO DEL EMBUDO — edita aquí y se refleja automáticamente en el funnel
// ─────────────────────────────────────────────────────────────────────────────

export const COPY = {

  // ── HEADER ────────────────────────────────────────────────────────────────
  header: {
    ctaLabel: "Registrarme ahora",
    backLabel: "Atrás",
  },

  // ── STEP 0: HOOK ──────────────────────────────────────────────────────────
  step0: {
    headlineLine1: "Vende en digital",
    headlineLine2: "sin ser experto en tecnología",           // se muestra en teal e itálica
    body: "Redes sociales, publicidad e IA para escalar tu negocio — aunque nunca hayas vendido por internet.",
    imageAlt: "Jorge Serratos y Manuel de León",
    cta: "QUIERO SABER MÁS →",
  },

  // ── STEP 1: EL PROBLEMA ───────────────────────────────────────────────────
  step1: {
    headlineLine1: "Tu negocio podría",
    headlineLine2: "quedarse obsoleto",
    rows: [
      { icon: "📍", text: "Tu negocio solo llega donde tú llegas" },
      { icon: "⏳", text: "El negocio para cuando tú paras" },
      { icon: "📉", text: "Tu competencia ya vende en redes mientras tú buscas por dónde empezar" },
      { icon: "😰", text: "Sin el método correcto, el mundo digital se siente imposible" },
    ],
    calloutBold: "No necesitas saber de tecnología.",
    calloutBody: " Solo necesitas el método correcto.",
    cta: "VER LA SOLUCIÓN →",
  },

  // ── STEP 2: LO QUE VAN A APRENDER ────────────────────────────────────────
  step2: {
    headlineLine1: "Lo que vas a aprender",
    headlineLine2: "en el seminario",
    rows: [
      { icon: "📱", label: "Redes sociales:", text: " publica para que la gente quiera comprarte, sin necesitar miles de seguidores" },
      { icon: "🎯", label: "Publicidad:",     text: " invierte sin tirar dinero y crea anuncios que sí venden" },
      { icon: "🤖", label: "IA:",             text: " herramientas que puedes usar esta semana para ahorrarte horas" },
      { icon: "🌐", label: "Escala:",         text: " vende fuera de tu ciudad sin moverte de donde estás" },
      { icon: "🤝", label: "Networking:",     text: " entra a una red de empresarios que van en la misma dirección" },
    ],
    cta: "¿QUIÉNES LO IMPARTEN? →",
  },

  // ── STEP 3: CREDIBILIDAD ──────────────────────────────────────────────────
  step3: {
    headlineLine1: "Aprende de quienes",
    headlineLine2: "ya lo lograron",         // se muestra en teal
    speakers: [
      {
        initials: "JS",
        name: "Jorge Serratos",
        title: "Conferencista · Autor Bestseller",
        bio: "Fundador de Sinergéticos y del podcast #1 de negocios en México según Spotify. Más de 100K emprendedores en México y EE.UU. han transformado su negocio con su método.",
      },
      {
        initials: "ML",
        name: "Manuel de León",
        title: "Empresario & Conferencista",
        bio: "Tomó negocios tradicionales y los llevó a vender en línea. En el seminario te explica cómo lo hizo, sin rodeos.",
      },
    ],
    stats: [
      { number: "+100K", label: "personas impactadas" },
      { number: "#1",    label: "podcast de negocios" },
      { number: "100%",  label: "en vivo y gratis" },
    ],
    cta: "VER FECHA Y HORA →",
  },

  // ── STEP 4: FECHA / URGENCIA ──────────────────────────────────────────────
  step4: {
    headlineLine1: "Tu lugar todavía",
    headlineLine2: "está disponible",        // se muestra en teal
    eventTime: "8:00 PM hora México · En vivo · Gratis",
    howItWorksLabel: "Cómo funciona",
    rows: [
      { icon: "✅", text: "Gratis. Sin costos ocultos ni sorpresas.", boldWord: "Gratis" },
      { icon: "💻", text: "100% online, desde cualquier dispositivo" },
      { icon: "⚡", text: "En vivo — puedes preguntar directamente a Jorge y Manuel" },
      { icon: "🎯", text: "Los lugares se asignan por orden de registro" },
    ],
    cta: "QUIERO MI LUGAR GRATIS →",
  },

  // ── STEP 5: FORMULARIO ────────────────────────────────────────────────────
  step5: {
    headlineLine1: "Un paso más y",
    headlineLine2: "tu lugar queda reservado",
    body: "Llena tus datos y listo. Es gratis, sin compromisos.",
    form: {
      nameLabel: "Nombre completo",
      namePlaceholder: "Tu nombre completo",
      phoneLabel: "WhatsApp",
      emailLabel: "Correo electrónico",
      emailPlaceholder: "tu@correo.com",
    },
    cta: "¡RESERVAR MI LUGAR GRATIS →",
    ctaLoading: "RESERVANDO...",
    disclaimer: "Sin spam. Solo información relevante del evento.",
  },

  // ── STEP 6: GRACIAS ───────────────────────────────────────────────────────
  step6: {
    badge: "¡Registro confirmado!",
    headlineLine1: "Tu lugar está reservado,",  // se añade el nombre del usuario al final
    body: "Revisa tu correo y WhatsApp — te confirmamos en los próximos minutos. Si no llega, revisa tu carpeta de spam.",
    detailsLabel: "Detalles del evento",
    rows: [
      { icon: "📅", text: "· 8:00 PM hora México" },   // la fecha se añade dinámicamente antes del texto
      { icon: "💻", text: "Seminario en vivo · 100% online" },
      { icon: "🎯", text: "Con Jorge Serratos y Manuel de León" },
    ],
  },

};
