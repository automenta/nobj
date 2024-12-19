const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')

/**
 * Electron main script: creates a BrowserWindow and loads index.html.
 */
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false, // Disable for security
        },
    })

    const menu = Menu.buildFromTemplate([
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open DevTools',
                    click: () => win.webContents.openDevTools(),
                },
                { type: 'separator' },
                {
                    role: 'quit',
                },
            ],
        },
    ])
    Menu.setApplicationMenu(menu)

    win.loadURL('http://localhost:3000')
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
