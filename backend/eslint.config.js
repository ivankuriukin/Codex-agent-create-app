import js from "@eslint/js";
import tseslint from "typescript-eslint";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      "dist",
      "node_modules",
      "eslint.config.js",
      "__tests__",
      "scripts",
      "jest.config.cjs",
      "jest.setup.ts",
    ],
  },
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
];
