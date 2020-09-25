# Cloud Image Resizing &middot; [![npm package][npm-badge]][npm]

[npm-badge]: https://img.shields.io/npm/v/image-resizing.svg?style=flat-square
[npm]: https://www.npmjs.org/package/image-resizing

Node.js backend (middleware) for image manipulation needs (transform, resize,
optimize) that can be hosted in a serverless environment such as Google Cloud
Functions.

## Getting Started

Create a Google Cloud Function project that exports image transformation HTTP handler:

```
$ npm install image-resizing --save
```

```js
const { createHandler } = require("image-resizing");

module.exports.img = createHandler({
  // Where the source images are located.
  // E.g. gs://s.example.com/image.jpg
  sourceBucket: "s.example.com",
  // Where the transformed images needs to be stored.
  // E.g. gs://c.example.com/image__w_80,h_60.jpg
  cacheBucket: "c.example.com",
});
```

Deploy it to GCP using Node.js v12+ runtime and configure a CDN on top of it.

```
https://example.com/image.jpg - original image
https://example.com/w_80,h_60,c_fill/image.jpg - resized image (80x60)
https://example.com/x_10,y_10,w_80,h_60,c_crop/image.jpg - cropped image (80x60 at 10,10 offset)
```

## References

- [Google Cloud Functions: Quickstart Tutorial](https://cloud.google.com/functions/docs/quickstart)
- [Google Cloud Functions: ImageMagick Tutorial](https://cloud.google.com/functions/docs/tutorials/imagemagick)
- [ImageMagick Options](https://imagemagick.org/script/command-line-processing.php#option)

## Contributing

Contributions of any kind are welcome! If you're unsure about something or need
directions, don't hesitate to get in touch on [Discord](https://discord.com/invite/bSsv7XM).

## License

Copyright © 2020-present Kriasoft. This source code is licensed under the MIT license found in the
[LICENSE](https://github.com/kriasoft/image-resizing/blob/main/LICENSE) file.

---

<sup>Made with ♥ by Konstantin Tarkus ([@koistya](https://twitter.com/koistya), [blog](https://medium.com/@koistya))
and [contributors](https://github.com/kriasoft/image-resizing/graphs/contributors).</sup>
