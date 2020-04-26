const { app, BrowserWindow, Menu } = require('electron')
const MenuHandler = require('./src/menu-handler');
const MainApplication = require('./src/main-application');

function createWindow () {
    let win = new BrowserWindow({
        width: 1024,
        height: 768,
        title: 'Palette Texture Generator',
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    const mainMenu = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'New palette',
                    accelerator: 'Control+N',
                    click: MenuHandler.OnNewFileClick
                },
                {
                    label: 'Open palette...',
                    accelerator: 'Control+O',
                    click: MenuHandler.OnOpenFileClick
                },
                {
                    label: 'Save palette',
                    accelerator: 'Control+S',
                    click: MenuHandler.OnSaveFileClick
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Generate texture...',
                    accelerator: 'Control+G',
                    click: MenuHandler.OnGenerateClick
                }
            ]
        }
    ];
    const menu = Menu.buildFromTemplate(mainMenu);
    Menu.setApplicationMenu(menu);

    win.loadFile('index.html').then(() => {
        win.maximize();
        win.show();

        win.webContents.openDevTools();
        MainApplication.bindEvents();
    });
}

app.whenReady().then(createWindow);