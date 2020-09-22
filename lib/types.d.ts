/**
 * Copyright (c) 2020-present Kriasoft | MIT License (https://git.io/JUgVL)
 */
import { StorageOptions } from "@google-cloud/storage";
export declare type Transform = {
    width?: number;
    height?: number;
    crop?: "crop" | "fill";
};
export declare type Param<T> = {
    readonly key: string;
    readonly parse: (value: string) => T;
    readonly validate: (value: T) => boolean;
};
export declare type Params = {
    [K in keyof Transform]: Param<NonNullable<Transform[K]>>;
};
export declare type Options = {
    readonly storage?: StorageOptions;
    readonly sourceBucket: string;
    readonly cacheBucket: string;
    readonly params?: Params;
};
export declare type ParsedOutput = Readonly<{
    source: string;
    target?: string;
    transforms: Readonly<Transform>[];
}>;
