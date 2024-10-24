import type { Context, Next } from "@oak/oak";

export const cors = async (ctx: Context, next: Next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE",
  );
  ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  await next();
};

export const transformResponse = async (ctx: Context, next: Next) => {
  await next();
  const { status, body } = ctx.response;
  if (status >= 200 && status < 300) {
    switch (typeof body) {
      case "string":
      case "number":
      case "bigint":
      case "boolean":
      case "symbol":
      case "function":
        ctx.response.body = body;
        break;
      case "undefined":
      case "object":
        ctx.response.body = {
          data: body,
        };
        break;
    }
  } else {
    ctx.response.body = { error: body };
  }
};

export const cacheControl = (
  options: {
    maxAge?: number; // Maximum age in seconds
    sMaxAge?: number; // Maximum age for shared caches
    public?: boolean; // Whether the cache is public
    private?: boolean; // Whether the cache is private
    noCache?: boolean; // Whether to use no-cache directive
    noStore?: boolean; // Whether to use no-store directive
    mustRevalidate?: boolean; // Whether to use must-revalidate directive
    proxyRevalidate?: boolean; // Whether to use proxy-revalidate directive
    staleWhileRevalidate?: number; // Stale-while-revalidate directive
    staleIfError?: number; // Stale-if-error directive
  } = {},
) => {
  return async (ctx: Context, next: Next) => {
    await next();
    const directives = [];

    if (options.public) directives.push("public");
    if (options.private) directives.push("private");
    if (options.noCache) directives.push("no-cache");
    if (options.noStore) directives.push("no-store");
    if (options.mustRevalidate) directives.push("must-revalidate");
    if (options.proxyRevalidate) directives.push("proxy-revalidate");

    if (options.staleWhileRevalidate) {
      directives.push(`stale-while-revalidate=${options.staleWhileRevalidate}`);
    }
    if (options.staleIfError) {
      directives.push(`stale-if-error=${options.staleIfError}`);
    }

    if (options.maxAge !== undefined) {
      directives.push(`max-age=${options.maxAge}`);
    }
    if (options.sMaxAge !== undefined) {
      directives.push(`s-maxage=${options.sMaxAge}`);
    }

    const cacheControlHeader = directives.join(", ");
    ctx.response.headers.set("Cache-Control", cacheControlHeader);
  };
};
