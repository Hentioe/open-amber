import { customType } from "drizzle-orm/sqlite-core";
import { decrypt, encrypt } from ".";

export default customType<{ data: string; driverData: string }>({
  dataType() {
    return "text";
  },

  toDriver(plainText: string) {
    return encrypt(plainText);
  },

  fromDriver(packed: string) {
    return decrypt(packed);
  },
});
