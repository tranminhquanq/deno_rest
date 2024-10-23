import type { Context, Next } from "@oak/oak";

export const authenticate = (ctx: Context, next: Next) => {
  console.log("Authenticating user...");
  const isAuthorized = Math.random() > 0.2; // 80% chance of being authorized
  if (isAuthorized) {
    ctx.state.user = { role: "user" };
    return next();
  }
  ctx.response.status = 401;
  ctx.response.body = "Unauthorized";
};

function getRolePermissions(role: string): Promise<string[]> {
  console.log("Fetching role permissions...", role);
  return Promise.resolve(["read", "write"]);
}

async function hasPermission(role: string, action: string) {
  const rolePermissions = await getRolePermissions(role);
  return rolePermissions && rolePermissions.includes(action);
}

export const authorize = (action: string) => {
  return async (ctx: Context, next: Next) => {
    const userRole = ctx.state.user.role;

    const hasAccess = await hasPermission(userRole, action);
    if (hasAccess) {
      return next();
    }

    ctx.response.status = 403;
    ctx.response.body = "Forbidden";
  };
};
