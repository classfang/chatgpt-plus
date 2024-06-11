import { app } from 'electron'
import { join } from 'path'

export const appConfig = {
  appUserModelId: 'cn.junki.chatgpt',
  logsPath: join(app.getPath('userData'), 'logs'),
  cachePath: join(app.getPath('userData'), 'cache')
}
export const mainWindowConfig = {
  minWidth: 1000,
  minHeight: 700
}
