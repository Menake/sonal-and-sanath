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

    const session = request.cookies.get("session");

    console.log(session);
    console.log(request.nextUrl);

    if (request.nextUrl.pathname.match(/\/(admin).*/)) {
        return NextResponse.next();
    }

    if (!pathname.match(/\/(login).*/) && !session) {
        const loginUrl = new URL("/login", request.url);

        return NextResponse.redirect(loginUrl, 307);
    }

    if (request.nextUrl.pathname.match(/\/(login).*/) && session) {
        const url = new URL("/", request.url);
        console.log(`Session found, redirecting to: ${url.toString()}`);

        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}