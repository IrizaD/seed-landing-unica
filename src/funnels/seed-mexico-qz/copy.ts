// ─────────────────────────────────────────────────────────────────────────────
// CONTENIDO DEL EMBUDO: seed-mexico-copia
// Modifica aquí para personalizar este funnel.
// ─────────────────────────────────────────────────────────────────────────────

export const COPY = {

  // ── HEADER ────────────────────────────────────────────────────────────────
  header: {
    ctaLabel: "Registrarme ahora",
    backLabel: "Atrás",
  },

  // ── STEP 0: HOOK ──────────────────────────────────────────────────────────
  step0: {
    headlineLine1: "Aprende a vender",
    headlineLine2: "por internet",           // se muestra en teal e itálica
    body: "Transmisión en vivo con Jorge Serratos y Manuel de León para llevar tu negocio a internet — aunque no sepas nada de tecnología.",
    imageAlt: "Jorge Serratos y Manuel de León",
    cta: "VER CÓMO →",
  },

  // ── STEP 1: EL PROBLEMA ───────────────────────────────────────────────────
  step1: {
    headlineLine1: "Esto es lo que",
    headlineLine2: "frena tu negocio",
    rows: [
      { icon: "📍", text: "Tu mercado se limita a quien te puede ver o escuchar en persona" },
      { icon: "⏳", text: "Si tú no estás, no hay venta. El negocio se detiene cuando no estás" },
      { icon: "📉", text: "Negocios como el tuyo están creciendo en internet todos los días mientras tú nisiquiera has iniciado" },
      { icon: "🔍", text: "Hay demasiada información, ninguna ruta clara y el tiempo se va sin avanzar" },
    ],
    calloutBold: "La diferencia no es la tecnología.",
    calloutBody: " Es tener el método correcto y a alguien que te lo enseñe.",
    cta: "QUIERO ESE MAPA →",
  },

  // ── STEP 2: LO QUE VAN A APRENDER ────────────────────────────────────────
  step2: {
    headlineLine1: "Lo que cambia",
    headlineLine2: "después del seminario",
    rows: [
      { icon: "📱", label: "Redes sociales:", text: " convierte tu perfil en una fuente constante de clientes" },
      { icon: "🎯", label: "Publicidad:",     text: " aprende a invertir en anuncios que se pagan solos" },
      { icon: "🤖", label: "IA:",             text: " las herramientas que hacen crecer tu negocio — y cómo aplicarlas" },
      { icon: "🌐", label: "Escala:",         text: " vende sin que el negocio dependa de que tú estés presente" },
      { icon: "🤝", label: "Networking:",     text: " el círculo correcto de personas acelera años de aprendizaje" },
    ],
    cta: "¿QUIÉNES LO ENSEÑAN? →",
  },

  // ── STEP 3: CREDIBILIDAD ──────────────────────────────────────────────────
  step3: {
    headlineLine1: "Aprende de quienes",
    headlineLine2: "ya lo lograron",      // se muestra en teal
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
      { number: "+18 Millones",  label: "de seguidores en redes" },
    ],
    cta: "VER CUÁNDO ES →",
  },

  // ── STEP 4: FECHA / URGENCIA ──────────────────────────────────────────────
  step4: {
    headlineLine1: "Todavía",
    headlineLine2: "llegas a tiempo",        // se muestra en teal
    eventTime: "8:00 PM hora México · En vivo · Gratis",
    howItWorksLabel: "Cómo funciona",
    rows: [
      { icon: "✅", text: "Gratis. Sin costos al final ni sorpresas.", boldWord: "Gratis" },
      { icon: "💻", text: "En línea, desde tu computadora o teléfono" },
      { icon: "⚡", text: "En vivo con Jorge y Manuel — les puedes preguntar directamente" },
      { icon: "🎯", text: "Los lugares se asignan por orden de llegada" },
    ],
    cta: "RESERVAR MI LUGAR →",
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
    headlineLine1: "Bienvenido al seminario,",  // se añade el nombre del usuario al final
    body: "Ya tienes tu lugar. Revisa tu correo y WhatsApp — te mandamos los detalles en los próximos minutos. Si no llega, revisa spam.",
    detailsLabel: "Detalles del evento",
    rows: [
      { icon: "📅", text: "· 8:00 PM hora México" },   // la fecha se añade dinámicamente antes del texto
      { icon: "💻", text: "Seminario en vivo · 100% online" },
      { icon: "🎯", text: "Con Jorge Serratos y Manuel de León" },
    ],
  },

};
