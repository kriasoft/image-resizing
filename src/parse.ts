/**
 * Copyright (c) 2020-present Kriasoft | MIT License (https://git.io/JUgVL)
 */

import { extname } from "path";
import { Transform, Param, Params, ParsedOutput } from "./types";

export function parseUrlPath(
  path: string,
  params: Readonly<Params>,
): ParsedOutput {
  const sourceFragments: string[] = [];
  const paramsFragments: string[] = [];
  const transforms: Transform[] = [];
  let stopParsing = false;

  path.split("/").forEach((fragment) => {
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

    const transform: Transform = {};
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const keys = new Map<string, [key: string, param: Param<any>]>(
      Object.entries(params as Required<Params>)
        .filter((x) => x !== undefined)
        .map(([name, x]) => [x.key, [name, x]]),
    );

    // Attempts to parse out parameters from the URL path fragment.
    // E.g. "w_80,h_16,c_fill" => ["w_80", "h_60", "c_fill"]
    fragment.split(",").some((x) => {
      const [key, val] = x.split("_");
      const p = val === undefined ? undefined : keys.get(key);

      if (p) {
        const [name, param] = p;
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const value: any = param.parse(val);

        if (value !== undefined && param.validate(val) !== false) {
          transform[name as keyof Transform] = value;
          keys.delete(key);
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

  const source = sourceFragments.join("/");
  const ext = extname(source);
  const target =
    transforms.length > 0
      ? source.substring(0, source.length - ext.length) +
        "__" +
        paramsFragments.join("__") +
        ext
      : undefined;

  return {
    source: source.startsWith("/") ? source.substring(1) : source,
    target: target?.startsWith("/") ? target.substring(1) : target,
    transforms,
  };
}

/**
 * Extracts folder name (prefix) from the bucket name.
 *
 * @example
 *   parseBucket("gs://s.example.com")          => ["gs://s.example.com", ""]
 *   parseBucket("gs://s.example.com/")         => ["gs://s.example.com", ""]
 *   parseBucket("gs://s.example.com/uploads")  => ["gs://s.example.com", "uploads/"]
 *   parseBucket("gs://s.example.com/uploads/") => ["gs://s.example.com", "uploads/"]
 */
export function parseBucket(value: string): [bucket: string, prefix: string] {
  const protocol = ((i: number) =>
    i === -1 ? "gs:" : value.substring(0, i + 1))(value.indexOf("://"));

  if (protocol !== "gs:") {
    throw new Error("Only Google Storage buckets are supported at the moment.");
  }

  return ((i: number): [bucket: string, prefix: string] => {
    return i === -1
      ? [value, ""]
      : [
          value.substring(0, i),
          ((x) => x && (x.endsWith("/") ? x : `${x}/`))(value.substring(i + 1)),
        ];
  })(value.indexOf("/", protocol ? protocol.length + 2 : 0));
}
