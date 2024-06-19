import { Platform } from '@electron-toolkit/utils'
import i18n from '@renderer/i18n'
import { ElMessage } from 'element-plus'

// 多语言
const { t } = i18n.global

export const setThemeSource = (themeSource = 'system') => {
  window.electron.ipcRenderer.send('set-theme-source', themeSource)
}

export const getPlatform = (): Platform => {
  return window.electron.ipcRenderer.sendSync('process-platform')
}

export const openCacheDir = () => {
  return window.electron.ipcRenderer.invoke('open-cache-dir')
}

export const openLogDir = () => {
  return window.electron.ipcRenderer.invoke('open-log-dir')
}

export const setProxy = (proxy: string) => {
  return window.electron.ipcRenderer.invoke('set-proxy', proxy)
}

export const getAppVersion = () => {
  return window.electron.ipcRenderer.invoke('get-app-version')
}

export const saveFileByPath = (imagePath: string, fileName: string) => {
  return window.electron.ipcRenderer.invoke('save-file-by-path', imagePath, fileName)
}

export const saveFileByUrl = (url: string, fileName: string) => {
  return window.electron.ipcRenderer.invoke('save-file-by-url', url, fileName)
}

export const saveFileByBase64 = (base64: string, fileName: string) => {
  return window.electron.ipcRenderer.invoke('save-file-by-base64', base64, fileName)
}

export const readLocalImageBase64 = (path: string) => {
  return window.electron.ipcRenderer.invoke('read-local-image-base64', path)
}

export const clipboardWriteText = (text: string) => {
  ElMessage.success(t('app.chatgpt.body.message.copied'))
  return window.electron.ipcRenderer.invoke('clipboard-write-text', text)
}

export const clearCacheFiles = (images: string[]) => {
  return window.electron.ipcRenderer.invoke('clear-cache-files', images)
}

export const getCacheFiles = (): Promise<{ name: string; data: string }[]> => {
  return window.electron.ipcRenderer.invoke('get-cache-files')
}

export const addCacheFiles = (cacheFiles: { name: string; data: string }[]): Promise<boolean> => {
  return window.electron.ipcRenderer.invoke('add-cache-files', cacheFiles)
}

export const selectFileAndRead = (filters: string[]) => {
  return window.electron.ipcRenderer.invoke('select-file-and-read', filters)
}

export const openDevTools = () => {
  return window.electron.ipcRenderer.invoke('open-dev-tools')
}

export const executeJavaScript = (jsCode: string) => {
  return window.electron.ipcRenderer.invoke('execute-js', jsCode)
}

export const onMainWindowFocus = (action: () => void) => {
  window.electron.ipcRenderer.on('main-window-focus', () => {
    action()
  })
}

export const showItemInFolder = (filePath: string) => {
  return window.electron.ipcRenderer.invoke('show-item-in-folder', filePath)
}
