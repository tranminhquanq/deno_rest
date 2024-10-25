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
  opts: {
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

    if (opts.public) directives.push("public");
    if (opts.private) directives.push("private");
    if (opts.noCache) directives.push("no-cache");
    if (opts.noStore) directives.push("no-store");
    if (opts.mustRevalidate) directives.push("must-revalidate");
    if (opts.proxyRevalidate) directives.push("proxy-revalidate");

    if (opts.staleWhileRevalidate) {
      directives.push(`stale-while-revalidate=${opts.staleWhileRevalidate}`);
    }
    if (opts.staleIfError) {
      directives.push(`stale-if-error=${opts.staleIfError}`);
    }

    if (opts.maxAge !== undefined) {
      directives.push(`max-age=${opts.maxAge}`);
    }
    if (opts.sMaxAge !== undefined) {
      directives.push(`s-maxage=${opts.sMaxAge}`);
    }

    const cacheControlHeader = directives.join(", ");
    if (cacheControlHeader) {
      ctx.response.headers.set("Cache-Control", cacheControlHeader);
    }
  };
};
