module.exports = {
    rgbToHex: (r, g, b) => {
        const numToHex = (v) => {
            let hex = v.toString(16);
            if (hex.length < 2) {
                hex = '0' + hex;
            }
            return hex;
        };

        return `#${numToHex(r)}${numToHex(g)}${numToHex(b)}`;
    },
    hexToRgb: (color) => {
        const hex = color.replace(/^#/, '');
        const length = hex.length;
        return [
            parseInt(length === 6 ? hex['0'] + hex['1'] : hex['0'] + hex['0'], 16),
            parseInt(length === 6 ? hex['2'] + hex['3'] : hex['1'] + hex['1'], 16),
            parseInt(length === 6 ? hex['4'] + hex['5'] : hex['2'] + hex['2'], 16)
        ];
    }
};