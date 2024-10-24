import type { ErrorCode } from "./codes.ts";

interface RenderableError {
  render(): {
    httpCode: number;
    error: {
      code: ErrorCode | number;
      message: string;
      details?: unknown;
    };
  };
}

export type ApiErrorOptions = {
  httpCode: number;
  code: ErrorCode | number;
  message: string;
  error?: unknown; // original error
};

export class ApiError extends Error implements RenderableError {
  httpCode: number;
  code: ErrorCode | number;
  error?: unknown;

  constructor(options: ApiErrorOptions) {
    super(options.message);
    this.name = this.constructor.name;

    this.httpCode = options.httpCode;
    this.error = options.error;
    this.code = options.code;
    this.message = options.message;

    Object.setPrototypeOf(this, ApiError.prototype);
  }

  render() {
    return {
      httpCode: this.httpCode,
      error: {
        code: this.code,
        message: this.message,
        details: this.error,
      },
    };
  }
}

export const isRenderableError = (error: unknown): error is RenderableError => {
  return !!error && typeof error === "object" && "render" in error;
};
