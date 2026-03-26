import { NextRequest, NextResponse } from "next/server";
import { DOMAIN_MAP } from "@/config/domains";

export function proxy(req: NextRequest) {
  const host = req.headers.get("host")?.split(":")[0] ?? "";
  const mappedSlug = DOMAIN_MAP[host];

  // Dominio propio → rewrite transparente al funnel correspondiente
  if (mappedSlug) {
    const url = req.nextUrl.clone();
    const suffix = url.pathname === "/" ? "" : url.pathname;
    url.pathname = `/${mappedSlug}${suffix}`;
    return NextResponse.rewrite(url);
  }

  const { pathname } = req.nextUrl;

  // Raíz → redirigir al funnel por defecto
  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/seed-mexico";
    return NextResponse.redirect(url);
  }

  // Dashboard: verificar autenticación
  if (!pathname.startsWith("/dashboard")) return NextResponse.next();
  if (pathname === "/dashboard/login") return NextResponse.next();

  const token = req.cookies.get("dash_auth")?.value;
  if (token === process.env.DASHBOARD_PASSWORD) return NextResponse.next();

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/dashboard/login";
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt).*)",
  ],
};
