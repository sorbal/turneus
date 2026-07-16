import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    message: "Delogare reusita.",
  });

  response.cookies.set("turneus_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    domain: getSessionCookieDomain(),
    maxAge: 0,
  });

  return response;
}

function getSessionCookieDomain() {
  return process.env.NODE_ENV === "production" ? ".turneus.ro" : undefined;
}
