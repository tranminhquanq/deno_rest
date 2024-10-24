import type { Payload } from "djwt";

export type UserAuthJwtPayload = {
  email: string;
  phone: string;
  role: string;
  sub: string;
  iss: string;
  user_metadata: {
    email: string;
    full_name: string;
    phone: string;
  };
};

export type JwtPayload<T> = Payload & T;
