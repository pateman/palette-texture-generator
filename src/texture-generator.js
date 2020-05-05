const arrayChunk = require('array.chunk');
const util = require('./utilities');
const Jimp = require('jimp');

const DEFAULT_TILE_WIDTH = 8;
const DEFAULT_TILE_HEIGHT = 8;
const TILES_PER_ROW = 8;

const pow2ceil = (v) => {
    let p = 2;
    while (v >>= 1) {
        p <<= 1;
    }
    return p;
};

const fillWith = (color) => {
    const colorInRgb = util.hexToRgb(color);
    const colorInt = Jimp.rgbaToInt(colorInRgb[0], colorInRgb[1], colorInRgb[2], 255);
    return function (x, y, offset) {
        this.bitmap.data.writeUInt32BE(colorInt, offset, true);
    }
};

module.exports = {
    generate: (fileName, swatches) => {
        const destFileName = fileName.substr(0, fileName.lastIndexOf('.')) + '.png';
        const chunks = arrayChunk(swatches, TILES_PER_ROW);

        const imgWidth = TILES_PER_ROW * DEFAULT_TILE_WIDTH;
        const imgHeight = pow2ceil(chunks.length * DEFAULT_TILE_HEIGHT);

        new Jimp(imgWidth, imgHeight, '#000000', (err, img) => {
            chunks.forEach((chunk, y) => {
                chunk.forEach((swatch, x) => {
                    img.scan(x * DEFAULT_TILE_WIDTH, y * DEFAULT_TILE_HEIGHT, DEFAULT_TILE_WIDTH,
                        DEFAULT_TILE_HEIGHT, fillWith(swatch.color));
                });
            });

            img.write(destFileName, (err) => {
                if (err) {
                    throw err;
                }
            })
        });
    }
};