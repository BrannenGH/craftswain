module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json"],
    ecmaVersion: 12,
    sourceType: "module",
  },
  ignorePatterns: ["out/", ".eslintrc.js"],
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],

  env: {
    browser: true,
    es2021: true,
  },
};
