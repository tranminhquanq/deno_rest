import { STATUS_CODE, STATUS_TEXT } from "@oak/common/status";
import { ApiError } from "./renderable.ts";

export enum ErrorCode {
  TokenExpired = "token_expired",
  InvalidToken = "invalid_token",
  Aborted = "Aborted",
  AbortedTerminate = "AbortedTerminate",
}

export const APP_ERROR = {
  TokenExpired: (e?: unknown) =>
    new ApiError({
      httpCode: STATUS_CODE.Unauthorized,
      code: ErrorCode.TokenExpired,
      message: "Token expired",
      error: e,
    }),
  InvalidToken: (e?: unknown) =>
    new ApiError({
      httpCode: STATUS_CODE.Unauthorized,
      code: ErrorCode.InvalidToken,
      message: "Invalid token",
      error: e,
    }),
  Unauthorized: (httpCode?: number, message?: string) =>
    new ApiError({
      httpCode: httpCode || STATUS_CODE.Unauthorized,
      code: ErrorCode.InvalidToken,
      message: message || STATUS_TEXT[STATUS_CODE.Unauthorized],
    }),
  Aborted: (message?: string, e?: unknown) =>
    new ApiError({
      httpCode: STATUS_CODE.InternalServerError,
      code: ErrorCode.Aborted,
      message: message || "Aborted",
      error: e,
    }),
  AbortedTerminate: (message?: string, e?: unknown) =>
    new ApiError({
      httpCode: STATUS_CODE.InternalServerError,
      code: ErrorCode.AbortedTerminate,
      message: message || "AbortedTerminate",
      error: e,
    }),
} as const;
