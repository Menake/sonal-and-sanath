// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (
        pathname.startsWith("/_next") || // exclude Next.js internals
        pathname.startsWith("/api") || //  exclude all API routes
        pathname.startsWith("/static") || // exclude static files
        PUBLIC_FILE.test(pathname) // exclude all files in the public folder
      )
        return NextResponse.next();
        // Assume a "Cookie:session={SESSION_OBJECT}" header to be present on the incoming request
        // Getting cookies from the request using the `RequestCookies` API

    const session = request.cookies.get("session")?.value;

    if (request.nextUrl.pathname.match(/\/(admin).*/)) {
        return NextResponse.next();
    }

    if (!pathname.match(/\/(login).*/) && !session) {
        const loginUrl = new URL("/login", request.url);

        return NextResponse.redirect(loginUrl, 307);
    }

    if (request.nextUrl.pathname.match(/\/(login).*/) && session) {
        const homeUrl = request.nextUrl.clone();
        homeUrl.pathname = "/";
        return NextResponse.redirect(homeUrl, 307);
    }

    return NextResponse.next();
}