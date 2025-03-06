import { ipcMain } from 'electron'
import { GearService } from '../../service/GearService'

export class GearHandler {
  public static register() {
    ipcMain.handle('get-gears', GearService.getGearData)
    ipcMain.handle('download-image', GearService.downloadImage)
  }
}
