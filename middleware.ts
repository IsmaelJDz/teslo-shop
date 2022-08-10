/* eslint-disable @next/next/no-server-import-in-page */
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/checkout")) {
    const token = req.cookies.get("token");
    //TEST
    //OTHER COMMENT

    try {
      await jose.jwtVerify(
        token || "",
        new TextEncoder().encode(process.env.JWT_SECRET_SEED || "")
      );
      //If no error is thrown, the JWT is valid, you can even the payload if necessary
      return NextResponse.next();
    } catch (error) {
      console.error(`JWT Invalid or not signed in`, { error });
      const { protocol, host, pathname } = req.nextUrl;
      // here the instructor uses p instead of previousPath
      return NextResponse.redirect(
        `${protocol}//${host}/auth/login?previousPath=${pathname}`
      );
    }
  }
}
// Only the paths declared in here will run the middleware
export const config = {
  matcher: ["/checkout/:path*"],
};
