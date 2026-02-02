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
      "src/shared/api/graphql.ts",
      "src/shared/api/schema.graphql",
      "eslint.config.js",
      "jest.config.cjs",
      "postcss.config.cjs",
      "vite.config.ts",
      "jest.setup.ts",
    ],
  },
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
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
