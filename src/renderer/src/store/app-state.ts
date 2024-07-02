import { getCachePathSync } from '@renderer/service/ipc-service'
import dayjs from 'dayjs'
import { defineStore } from 'pinia'

export const useAppStateStore = defineStore({
  id: 'app-state',
  state: () => ({
    chatgptLoadingFlag: false,
    chatgptAnswerFlag: false,
    currentToolName: null as null | string,
    uploadFlag: false,
    loadFileFlag: false,
    readWebFlag: false,
    cleanCacheFlag: false,
    exportChatFlag: false,
    importChatFlag: false,
    exportMemoryFlag: false,
    importMemoryFlag: false,
    exportSettingFlag: false,
    importSettingFlag: false,
    dayKey: dayjs().format('YYYYMMDD'),
    cachePath: getCachePathSync(),
    appSettingDialogVisible: false,
    archivedDataDialogVisible: false
  }),
  actions: {
    startDayKeyInterval() {
      // 刷新 dayKey，用于更具日期自动刷新组件
      setInterval(() => {
        this.dayKey = dayjs().format('YYYYMMDD')
      }, 1000)
    }
  },
  persist: false
})
