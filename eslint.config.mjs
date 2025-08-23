import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next", "next/core-web-vitals"],
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-page-custom-font": "off",
      "react-hooks/exhaustive-deps": "off", // Tắt rule react-hooks/exhaustive-deps
      "@next/next/no-img-element": "off", // Tắt riêng rule <img> không dùng Next <Image>
    },
  }),
];

export default eslintConfig;
