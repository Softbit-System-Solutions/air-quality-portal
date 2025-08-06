import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "script" } },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], languageOptions: { globals: globals.browser } },
  { ignores: ['**/node_modules/**', '**/.next/**', '**/dist/**', '**/components/**', '**/tailwind.config.ts/**', '**/src/ui**'] },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  // Add this last block to disable the rule globally:
  {
    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },
]);
