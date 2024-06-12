import { nowTimestamp } from '@renderer/utils/date-util'
import { generateUUID } from '@renderer/utils/id-util'
import { defineStore } from 'pinia'

export const useChatSessionStore = defineStore({
  id: 'chat-session',
  state: () => ({
    sessions: [] as ChatSession[],
    activeSessionId: ''
  }),
  getters: {
    getActiveSession(): ChatSession | undefined {
      return this.sessions.find((s) => s.id === this.activeSessionId)
    }
  },
  actions: {
    create(option: OpenAIOption) {
      const firstSession = this.sessions.at(0)
      if (firstSession && firstSession.messages.length === 0) {
        return
      }
      const sessionId = generateUUID()
      this.sessions.unshift({
        id: sessionId,
        createTime: nowTimestamp(),
        updateTime: nowTimestamp(),
        name: '',
        provider: 'OpenAI',
        messages: [] as ChatMessage[],
        ...option
      })
      this.activeSessionId = sessionId
    },
    delete(id: string) {
      this.sessions = this.sessions.filter((s) => s.id != id)
      this.activeSessionId = this.sessions.at(0)?.id ?? ''
    },
    clear() {
      this.sessions = []
    },
    pushMessage(message: ChatMessage) {
      if (!this.getActiveSession) {
        return
      }
      this.getActiveSession.messages.push({
        ...message,
        id: generateUUID(),
        createTime: nowTimestamp(),
        updateTime: nowTimestamp()
      })

      // 设置会话名称
      if (!this.getActiveSession.name && message.role === 'user') {
        this.getActiveSession.name = message.content
      }
    }
  },
  persist: true
})
