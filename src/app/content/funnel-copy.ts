// ─────────────────────────────────────────────────────────────────────────────
// CONTENIDO DEL EMBUDO — edita aquí y se refleja automáticamente en el funnel
// ─────────────────────────────────────────────────────────────────────────────

export const COPY = {

  // ── HEADER ────────────────────────────────────────────────────────────────
  header: {
    ctaLabel: "Registrarme ahora",
    backLabel: "Atrás",
  },

  // ── STEP 0: HOOK — promesa (After del BAB) ────────────────────────────────
  step0: {
    headlineLine1: "Aprende a vender",
    headlineLine2: "por internet",           // se muestra en teal e itálica
    body: "Jorge Serratos y Manuel de León te enseñan cómo hacerlo con redes sociales, publicidad e IA — en un seminario gratuito y en vivo.",
    imageAlt: "Jorge Serratos y Manuel de León",
    cta: "QUIERO VER CÓMO →",
  },

  // ── STEP 1: EL PROBLEMA — dolor (Before del BAB) ──────────────────────────
  step1: {
    headlineLine1: "El problema",
    headlineLine2: "no es el esfuerzo, el problema es",
    rows: [
      { icon: "📍", text: "Solo vendes a quien ya te conoce" },
      { icon: "⏳", text: "El día que no trabajas, no entra dinero" },
      { icon: "📉", text: "Tu competencia ya vende en redes mientras tú todavía buscas cómo empezar" },
      { icon: "😰", text: "Lo intentaste solo y no funcionó como esperabas" },
    ],
    calloutBold: "No es falta de esfuerzo.",
    calloutBody: " Es falta del método correcto.",
    cta: "VER LA SOLUCIÓN →",
  },

  // ── STEP 2: LO QUE VAN A APRENDER — puente (Bridge del BAB) ───────────────
  step2: {
    headlineLine1: "Lo que vas a aprender",
    headlineLine2: "en el seminario",
    rows: [
      { icon: "📱", label: "Redes sociales:", text: " publica contenido que vende, sin necesitar miles de seguidores" },
      { icon: "🎯", label: "Publicidad:",     text: " genera anuncios que traigan a clientes reales, no solo likes" },
      { icon: "🤖", label: "IA:",             text: " herramientas que te ahorran horas de trabajo desde hoy" },
      { icon: "🌐", label: "Escala:",         text: " llega a clientes en cualquier ciudad sin moverte de donde estás" },
      { icon: "🤝", label: "Networking:",     text: " conéctate con emprendedores que van en la misma dirección" },
    ],
    cta: "¿QUIÉNES LO IMPARTEN? →",
  },

  // ── STEP 3: CREDIBILIDAD — autoridad (refuerza el Bridge) ─────────────────
  step3: {
    headlineLine1: "Los que ya lo hicieron",
    headlineLine2: "te enseñan cómo",        // se muestra en teal
    speakers: [
      {
        initials: "JS",
        name: "Jorge Serratos",
        title: "Conferencista · Autor Bestseller",
        bio: "Empresario, Fundador del movimiento Sinergético y del podcast #1 de negocios en México según Spotify. Ayudando a más de 100K emprendedores en México y EE.UU. a transformar su negocio.",
      },
      {
        initials: "ML",
        name: "Manuel de León",
        title: "Empresario & Conferencista",
        bio: "Experto en ventas y marketing digital. Tomó negocios tradicionales y los llevó a vender en línea. En el seminario te explica cómo lo hizo, sin rodeos.",
      },
    ],
    stats: [
      { number: "+100K", label: "personas impactadas" },
      { number: "Podcast #1",    label: "de negocios en México" },
      { number: "100%",  label: "en vivo y gratis" },
    ],
    cta: "VER CUÁNDO ES →",
  },

  // ── STEP 4: FECHA / URGENCIA — acción ─────────────────────────────────────
  step4: {
    headlineLine1: "Tu lugar todavía",
    headlineLine2: "está disponible",        // se muestra en teal
    eventTime: "8:00 PM hora México · En vivo · Gratis",
    howItWorksLabel: "Cómo funciona",
    rows: [
      { icon: "✅", text: "Gratis. Sin costos ocultos ni sorpresas.", boldWord: "Gratis" },
      { icon: "💻", text: "100% en línea, desde donde estés" },
      { icon: "⚡", text: "En vivo — pregúntale directamente a Jorge y Manuel" },
      { icon: "🎯", text: "Los lugares se asignan por orden de llegada" },
    ],
    cta: "QUIERO MI LUGAR →",
  },

  // ── STEP 5: FORMULARIO — conversión ───────────────────────────────────────
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
    cta: "RESERVAR MI LUGAR GRATIS →",
    ctaLoading: "RESERVANDO...",
    disclaimer: "Sin spam. Solo información relevante del evento.",
  },

  // ── STEP 6: GRACIAS — cierre emocional ────────────────────────────────────
  step6: {
    badge: "¡Ya estás dentro!",
    headlineLine1: "Tu lugar está reservado,",  // se añade el nombre del usuario al final
    body: "Revisa tu correo y WhatsApp — te enviamos la confirmación en los próximos minutos. Si no llega, revisa tu carpeta de spam.",
    detailsLabel: "Detalles del evento",
    rows: [
      { icon: "📅", text: "· 8:00 PM hora México" },   // la fecha se añade dinámicamente antes del texto
      { icon: "💻", text: "Seminario en vivo · 100% online" },
      { icon: "🎯", text: "Con Jorge Serratos y Manuel de León" },
    ],
  },

};
