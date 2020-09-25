import fs from "fs";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import { transform } from "./transform";
import type { Transform } from "./types";

/* eslint-env jest */

expect.extend({ toMatchImageSnapshot });

it("w_80,h_60,c_fill.png", (done) => {
  const transforms: Transform[] = [{ width: 80, height: 60, crop: "fill" }];
  transform(fs.createReadStream("test.jpg"), transforms).toBuffer(
    "png",
    (err, image) => {
      if (err) {
        done(err);
      } else {
        expect(image).toMatchImageSnapshot();
        done();
      }
    },
  );
});

it("w_60,h_80,c_fill.png", (done) => {
  const transforms: Transform[] = [{ width: 60, height: 80, crop: "fill" }];
  transform(fs.createReadStream("test.jpg"), transforms).toBuffer(
    "png",
    (err, image) => {
      if (err) {
        done(err);
      } else {
        expect(image).toMatchImageSnapshot();
        done();
      }
    },
  );
});

it("w_80,h_60.png", (done) => {
  const transforms: Transform[] = [{ width: 80, height: 60 }];
  transform(fs.createReadStream("test.jpg"), transforms).toBuffer(
    "png",
    (err, image) => {
      if (err) {
        done(err);
      } else {
        expect(image).toMatchImageSnapshot();
        done();
      }
    },
  );
});

it("w_60,h_80.png", (done) => {
  const transforms: Transform[] = [{ width: 60, height: 80 }];
  transform(fs.createReadStream("test.jpg"), transforms).toBuffer(
    "png",
    (err, image) => {
      if (err) {
        done(err);
      } else {
        expect(image).toMatchImageSnapshot();
        done();
      }
    },
  );
});

it("w_60.png", (done) => {
  const transforms: Transform[] = [{ width: 60 }];
  transform(fs.createReadStream("test.jpg"), transforms).toBuffer(
    "png",
    (err, image) => {
      if (err) {
        done(err);
      } else {
        expect(image).toMatchImageSnapshot();
        done();
      }
    },
  );
});

it("h_60.png", (done) => {
  const transforms: Transform[] = [{ height: 60 }];
  transform(fs.createReadStream("test.jpg"), transforms).toBuffer(
    "png",
    (err, image) => {
      if (err) {
        done(err);
      } else {
        expect(image).toMatchImageSnapshot();
        done();
      }
    },
  );
});

it("x_260,y_160,w_120,h_80,c_crop.png", (done) => {
  const transforms: Transform[] = [
    { x: 260, y: 160, width: 120, height: 80, crop: "crop" },
  ];
  transform(fs.createReadStream("test.jpg"), transforms).toBuffer(
    "png",
    (err, image) => {
      if (err) {
        done(err);
      } else {
        expect(image).toMatchImageSnapshot();
        done();
      }
    },
  );
});
