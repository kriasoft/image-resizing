/**
 * Copyright (c) 2020-present Kriasoft | MIT License (https://git.io/JUgVL)
 */

import GraphicsMagick from "gm";
import type { Transform } from "./types";

const gm = GraphicsMagick.subClass({ imageMagick: true });

/**
 * Transforms an image stream using {@link https://github.com/aheckmann/gm#readme|ImageMagick}.
 */
export function transform(
  imageStream: NodeJS.ReadableStream,
  transforms: Transform[],
): GraphicsMagick.State {
  let state = gm(imageStream);

  transforms.forEach((params) => {
    if (params.width && params.height) {
      if (
        params.y !== undefined &&
        params.y !== undefined &&
        params.crop === "crop"
      ) {
        state = state.crop(params.width, params.height, params.x, params.y);
      } else if (params.crop === "fill") {
        state = state
          .resize(params.width, params.height, "^")
          .gravity("Center")
          .extent(params.width, params.height);
      } else {
        state = state.resize(params.width, params.height, "!");
      }
    } else if (params.width) {
      state = state.resize(params.width, undefined);
    } else if (params.height) {
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      /* @ts-ignore */
      state = state.resize(undefined, params.height);
    }
  });

  return state;
}
