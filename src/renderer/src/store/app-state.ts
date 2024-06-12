import { defineStore } from 'pinia'

export const useAppStateStore = defineStore({
  id: 'app-state',
  state: () => ({
    chatgptLoading: false,
    chatgptAnswering: false
  }),
  persist: false
})
