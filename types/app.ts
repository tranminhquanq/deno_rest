import type { UserAuthJwtPayload } from "./jwt.ts";

export type ApplicationState = {
  user: UserAuthJwtPayload;
};
