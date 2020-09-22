/**
 * Copyright (c) 2020-present Kriasoft | MIT License (https://git.io/JUgVL)
 */
/// <reference types="node" />
import GraphicsMagick from "gm";
import type { Transform } from "./types";
/**
 * Transforms an image stream using {@link https://github.com/aheckmann/gm#readme|ImageMagick}.
 */
export declare function transform(imageStream: NodeJS.ReadableStream, transforms: Transform[]): GraphicsMagick.State;
