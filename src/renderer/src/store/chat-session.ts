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
    getUsedSessions(): ChatSession[] {
      return this.sessions.filter((s) => s.messages.length > 0)
    },
    getActiveSession(): ChatSession | undefined {
      return this.sessions.find((s) => s.id === this.activeSessionId)
    }
  },
  actions: {
    create(option: OpenAIOption) {
      const firstSession = this.sessions.at(0)
      if (firstSession && firstSession.messages.length === 0) {
        this.activeSessionId = firstSession.id!
        return
      }
      const sessionId = generateUUID()
      this.sessions.unshift({
        id: sessionId,
        createTime: nowTimestamp(),
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
        createTime: nowTimestamp()
      })

      // 设置会话名称
      if (!this.getActiveSession.name && message.role === 'user') {
        this.getActiveSession.name = message.content
      }
    },
    appendMessageContent(content: string) {
      if (!this.getActiveSession) {
        return
      }
      const latestMessage = this.getActiveSession.messages.at(-1)
      if (!latestMessage) {
        return
      }

      latestMessage.content += content
    },
    deleteMessage(messageId: string) {
      if (!this.getActiveSession) {
        return
      }
      this.getActiveSession.messages = this.getActiveSession.messages.filter(
        (m) => m.id != messageId
      )
    }
  },
  persist: true
})
