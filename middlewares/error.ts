import type { Context, Next } from "@oak/oak";
import { STATUS_TEXT } from "@oak/oak";
import { STATUS_CODE } from "@oak/common/status";
import { isRenderableError } from "../shared/errors/index.ts";

export const onError = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (e) {
    if (isRenderableError(e)) {
      const { httpCode, error } = e.render();
      ctx.response.status = httpCode;
      ctx.response.body = error;
    } else {
      ctx.response.status = STATUS_CODE.InternalServerError;
      ctx.response.body = {
        code: STATUS_CODE.InternalServerError,
        message: STATUS_TEXT[STATUS_CODE.InternalServerError],
        details: e,
      };
    }
  }
};
