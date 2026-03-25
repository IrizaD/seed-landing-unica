import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/dashboard")) return NextResponse.next();

  // Excluir el login
  if (pathname === "/dashboard/login") return NextResponse.next();

  const token = req.cookies.get("dash_auth")?.value;
  if (token === process.env.DASHBOARD_PASSWORD) return NextResponse.next();

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/dashboard/login";
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
