export default {
  // Basic formatting options
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  quoteProps: "as-needed",
  trailingComma: "es5",
  bracketSpacing: true,
  arrowParens: "avoid",
  endOfLine: "lf",

  // Plugin configurations
  plugins: [
    "prettier-plugin-astro",
    "prettier-plugin-tailwindcss", // Should be last
  ],

  // Astro-specific overrides
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
    {
      files: ["*.ts", "*.tsx"],
      options: {
        parser: "typescript",
      },
    },
  ],
};
