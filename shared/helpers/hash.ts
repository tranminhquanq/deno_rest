import { compareSync, genSaltSync, hashSync } from "bcrypt";

export default {
  encrypt(plain: string): string {
    const salt = genSaltSync(8);
    return hashSync(plain, salt);
  },
  compare(plain: string, hash: string): boolean {
    return compareSync(plain, hash);
  },
};
