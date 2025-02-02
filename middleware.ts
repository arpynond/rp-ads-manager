import { NextResponse } from "next/server"

export function middleware(req: Request) {
  const basicAuth = req.headers.get("authorization")

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1]
    const [user, pass] = Buffer.from(authValue, "base64").toString().split(":")

    if (user === process.env.BASIC_AUTH_USER && pass === process.env.BASIC_AUTH_PASS) {
      return NextResponse.next()
    }
  }

  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": "Basic realm='Protected'" },
  })
}

export const config = {
  matcher: "/:path*",
}

