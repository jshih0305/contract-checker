import { SignJWT, jwtVerify } from "jose";

// 這個檔案不依賴 next/headers，proxy.ts 和 session.ts 都會用到

export const SESSION_COOKIE_NAME = "session";
export const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60; // 7 天

export type SessionPayload = {
  userId: string;
};

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("缺少環境變數 SESSION_SECRET");
  }
  return new TextEncoder().encode(secret);
}

export async function encryptSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function decryptSession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify<SessionPayload>(token, getSecretKey(), {
      algorithms: ["HS256"],
    });
    return typeof payload.userId === "string" ? { userId: payload.userId } : null;
  } catch {
    // 簽章錯誤或已過期都視為未登入
    return null;
  }
}
