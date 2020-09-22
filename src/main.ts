/**
 * Copyright (c) 2020-present Kriasoft | MIT License (https://git.io/JUgVL)
 */

import { RequestHandler } from "express";
import { Storage } from "@google-cloud/storage";

import { params } from "./params";
import { parseUrlPath } from "./parse";
import { transform } from "./transform";
import { handleError, noop } from "./utils";
import type { Options, Params } from "./types";
export type { Options, Params } from "./types";

export function createHandler(options: Options): RequestHandler {
  const storage = new Storage(options.storage);
  const sourceBucket = storage.bucket(options.sourceBucket);
  const cacheBucket = storage.bucket(options.cacheBucket);

  const cacheControl = "public, max-age=31560000, immutable";
  const cacheControlInitial = "public, max-age=31560000, s-maxage=0, immutable";

  const mergedParams = options.params
    ? {
        ...params,
        ...Object.keys(options.params).reduce<Params>(
          (acc, key) => ({
            ...acc,
            [key]: {
              ...params[key as keyof Params],
              ...options.params?.[key as keyof Params],
            },
          }),
          {},
        ),
      }
    : params;

  return function handleRequest(req, res) {
    const path = decodeURIComponent(req.path);
    const { source, target, transforms } = parseUrlPath(path, mergedParams);

    const sourceFile = target
      ? cacheBucket.file(target)
      : sourceBucket.file(source);

    sourceFile
      .createReadStream({ decompress: false })
      .on("error", noop)
      .on("response", function (this: NodeJS.ReadStream, x) {
        if (x.statusCode === 200) {
          res.set("Content-Type", x.headers["content-type"]);
          res.set("Cache-Control", cacheControl);
          res.set("etag", x.headers.etag);
          this.pipe(res);
        } else if (x.statusCode === 404) {
          this.end();
          sourceBucket
            .file(source)
            .createReadStream()
            .on("error", noop)
            .on("response", function (this: NodeJS.ReadStream, x) {
              if (x.statusCode === 200) {
                res.set("Cache-Control", cacheControlInitial);
                transform(this, transforms).stream((err, out) => {
                  if (err) {
                    handleError(res, err);
                  } else {
                    const targetFile = cacheBucket
                      .file(target as string)
                      .createWriteStream({
                        contentType: x.headers["content-type"],
                      })
                      .on("error", (err) => {
                        console.error(err);
                      });
                    out.pipe(targetFile);
                    out.pipe(res);
                  }
                });
              } else {
                this.end(() => {
                  res.status(x.statusCode);
                  res.send(x.statusMessage);
                });
              }
            })
            .resume();
        } else {
          this.end(() => {
            res.status(x.statusCode);
            res.end(x.statusMessage);
          });
        }
      })
      .resume();
  };
}
