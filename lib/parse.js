"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseUrlPath = parseUrlPath;

var _path = require("path");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function parseUrlPath(path, params) {
  var sourceFragments = [];
  var paramsFragments = [];
  var transforms = [];
  var stopParsing = false;
  path.split("/").forEach(function (fragment) {
    if (fragment === "") {
      sourceFragments.push(fragment);
      return;
    }

    if (fragment === "_") {
      stopParsing = true;
      return;
    }

    if (stopParsing) {
      sourceFragments.push(fragment);
      return;
    }

    var transform = {};
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */

    var keys = new Map(Object.entries(params).filter(function (x) {
      return x !== undefined;
    }).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          name = _ref2[0],
          x = _ref2[1];

      return [x.key, [name, x]];
    })); // Attempts to parse out parameters from the URL path fragment.
    // E.g. "w_80,h_16,c_fill" => ["w_80", "h_60", "c_fill"]

    fragment.split(",").some(function (x) {
      var _x$split = x.split("_"),
          _x$split2 = _slicedToArray(_x$split, 2),
          key = _x$split2[0],
          val = _x$split2[1];

      var p = val === undefined ? undefined : keys.get(key);

      if (p) {
        var _p = _slicedToArray(p, 2),
            name = _p[0],
            _param = _p[1];
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */


        var value = _param.parse(val);

        if (value !== undefined && _param.validate(val) !== false) {
          transform[name] = value;
          keys["delete"](key);
          return false;
        }
      }

      return true;
    });

    if (Object.keys(transform).length === 0) {
      sourceFragments.push(fragment);

      if (!stopParsing && transforms.length > 0) {
        stopParsing = true;
      }
    } else {
      paramsFragments.push(fragment);
      transforms.push(transform);
    }
  });
  var source = sourceFragments.join("/");
  var ext = (0, _path.extname)(source);
  var target = transforms.length > 0 ? source.substring(0, source.length - ext.length) + "__" + paramsFragments.join("__") + ext : undefined;
  return {
    source: source.startsWith("/") ? source.substring(1) : source,
    target: (target === null || target === void 0 ? void 0 : target.startsWith("/")) ? target.substring(1) : target,
    transforms: transforms
  };
}
//# sourceMappingURL=parse.js.map