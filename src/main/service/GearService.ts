import fs from 'fs'
import path from 'path'
import { net, shell } from 'electron'

export class GearService {
  public static getGearData() {
    const dataPath = path.join(__dirname, '../../resources/unique.ndjson')
    return fs
      .readFileSync(dataPath)
      .toString()
      .split('\n')
      .map((line) => JSON.parse(line))
  }

  public static async downloadImage(_, { url, filename }: { url: string; filename: string }) {
    const downloadsPath = require('electron').app.getPath('downloads')
    const filePath = path.join(downloadsPath, filename)

    return new Promise((resolve, reject) => {
      const request = net.request(url)
      request.on('response', (response) => {
        const chunks: Buffer[] = []
        response.on('data', (chunk) => chunks.push(chunk))
        response.on('end', () => {
          fs.writeFile(filePath, Buffer.concat(chunks), (err) => {
            if (err) {
              reject(err)
            }
            shell.showItemInFolder(filePath)
            resolve(filePath)
          })
        })
      })
      request.on('error', reject)
      request.end()
    })
  }
}
