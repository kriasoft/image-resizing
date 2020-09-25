/**
 * Copyright (c) 2020-present Kriasoft | MIT License (https://git.io/JUgVL)
 */

import type { Param, Params } from "./types";

/**
 * The list of supported image transformation options including parsing and
 * validation logic.
 */
export const params: Params = {
  width: {
    key: "w",
    parse: (value) => parseInt(value, 10),
    validate: (value) => !isNaN(value) && value >= 16 && value <= 3840,
  } as Param<number>,

  height: {
    key: "h",
    parse: (value) => parseInt(value, 10),
    validate: (value) => !isNaN(value) && value >= 16 && value <= 2160,
  } as Param<number>,

  crop: {
    key: "c",
    parse: (value) => value,
    validate: (value) => ["crop", "fill"].includes(value),
  } as Param<"crop" | "fill">,

  x: {
    key: "x",
    parse: (value) => parseInt(value, 10),
    validate: (value) => !isNaN(value),
  } as Param<number>,

  y: {
    key: "y",
    parse: (value) => parseInt(value, 10),
    validate: (value) => !isNaN(value),
  } as Param<number>,
};
