/**
 * ESLint configuration
 *
 * @see https://eslint.org/docs/user-guide/configuring
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 *
 * @type {import("eslint").Linter.Config}
 */

module.exports = {
  root: true,

  env: {
    es6: true,
    node: true,
  },

  extends: ["eslint:recommended", "prettier"],

  parserOptions: {
    ecmaVersion: 2020,
  },

  overrides: [
    {
      files: ["*.ts"],
      parser: "@typescript-eslint/parser",
      extends: [
        "plugin:@typescript-eslint/recommended",
        "prettier",
      ],
      plugins: ["@typescript-eslint"],
      parserOptions: {
        sourceType: "module",
        warnOnUnsupportedTypeScriptVersion: true,
      },
    },
    {
      files: ["*.test.ts"],
      env: {
        jest: true,
      },
    },
  ],

  ignorePatterns: [
    "/.cache",
    "/.git",
    "/.yarn",
    "/**/__snapshots__",
    "/**/node_modules",
    "/coverage",
    "/lib",
  ],
};
