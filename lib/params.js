"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.params = void 0;

/**
 * Copyright (c) 2020-present Kriasoft | MIT License (https://git.io/JUgVL)
 */

/**
 * The list of supported image transformation options including parsing and
 * validation logic.
 */
var params = {
  width: {
    key: "w",
    parse: function parse(value) {
      return parseInt(value, 10);
    },
    validate: function validate(value) {
      return !isNaN(value) && value >= 16 && value <= 3840;
    }
  },
  height: {
    key: "h",
    parse: function parse(value) {
      return parseInt(value, 10);
    },
    validate: function validate(value) {
      return !isNaN(value) && value >= 16 && value <= 2160;
    }
  },
  crop: {
    key: "c",
    parse: function parse(value) {
      return value;
    },
    validate: function validate(value) {
      return ["crop", "fill"].includes(value);
    }
  },
  x: {
    key: "x",
    parse: function parse(value) {
      return parseInt(value, 10);
    },
    validate: function validate(value) {
      return !isNaN(value);
    }
  },
  y: {
    key: "y",
    parse: function parse(value) {
      return parseInt(value, 10);
    },
    validate: function validate(value) {
      return !isNaN(value);
    }
  }
};
exports.params = params;
//# sourceMappingURL=params.js.map