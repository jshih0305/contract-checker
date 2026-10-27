import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, decryptSession } from "@/lib/jwt";

// 只做快速的導向判斷；真正的權限檢查在頁面和 API 裡靠近資料的地方
// "/review" 同時涵蓋 "/reviews/[id]"
const PROTECTED_PREFIXES = ["/review", "/history"];
const AUTH_PAGES = ["/login", "/signup"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await decryptSession(request.cookies.get(SESSION_COOKIE_NAME)?.value);

  if (!session && PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session && AUTH_PAGES.includes(pathname)) {
    return NextResponse.redirect(new URL("/review", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/review", "/reviews/:path*", "/history", "/login", "/signup"],
};
