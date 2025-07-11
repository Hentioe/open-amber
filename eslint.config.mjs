// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config({
  files: ["src/**/*.ts", "src/**/*.js", "src/**/*.tsx", "src/**/*.jsx", "tests/**/*.ts", "env.d.ts", "build.ts"],
  extends: [
    eslint.configs.recommended,
    tseslint.configs.recommended,
  ],
});
