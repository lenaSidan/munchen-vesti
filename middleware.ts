import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Не трогаем уже локализованные маршруты, статику и API
  if (
    pathname.startsWith("/ru") ||
    pathname.startsWith("/de") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Определяем язык браузера
  const acceptLang = request.headers.get("accept-language") || "";
  const browserLang = acceptLang.split(",")[0].trim().slice(0, 2);
  const supportedLocales = ["ru", "de"];
  const redirectLocale = supportedLocales.includes(browserLang) ? browserLang : "ru";

  const url = request.nextUrl.clone();
  url.pathname = `/${redirectLocale}${pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|favicon|site|apple|robots.txt|manifest|api).*)"],
};
