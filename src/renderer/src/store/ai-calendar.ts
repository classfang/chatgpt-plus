import { defineStore } from 'pinia'

export const useAICalendarStore = defineStore({
  id: 'ai-calendar',
  state: () => ({
    dayNotes: {} as Record<string, CalendarNote>
  }),
  getters: {
    getStoreJson(): string {
      return JSON.stringify({
        dayNotes: this.dayNotes
      })
    }
  },
  actions: {
    setStoreFromJson(jsonStr: string) {
      let importCount = 0
      if (!jsonStr) {
        return importCount
      }
      const json = JSON.parse(jsonStr)
      if (json.dayNotes !== undefined) {
        this.dayNotes = json.dayNotes
        importCount = Object.keys(this.dayNotes).length
      }
      return importCount
    },
    clear() {
      this.dayNotes = {}
    }
  },
  persist: true
})
