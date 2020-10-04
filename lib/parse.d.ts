/**
 * Copyright (c) 2020-present Kriasoft | MIT License (https://git.io/JUgVL)
 */
import { Params, ParsedOutput } from "./types";
export declare function parseUrlPath(path: string, params: Readonly<Params>): ParsedOutput;
/**
 * Extracts folder name (prefix) from the bucket name.
 *
 * @example
 *   parseBucket("gs://s.example.com")          => ["gs://s.example.com", ""]
 *   parseBucket("gs://s.example.com/")         => ["gs://s.example.com", ""]
 *   parseBucket("gs://s.example.com/uploads")  => ["gs://s.example.com", "uploads/"]
 *   parseBucket("gs://s.example.com/uploads/") => ["gs://s.example.com", "uploads/"]
 */
export declare function parseBucket(value: string): [bucket: string, prefix: string];
