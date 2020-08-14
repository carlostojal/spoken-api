const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

const compressImage = (input, dest_path) => {
  return new Promise((resolve, reject) => {
    imagemin([input], {
      destination: dest_path,
      plugins: [
          imageminMozjpeg({
            quality: 60
          }),
          imageminPngquant({
            quality: [0.6, 0.8]
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