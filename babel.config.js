/**
 * Babel configuration
 *
 * @see https://babeljs.io/docs/en/options
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 *
 * @param {import("@babel/core").ConfigAPI} api
 * @returns {import("@babel/core").TransformOptions}
 */

module.exports = function config(api) {
  return {
    presets: ["@babel/preset-env"],
    plugins: ["@babel/plugin-proposal-object-rest-spread"],
    ignore: api.env("test") ? [] : ["**/__tests__/**", "**/*.test.ts"],
    sourceMaps: api.env("production"),
    overrides: [
      {
        test: /\.ts$/,
        presets: [
          [
            "@babel/preset-typescript",
            {
              targets: { node: 12 },
            },
          ],
        ],
      },

      {
        test: "**/*.d.ts",
        presets: [["@babel/preset-env", { targets: { esmodules: true } }]],
      },
    ],
  };
};
