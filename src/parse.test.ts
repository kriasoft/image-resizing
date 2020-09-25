/**
 * Copyright (c) 2020-present Kriasoft | MIT License (https://git.io/JUgVL)
 */

import { params } from "./params";
import { parseUrlPath } from "./parse";

it("/w_60,h_80/example.jpg", () => {
  const result = parseUrlPath("/w_60,h_80/example.jpg", params);
  expect(result).toMatchInlineSnapshot(`
    Object {
      "source": "example.jpg",
      "target": "example__w_60,h_80.jpg",
      "transforms": Array [
        Object {
          "height": 80,
          "width": 60,
        },
      ],
    }
  `);
});

it("/img/w_80,h_60/example.jpg", () => {
  const result = parseUrlPath("/img/w_80,h_60/example.jpg", params);
  expect(result).toMatchInlineSnapshot(`
    Object {
      "source": "img/example.jpg",
      "target": "img/example__w_80,h_60.jpg",
      "transforms": Array [
        Object {
          "height": 60,
          "width": 80,
        },
      ],
    }
  `);
});

it("/img/w_80,h_60,c_fill/example.jpg", () => {
  const result = parseUrlPath("/img/w_80,h_60,c_fill/example.jpg", params);
  expect(result).toMatchInlineSnapshot(`
    Object {
      "source": "img/example.jpg",
      "target": "img/example__w_80,h_60,c_fill.jpg",
      "transforms": Array [
        Object {
          "crop": "fill",
          "height": 60,
          "width": 80,
        },
      ],
    }
  `);
});

it("/img/w_80,h_60,c_fill/w_60,h_40/example.jpg", () => {
  const result = parseUrlPath(
    "/img/w_80,h_60,c_fill/w_60,h_40/example.jpg",
    params,
  );
  expect(result).toMatchInlineSnapshot(`
    Object {
      "source": "img/example.jpg",
      "target": "img/example__w_80,h_60,c_fill__w_60,h_40.jpg",
      "transforms": Array [
        Object {
          "crop": "fill",
          "height": 60,
          "width": 80,
        },
        Object {
          "height": 40,
          "width": 60,
        },
      ],
    }
  `);
});

it("/img/x_10,y_5,w_80,h_60,c_crop/example.jpg", () => {
  const result = parseUrlPath(
    "/img/x_10,y_5,w_80,h_60,c_crop/example.jpg",
    params,
  );
  expect(result).toMatchInlineSnapshot(`
    Object {
      "source": "img/example.jpg",
      "target": "img/example__x_10,y_5,w_80,h_60,c_crop.jpg",
      "transforms": Array [
        Object {
          "crop": "crop",
          "height": 60,
          "width": 80,
          "x": 10,
          "y": 5,
        },
      ],
    }
  `);
});
