import { ipcMain, dialog } from 'electron'
import { WindowManager } from '../../core/WindowManager'

export class DialogHandler {
  public static register() {
    ipcMain.handle('show-dialog', (_, options) => {
      return dialog.showMessageBox(WindowManager.getMainWindow(), {
        type: options.type,
        title: options.title,
        message: options.message,
        buttons: options.buttons
      })
    })
  }
}
