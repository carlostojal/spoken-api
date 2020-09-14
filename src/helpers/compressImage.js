const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

const compressImage = (input, dest_path) => {
  return new Promise((resolve, reject) => {
    imagemin([input], {
      destination: dest_path,
      plugins: [
          imageminMozjpeg({
            quality: process.env.JPEG_COMPRESSION_QUALITY
          }),
          imageminPngquant({
            quality: [process.env.PNG_MIN_COMPRESSION_QUALITY, process.env.PNG_MAX_COMPRESSION_QUALITY]
          })
      ]
    }).then((files) => {
      resolve(files[0]);
    }).catch((error) => {
      reject(error);
    });
  });
};

module.exports = compressImage;