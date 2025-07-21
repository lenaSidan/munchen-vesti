import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/ru") ||
    pathname.startsWith("/de") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const langHeader = request.headers.get("accept-language") || "";
  const lang = langHeader.slice(0, 2);
  const redirectLocale = lang === "ru" ? "ru" : "de";

  const url = request.nextUrl.clone();
  url.pathname = `/${redirectLocale}${pathname}`;

  return NextResponse.redirect(url);
}