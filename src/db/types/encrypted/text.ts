import { customType } from "drizzle-orm/sqlite-core";
import { decrypt, encrypt } from ".";

export default customType<{ data: string; driverData: Buffer }>({
  dataType() {
    return "blob";
  },

  toDriver(plainText: string) {
    return encrypt(plainText);
  },

  fromDriver(packed: Buffer) {
    return decrypt(packed);
  },
});
