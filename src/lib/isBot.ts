const BOT_PATTERNS = /bot|crawl|spider|slurp|facebookexternalhit|vercel|preview|lighthouse|pingdom|uptimerobot|datadog|headless|puppeteer|playwright|selenium|wget|curl|python-requests|go-http|java\/|okhttp/i;

export function isBot(userAgent: string): boolean {
  if (!userAgent) return true; // sin UA → tratar como bot
  return BOT_PATTERNS.test(userAgent);
}
