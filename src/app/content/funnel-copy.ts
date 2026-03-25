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
    headlineLine1: "Aprende a vender",
    headlineLine2: "por internet",           // se muestra en teal e itálica
    body: "Un seminario gratuito y en vivo con Jorge Serratos y Manuel de León para llevar tu negocio a donde tus clientes ya están — sin necesitar saber de tecnología.",
    imageAlt: "Jorge Serratos y Manuel de León",
    cta: "VER CÓMO →",
  },

  // ── STEP 1: EL PROBLEMA ───────────────────────────────────────────────────
  step1: {
    headlineLine1: "Esto es lo que",
    headlineLine2: "frena tu negocio",
    rows: [
      { icon: "📍", text: "Tu mercado se limita a quien te puede ver o escuchar en persona" },
      { icon: "⏳", text: "Cada peso que entra requiere que tú estés trabajando detrás" },
      { icon: "📉", text: "Hay negocios como el tuyo escalando en digital todos los días — sin que tú lo notes" },
      { icon: "🔍", text: "Hay demasiada información, ninguna ruta clara y el tiempo se va sin avanzar" },
    ],
    calloutBold: "La diferencia no es la tecnología.",
    calloutBody: " Es que alguien ya les mostró el mapa correcto.",
    cta: "QUIERO ESE MAPA →",
  },

  // ── STEP 2: LO QUE VAN A APRENDER ────────────────────────────────────────
  step2: {
    headlineLine1: "Lo que cambia",
    headlineLine2: "después del seminario",
    rows: [
      { icon: "📱", label: "Redes sociales:", text: " convierte tu perfil en una fuente constante de clientes" },
      { icon: "🎯", label: "Publicidad:",     text: " aprende a invertir en anuncios que se pagan solos" },
      { icon: "🤖", label: "IA:",             text: " las herramientas que más negocios están usando ahora mismo — y cómo aplicarlas" },
      { icon: "🌐", label: "Escala:",         text: " vende sin que el negocio dependa de que tú estés presente" },
      { icon: "🤝", label: "Networking:",     text: " el círculo correcto de personas acelera lo que años de trabajo solo no logran" },
    ],
    cta: "¿QUIÉNES LO ENSEÑAN? →",
  },

  // ── STEP 3: CREDIBILIDAD ──────────────────────────────────────────────────
  step3: {
    headlineLine1: "No teorías.",
    headlineLine2: "Experiencia real.",      // se muestra en teal
    speakers: [
      {
        initials: "JS",
        name: "Jorge Serratos",
        title: "Conferencista · Autor Bestseller",
        bio: "Creó el movimiento Sinergéticos y el podcast #1 de negocios en México según Spotify. Más de 100K emprendedores en México y EE.UU. ya aplicaron su método para cruzar al mundo digital.",
      },
      {
        initials: "ML",
        name: "Manuel de León",
        title: "Empresario & Conferencista",
        bio: "Tomó sus propios negocios del modelo tradicional al digital y documentó exactamente cómo lo hizo. En el seminario comparte ese proceso, paso a paso.",
      },
    ],
    stats: [
      { number: "+100K", label: "emprendedores impactados" },
      { number: "#1",    label: "podcast de negocios en México" },
      { number: "100%",  label: "en vivo y gratis" },
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
      { icon: "🎯", text: "Los lugares se asignan conforme se registran" },
    ],
    cta: "RESERVAR MI LUGAR →",
  },

  // ── STEP 5: FORMULARIO ────────────────────────────────────────────────────
  step5: {
    headlineLine1: "Tu lugar",
    headlineLine2: "a un paso",
    body: "Llena tus datos y tu lugar queda reservado. Es gratis.",
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

  // ── STEP 6: GRACIAS ───────────────────────────────────────────────────────
  step6: {
    badge: "¡Estás dentro!",
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
