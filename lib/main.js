"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createHandler = createHandler;

var _storage = require("@google-cloud/storage");

var _params = require("./params");

var _parse = require("./parse");

var _transform = require("./transform");

var _utils = require("./utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function createHandler(options) {
  var storage = new _storage.Storage(options.storage);

  var _parseBucket = (0, _parse.parseBucket)(options.sourceBucket),
      _parseBucket2 = _slicedToArray(_parseBucket, 2),
      sourceBucketPath = _parseBucket2[0],
      sourcePathPrefix = _parseBucket2[1];

  var _parseBucket3 = (0, _parse.parseBucket)(options.cacheBucket),
      _parseBucket4 = _slicedToArray(_parseBucket3, 2),
      cacheBucketPath = _parseBucket4[0],
      cachePathPrefix = _parseBucket4[1];

  var sourceBucket = storage.bucket(sourceBucketPath);
  var cacheBucket = storage.bucket(cacheBucketPath);
  var cacheControl = "public, max-age=31560000, immutable";
  var cacheControlInitial = "public, max-age=31560000, s-maxage=0, immutable";
  var mergedParams = options.params ? _objectSpread(_objectSpread({}, _params.params), Object.keys(options.params).reduce(function (acc, key) {
    var _options$params;

    return _objectSpread(_objectSpread({}, acc), {}, _defineProperty({}, key, _objectSpread(_objectSpread({}, _params.params[key]), (_options$params = options.params) === null || _options$params === void 0 ? void 0 : _options$params[key])));
  }, {})) : _params.params;
  return function handleRequest(req, res) {
    var path = decodeURIComponent(req.path);

    var _parseUrlPath = (0, _parse.parseUrlPath)(path, mergedParams),
        source = _parseUrlPath.source,
        target = _parseUrlPath.target,
        transforms = _parseUrlPath.transforms;

    var targetPath = cachePathPrefix + target;
    var sourcePath = sourcePathPrefix + source;
    var sourceFile = target ? cacheBucket.file(targetPath) : sourceBucket.file(sourcePath);
    sourceFile.createReadStream({
      decompress: false
    }).on("error", _utils.noop).on("response", function (x) {
      if (x.statusCode === 200) {
        res.set("Content-Type", x.headers["content-type"]);
        res.set("Cache-Control", cacheControl);
        res.set("etag", x.headers.etag);
        this.pipe(res);
      } else if (x.statusCode === 404) {
        this.end();
        sourceBucket.file(sourcePath).createReadStream().on("error", _utils.noop).on("response", function (x) {
          if (x.statusCode === 200) {
            res.set("Cache-Control", cacheControlInitial);
            (0, _transform.transform)(this, transforms).stream(function (err, out) {
              if (err) {
                (0, _utils.handleError)(res, err);
              } else {
                var targetFile = cacheBucket.file(targetPath).createWriteStream({
                  contentType: x.headers["content-type"]
                }).on("error", function (err) {
                  console.error(err);
                });
                out.pipe(targetFile);
                out.pipe(res);
              }
            });
          } else {
            this.end(function () {
              res.status(x.statusCode);
              res.send(x.statusMessage);
            });
          }
        }).resume();
      } else {
        this.end(function () {
          res.status(x.statusCode);
          res.end(x.statusMessage);
        });
      }
    }).resume();
  };
}
//# sourceMappingURL=main.js.map