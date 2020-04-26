const fs = require('fs');
const PNG = require('pngjs').PNG;
const util = require('./utilities');

module.exports = {
    importFile: (fileName, tileWidth, tileHeight) => {
        const file = fs.readFileSync(fileName);
        const png = PNG.sync.read(file);

        const foundColors = [];

        for (let y = 0; y < png.height; y += tileHeight) {
            for (let x = 0; x < png.width; x += tileWidth) {
                const idx = (png.width * y + x) << 2;

                const r = png.data[idx];
                const g = png.data[idx + 1];
                const b = png.data[idx + 2];

                foundColors.push(util.rgbToHex(r, g, b));
            }
        }

        return foundColors;
    }
};