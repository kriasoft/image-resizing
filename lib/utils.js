"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noop = noop;
exports.handleError = handleError;

/**
 * Copyright (c) 2020-present Kriasoft | MIT License (https://git.io/JUgVL)
 */

/* eslint-disable-next-line @typescript-eslint/no-empty-function */
function noop() {}

function handleError(res, err) {
  console.error(err.stack);
  res.status(500);
  res.type("text/plain");
  res.send(err.message);
}
//# sourceMappingURL=utils.js.map