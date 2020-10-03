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

function createHandler(options) {
  var _options$sourcePathPr, _options$cachePathPre;

  var storage = new _storage.Storage(options.storage);
  var sourceBucket = storage.bucket(options.sourceBucket);
  var cacheBucket = storage.bucket(options.cacheBucket);
  var sourcePathPrefix = (_options$sourcePathPr = options.sourcePathPrefix) !== null && _options$sourcePathPr !== void 0 ? _options$sourcePathPr : "";
  var cachePathPrefix = (_options$cachePathPre = options.cachePathPrefix) !== null && _options$cachePathPre !== void 0 ? _options$cachePathPre : "";
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