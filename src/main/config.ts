import { app } from 'electron'
import { join } from 'path'

export const appConfig = {
  appUserModelId: 'cn.junki.chatgpt',
  logsPath: join(app.getPath('userData'), 'app_logs'),
  cachePath: join(app.getPath('userData'), 'app_cache')
}
export const mainWindowConfig = {
  minWidth: 1000,
  minHeight: 700,
  trafficLightPosition: {
    x: 15,
    y: 12
  }
}
