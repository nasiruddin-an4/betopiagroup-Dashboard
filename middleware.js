import { NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/content", "/settings", "/ventures", "/corporate-offers"]; 

function isProtectedPath(pathname) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );
}

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Never block Next internals / static assets
  if (pathname.startsWith("/_next")) return NextResponse.next();

  // Let API + uploads proxy through with CORS
  if (pathname.startsWith("/api") || pathname.startsWith("/uploads")) {
    const response = NextResponse.next();
    
    // CORS Headers
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      return new NextResponse(null, { status: 200, headers: response.headers });
    }

    return response;
  }

  const token = req.cookies.get("token")?.value;
  const isAuthed = Boolean(token);

  // Root: route to appropriate landing page
  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = isAuthed ? "/dashboard" : "/login";
    return NextResponse.redirect(url);
  }

  // If already authed, keep user out of login
  if (pathname === "/login" && isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Protect dashboard areas
  if (isProtectedPath(pathname) && !isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
