import {BrowserWindow} from 'electron';
import path from 'path';

export class DesktopWindow {
    private win: BrowserWindow | null = null;

    constructor() {
        this.createWindow();
    }

    private createWindow() {
        this.win = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                preload: path.join(__dirname, '../preload.js'),
                contextIsolation: true,
                nodeIntegration: false, // Disable for security
            },
        });

        this.win.loadFile(path.join(__dirname, '../../index.html')); // Adjust path as needed
    }

    public getWindow(): BrowserWindow | null {
        return this.win;
    }
}
