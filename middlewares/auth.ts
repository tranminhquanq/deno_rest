import type { Context, Next } from "@oak/oak";
import { STATUS_TEXT } from "@oak/oak";
import { STATUS_CODE } from "@oak/common/status";
import jwt from "../shared/helpers/jwt.ts";
import type { permissions } from "../config/rbac.ts";
import { API_ERROR, isRenderableError } from "../shared/errors/index.ts";
import type { ApplicationState, UserAuthJwtPayload } from "../types/index.ts";

type Action =
  `${keyof typeof permissions}:${(typeof permissions)[keyof typeof permissions][
    number
  ]}`;

export const authenticate = async (ctx: Context, next: Next) => {
  const token = ctx.request.headers
    .get("Authorization")
    ?.replace("Bearer ", "")
    ?.trim();

  if (!token) throw API_ERROR.InvalidToken();

  try {
    const payload = await jwt.verifyToken<UserAuthJwtPayload>(token);
    if (payload.exp && jwt.isExpired(payload.exp)) {
      throw API_ERROR.TokenExpired();
    }

    ctx.state.user = { role: payload.role };
    return next();
  } catch (e) {
    if (isRenderableError(e)) throw e;
    throw API_ERROR.Unauthorized(STATUS_CODE.Unauthorized);
  }
};

function getRolePermissions(_role: string): Promise<string[]> {
  try {
    return Promise.resolve(["read", "write"]);
  } catch (e) {
    console.error(e);
    return Promise.resolve([]);
  }
}

function hasPermission(role: string, action: Action) {
  return getRolePermissions(role).then((permissions) =>
    permissions.includes(action)
  );
}

export const authorize = (action: Action) => {
  return async (ctx: Context<ApplicationState>, next: Next) => {
    const userRole = ctx.state.user.role;

    const hasAccess = await hasPermission(userRole, action);
    if (hasAccess) return next();

    throw API_ERROR.Unauthorized(
      STATUS_CODE.Forbidden,
      STATUS_TEXT[STATUS_CODE.Forbidden],
    );
  };
};
