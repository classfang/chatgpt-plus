import { nowTimestamp } from '@renderer/utils/date-util'
import { generateUUID } from '@renderer/utils/id-util'
import { defineStore } from 'pinia'

export const useChatMemoryStore = defineStore({
  id: 'chat-memory',
  state: () => ({
    memoryList: [] as ChatMemory[]
  }),
  actions: {
    add(content: string) {
      this.memoryList.unshift({
        id: generateUUID(),
        createTime: nowTimestamp(),
        content: content
      })
    },
    deleteById(id: string) {
      this.memoryList.filter((memory) => memory.id != id)
    }
  },
  persist: true
})
