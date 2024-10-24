import type { Context, Next } from "@oak/oak";
import { STATUS_TEXT } from "@oak/oak";
import { STATUS_CODE } from "@oak/common/status";
import jwt from "../shared/helpers/jwt.ts";
import type { permissions } from "../config/rbac.ts";
import type { ApplicationState, UserAuthJwtPayload } from "../types/index.ts";

type Action =
  `${keyof typeof permissions}:${(typeof permissions)[keyof typeof permissions][number]}`;

export const authenticate = async (ctx: Context, next: Next) => {
  const token = ctx.request.headers
    .get("Authorization")
    ?.replace("Bearer ", "")
    ?.trim();

  if (!token) {
    ctx.response.status = STATUS_CODE.Unauthorized;
    ctx.response.body = {
      message: STATUS_TEXT[STATUS_CODE.Unauthorized],
      code: STATUS_CODE.Unauthorized,
    };
    return ctx;
  }

  try {
    const payload = await jwt.verifyToken<UserAuthJwtPayload>(token);
    if (payload.exp && jwt.isExpired(payload.exp)) {
      ctx.response.status = STATUS_CODE.Unauthorized;
      ctx.response.body = { message: "Token expired", code: "token_expired" };
      return ctx;
    }
    ctx.state.user = { role: payload.role };
    return next();
  } catch (error) {
    console.error(error);
    ctx.response.status = STATUS_CODE.Unauthorized;
    ctx.response.body = {
      message: STATUS_TEXT[STATUS_CODE.Unauthorized],
      code: STATUS_CODE.Unauthorized,
    };
    return ctx;
  }
};

function getRolePermissions(_role: string): Promise<string[]> {
  return Promise.resolve(["read", "write"]);
}

async function hasPermission(role: string, action: Action) {
  const rolePermissions = await getRolePermissions(role);
  return rolePermissions && rolePermissions.includes(action);
}

export const authorize = (action: Action) => {
  return async (ctx: Context<ApplicationState>, next: Next) => {
    const userRole = ctx.state.user.role;

    const hasAccess = await hasPermission(userRole, action);
    if (hasAccess) {
      return next();
    }

    ctx.response.status = STATUS_CODE.Forbidden;
    ctx.response.body = STATUS_TEXT[STATUS_CODE.Forbidden];
  };
};
