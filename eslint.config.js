import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";
import js from "@eslint/js";

export default [
  // Base JavaScript recommended rules
  js.configs.recommended,

  // TypeScript rules
  ...tseslint.configs.recommended,

  // Astro recommended rules
  ...eslintPluginAstro.configs.recommended,

  {
    // Configuration for TypeScript files
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // TypeScript specific rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      // Use base prefer-const rule instead of TypeScript-specific one
      "prefer-const": "error",
    },
  },

  {
    // Configuration for Astro files
    files: ["**/*.astro"],
    rules: {
      // Astro specific rules
      "astro/no-set-html-directive": "error",
      "astro/no-conflict-set-directives": "error",
      "astro/no-unused-define-vars-in-style": "error",
      "astro/valid-compile": "error",
      "astro/no-deprecated-astro-canonicalurl": "error",
      "astro/no-deprecated-astro-resolve": "error",
      "astro/no-deprecated-getentrybyslug": "error",
    },
  },

  {
    // General configuration for all files
    files: ["**/*.js", "**/*.ts", "**/*.astro"],
    rules: {
      // General best practices
      "no-console": "warn",
      "no-debugger": "error",
      "prefer-const": "error",
      "no-var": "error",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
    },
  },

  {
    // Ignore patterns
    ignores: [
      "dist/**/*",
      ".astro/**/*",
      "node_modules/**/*",
      "*.config.js",
      "*.config.ts",
      "*.config.mjs",
    ],
  },
];
