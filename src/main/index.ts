import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { WindowManager } from './core/WindowManager'
import { GearHandler } from './ipc/handlers/GearHandler'
import { DialogHandler } from './ipc/handlers/DialogHandler'

app
  .whenReady()
  .then(() => {
    electronApp.setAppUserModelId('com.electron')

    // 初始化窗口
    WindowManager.createWindow()

    // 注册IPC处理器
    GearHandler.register()
    DialogHandler.register()

    // 开发工具快捷键
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) WindowManager.createWindow()
    })
  })
  .catch((e) => console.error(e))

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
