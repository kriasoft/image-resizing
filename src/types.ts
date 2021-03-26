/**
 * Copyright (c) 2020-present Kriasoft | MIT License (https://git.io/JUgVL)
 */

import { StorageOptions } from "@google-cloud/storage";

export type Transform = {
  width?: number;
  height?: number;
  crop?: "crop" | "fill";
  x?: number;
  y?: number;
};

export type Param<T> = {
  readonly key: string;
  readonly parse: (value: string) => T;
  readonly validate: (value: T) => boolean;
};

export type Params = {
  [K in keyof Transform]: Param<NonNullable<Transform[K]>>;
};

export type Options = {
  /**
   * Cloud storage options.
   */
  readonly storage?: StorageOptions;

  /**
   * Storage bucket where the original (source) images can be found.
   */
  readonly sourceBucket: string;

  /**
   * Storage bucket for resized (cached) images.
   */
  readonly cacheBucket: string;

  /**
   * Image transformation parameters.
   */
  readonly params?: Params;
};

export type ParsedOutput = Readonly<{
  source: string;
  target?: string;
  transforms: Readonly<Transform>[];
}>;
