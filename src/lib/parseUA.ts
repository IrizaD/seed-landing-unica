export interface ParsedUA {
  tipo:        "📱 Mobile" | "🖥️ Desktop" | "📟 Tablet";
  os:          string;
  browser:     string;
  dispositivo: string; // resumen legible
}

export function parseUA(ua: string): ParsedUA {
  if (!ua) return { tipo:"🖥️ Desktop", os:"Desconocido", browser:"Desconocido", dispositivo:"Desconocido" };

  // ── Tipo ──────────────────────────────────────────────
  const isTablet = /iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua));
  const isMobile = !isTablet && /Mobile|Android|iPhone|iPod|Windows Phone|BlackBerry|IEMobile/i.test(ua);
  const tipo = isTablet ? "📟 Tablet" : isMobile ? "📱 Mobile" : "🖥️ Desktop";

  // ── OS ────────────────────────────────────────────────
  let os = "Otro";
  if (/iPhone|iPod/.test(ua)) {
    const v = ua.match(/OS (\d+[_\d]*)/);
    os = `iOS ${v ? v[1].replace(/_/g, ".") : ""}`.trim();
  } else if (/iPad/.test(ua)) {
    const v = ua.match(/OS (\d+[_\d]*)/);
    os = `iPadOS ${v ? v[1].replace(/_/g, ".") : ""}`.trim();
  } else if (/Android/.test(ua)) {
    const v = ua.match(/Android (\d+\.?\d*)/);
    os = `Android ${v ? v[1] : ""}`.trim();
  } else if (/Windows NT 10/.test(ua))  os = "Windows 10/11";
  else if (/Windows NT 6\.3/.test(ua))  os = "Windows 8.1";
  else if (/Windows NT 6\.1/.test(ua))  os = "Windows 7";
  else if (/Windows/.test(ua))          os = "Windows";
  else if (/Mac OS X/.test(ua))         os = "macOS";
  else if (/CrOS/.test(ua))             os = "ChromeOS";
  else if (/Linux/.test(ua))            os = "Linux";

  // ── Browser ───────────────────────────────────────────
  let browser = "Otro";
  if (/Edg\//.test(ua))                        browser = "Edge";
  else if (/OPR\/|Opera/.test(ua))             browser = "Opera";
  else if (/SamsungBrowser/.test(ua))          browser = "Samsung Internet";
  else if (/UCBrowser/.test(ua))               browser = "UC Browser";
  else if (/YaBrowser/.test(ua))               browser = "Yandex";
  else if (/Firefox\//.test(ua))               browser = "Firefox";
  else if (/Chrome\//.test(ua))                browser = "Chrome";
  else if (/Safari\//.test(ua))                browser = "Safari";

  // ── Resumen legible ───────────────────────────────────
  const dispositivo = `${tipo} · ${os} · ${browser}`;

  return { tipo, os, browser, dispositivo };
}

// Agrupa un array por una función clave y cuenta ocurrencias
export function groupCount<T>(arr: T[], key: (item: T) => string): { label: string; count: number }[] {
  const map: Record<string, number> = {};
  arr.forEach((item) => {
    const k = key(item) || "Desconocido";
    map[k] = (map[k] ?? 0) + 1;
  });
  return Object.entries(map)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}
