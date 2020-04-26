const fs = require('fs');
const jpeg = require('jpeg-js');
const util = require('./utilities');

module.exports = {
    importFile: (fileName, tileWidth, tileHeight) => {
        const file = fs.readFileSync(fileName);
        const jpegData = jpeg.decode(file);

        const foundColors = [];

        for (let y = 0; y < jpegData.height; y += tileHeight) {
            for (let x = 0; x < jpegData.width; x += tileWidth) {
                const idx = (jpegData.width * y + x) << 2;

                const r = jpegData.data[idx];
                const g = jpegData.data[idx + 1];
                const b = jpegData.data[idx + 2];

                foundColors.push(util.rgbToHex(r, g, b));
            }
        }

        return foundColors;
    }
};