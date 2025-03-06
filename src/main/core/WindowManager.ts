import { BrowserWindow, BrowserWindowConstructorOptions, shell } from 'electron'
import path from 'path'
import { is } from '@electron-toolkit/utils'

export class WindowManager {
  private static instance: BrowserWindow

  public static createWindow(options?: BrowserWindowConstructorOptions): BrowserWindow {
    const defaultOptions = {
      width: 900,
      height: 670,
      autoHideMenuBar: true,
      webPreferences: {
        preload: path.join(__dirname, '../preload/index.js'),
        sandbox: false
      },
      ...options
    }

    this.instance = new BrowserWindow(defaultOptions)
    this.setupWindowEvents()
    this.loadAppContent()
    return this.instance
  }

  private static setupWindowEvents(): void {
    this.instance.on('ready-to-show', () => this.instance.show())

    if (is.dev) {
      this.instance.webContents.openDevTools()
    }

    this.instance.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })
  }

  public static getMainWindow(): BrowserWindow {
    return this.instance
  }

  private static loadAppContent(): void {
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      // [!code ++]
      this.instance.loadURL(process.env['ELECTRON_RENDERER_URL']) // [!code ++]
    } else {
      // [!code ++]
      this.instance.loadFile(path.join(__dirname, '../renderer/index.html')) // [!code ++]
    } // [!code ++]
  }
}
