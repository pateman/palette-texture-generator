const {ipcMain, dialog} = require('electron')
const fs = require('fs');
const path = require('path');
const PngSwatchesImporter = require('./png-swatches-importer');
const JpgSwatchesImporter = require('./jpg-swatches-importer');
const TextureGenerator = require('./texture-generator');

let swatchesDb = [];
let currentFile = '';

const replyWithSwatches = (event) => {
    event.reply('swatches-reload', {
        fileName: currentFile,
        swatches: swatchesDb
    });
};

const findLastSwatchId = () => {
    const idWithMaxSwatch = swatchesDb.reduce((acc, cur) => cur.id >= acc.id ? cur : acc, {id: 0});
    return idWithMaxSwatch ? idWithMaxSwatch.id : 0;
};

module.exports = {
    getSwatches: () => swatchesDb,
    getCurrentFile: () => currentFile,
    loadSwatchesFromFile: (fileName) => {
        const fileData = fs.readFileSync(fileName);
        swatchesDb = JSON.parse(fileData);
        currentFile = fileName;
    },
    saveSwatchesToFile: (fileName) => {
        fs.writeFileSync(fileName, JSON.stringify(swatchesDb));
        currentFile = fileName;
    },
    resetSwatches: () => {
        currentFile = '';
        swatchesDb = [];
    },
    generateTexture: (fileName) => {
        TextureGenerator.generate(fileName, swatchesDb);
    },
    bindEvents: () => {
        ipcMain.on('swatch-remove', (event, arg) => {
            console.log('on swatch remove', arg);
            const idToRemove = arg.id;

            for (let idx = 0; idx < swatchesDb.length; ++idx) {
                if (swatchesDb[idx].id === idToRemove) {
                    swatchesDb.splice(idx, 1);
                    break;
                }
            }
            replyWithSwatches(event);
        });

        ipcMain.on('swatch-update', (event, arg) => {
            console.log('on swatch update', arg);
            const idToUpdate = arg.id;

            for (let idx = 0; idx < swatchesDb.length; ++idx) {
                if (swatchesDb[idx].id === idToUpdate) {
                    swatchesDb[idx].name = arg.name;
                    swatchesDb[idx].color = arg.color;
                }
            }

            replyWithSwatches(event);
        });

        ipcMain.on('swatch-create', (event, arg) => {
            console.log('on swatch create', arg);
            swatchesDb.push({
                id: arg.id,
                name: arg.name,
                color: arg.color
            });
            replyWithSwatches(event);
        });

        ipcMain.on('import-start', (event, arg) => {
            const openFile = dialog.showOpenDialogSync({
                title: 'Import swatches...',
                filters: [
                    {name: 'All Files', extensions: ['jpg', 'png']}
                ]
            });

            if (!openFile || !openFile.length) {
                return;
            }

            const extension = path.extname(openFile[0]);
            let importedColors = null;
            if (extension === '.png') {
                importedColors = PngSwatchesImporter.importFile(openFile[0], arg.tileWidth, arg.tileHeight);
            } else if (extension === '.jpg' || extension === '.jpeg') {
                importedColors = JpgSwatchesImporter.importFile(openFile[0], arg.tileWidth, arg.tileHeight);
            } else {
                importedColors = [];
            }

            for (let i = 0; i < importedColors.length; ++i) {
                const col = importedColors[i];
                const newSwatch = {
                    id: findLastSwatchId() + 1,
                    name: `${path.basename(openFile[0])}-${i + 1}`,
                    color: col
                };
                swatchesDb.push(newSwatch);
            }

            replyWithSwatches(event);
        });
    }
};