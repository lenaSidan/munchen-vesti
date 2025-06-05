import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Пропустить, если уже есть локаль
  if (pathname.startsWith("/ru") || pathname.startsWith("/de")) {
    return NextResponse.next();
  }

  // Пропустить, если это статические файлы или API
  if (/\.(ico|png|jpg|jpeg|svg|webp|txt|xml|js|css)$/.test(pathname) || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const langHeader = request.headers.get("accept-language");
  const browserLang = langHeader?.slice(0, 2) ?? "ru";

  const supported = ["ru", "de"];
  const redirectLang = supported.includes(browserLang) ? browserLang : "ru";

  return NextResponse.redirect(new URL(`/${redirectLang}${pathname}`, request.url));
}

export const config = {
  matcher: ["/((?!_next|favicon|site|apple|robots.txt|manifest|api).*)"],
};
