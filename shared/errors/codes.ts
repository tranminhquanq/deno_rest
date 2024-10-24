import { STATUS_CODE } from "@oak/common/status";
import { ApiError } from "./renderable.ts";

export enum ErrorCode {
  TokenExpired = "token_expired",
  InvalidToken = "invalid_token",
}

export const API_ERROR = {
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
      message: message || "Unauthorized",
    }),
};
