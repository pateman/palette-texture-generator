const {dialog} = require('electron');
const MainApplication = require('./main-application');

const sendSwatchesReload = (browserWindow, fileName) => {
    browserWindow.webContents.send('swatches-reload', {
        fileName: fileName,
        swatches: MainApplication.getSwatches()
    });
};

const showSaveDialog = () => {
    return dialog.showSaveDialogSync({
        title: 'Save a palette JSON...',
        filters: [
            {name: 'All Files', extensions: ['json']}
        ]
    });
}

module.exports = {
    OnNewFileClick: (item, browserWindow, event) => {
        MainApplication.resetSwatches();
        sendSwatchesReload(browserWindow, '');
    },
    OnOpenFileClick: (item, browserWindow, event) => {
        const openFile = dialog.showOpenDialogSync(browserWindow, {
            title: 'Open a palette JSON...',
            filters: [
                {name: 'All Files', extensions: ['json']}
            ]
        });

        if (openFile && openFile.length) {
            MainApplication.loadSwatchesFromFile(openFile[0]);
            sendSwatchesReload(browserWindow, openFile[0]);
        }
    },
    OnSaveFileClick: (item, browserWindow, event) => {
        let fileToSave = MainApplication.getCurrentFile();
        if (!fileToSave.length) {
            fileToSave = showSaveDialog();
        }

        if (fileToSave) {
            MainApplication.saveSwatchesToFile(fileToSave);
            sendSwatchesReload(browserWindow, fileToSave);
        }
    },
    OnGenerateClick: (item, browserWindow, event) => {
        let fileToSave = MainApplication.getCurrentFile();
        if (!fileToSave.length) {
            fileToSave = showSaveDialog();
        }

        if (fileToSave) {
            MainApplication.generateTexture(fileToSave);
            sendSwatchesReload(browserWindow, fileToSave);
        }
    }
};