import dayjs from 'dayjs'
import { defineStore } from 'pinia'

export const useAppStateStore = defineStore({
  id: 'app-state',
  state: () => ({
    chatgptLoading: false,
    chatgptAnswering: false,
    uploading: false,
    dayKey: dayjs().format('YYYYMMDD')
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
