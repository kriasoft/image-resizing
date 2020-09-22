/**
 * Copyright (c) 2020-present Kriasoft | MIT License (https://git.io/JUgVL)
 */

import { Response } from "express";

/* eslint-disable-next-line @typescript-eslint/no-empty-function */
export function noop(): void {}

export function handleError(res: Response, err: Error): void {
  console.error(err.stack);
  res.status(500);
  res.type("text/plain");
  res.send(err.message);
}
