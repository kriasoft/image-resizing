/**
 * Copyright (c) 2020-present Kriasoft | MIT License (https://git.io/JUgVL)
 */
import { RequestHandler } from "express";
import type { Options } from "./types";
export type { Options, Params } from "./types";
export declare function createHandler(options: Options): RequestHandler;
