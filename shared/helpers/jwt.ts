import * as crypto from "node:crypto";
import { create, verify } from "djwt";
import type { JwtPayload } from "../../types/index.ts";

const secret = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-256" },
  true,
  ["sign", "verify"],
);

const generateToken = <T>(payload: JwtPayload<T>) =>
  create({ alg: "HS256", typ: "JWT" }, payload, secret);

export default {
  verifyToken<T>(token: string): Promise<JwtPayload<T>> {
    return verify(token, secret);
  },
  isExpired(exp: number): boolean {
    const expInMilliseconds = exp * 1000;
    return Date.now() > expInMilliseconds;
  },
  generateRefreshToken<T>(_payload: JwtPayload<T>): string {
    return crypto.randomUUID();
  },
  generateAccessToken<T>(payload: JwtPayload<T>) {
    return generateToken(payload);
  },
};
