import { jwtVerify, SignJWT, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE_NAME = "polar-swirl-admin";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

type SessionPayload = JWTPayload & {
  userId: string;
  email: string;
  name: string;
};

function getSessionSecret() {
  return new TextEncoder().encode(
    process.env.SESSION_SECRET ?? "development-session-secret-change-me",
  );
}

export async function createSession(payload: Omit<SessionPayload, keyof JWTPayload>) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSessionSecret());

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(Date.now() + SESSION_DURATION_MS),
  });
}

export async function clearSession() {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify<SessionPayload>(token, getSessionSecret());

    return {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
    };
  } catch {
    return null;
  }
}

export async function requireAdminSession() {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}
