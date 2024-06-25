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
    clear() {
      this.sessions = []
      this.activeSessionId = ''
    },
    create(setting: {
      chatOption: ChatOption
      speechOption: SpeechOption
      textToImageOption: TextToImageOption
      internetSearchOption: InternetSearchOption
    }) {
      const firstSession = this.sessions.at(0)
      // 如果存在新的空对话，则删除
      if (firstSession && firstSession.messages.length === 0) {
        this.sessions.shift()
      }
      const sessionId = generateUUID()
      this.sessions.unshift({
        id: sessionId,
        createTime: nowTimestamp(),
        name: '',
        provider: 'OpenAI',
        messages: [] as ChatMessage[],
        chatOption: setting.chatOption,
        speechOption: setting.speechOption,
        textToImageOption: setting.textToImageOption,
        internetSearchOption: setting.internetSearchOption
      })
      this.activeSessionId = sessionId
    },
    delete(id: string) {
      this.sessions = this.sessions.filter((s) => s.id != id)
      this.activeSessionId = this.sessions.at(0)?.id ?? ''
    },
    pushMessage(message: ChatMessage, sessionName?: string) {
      if (!this.getActiveSession) {
        return
      }
      this.getActiveSession.messages.push({
        ...message,
        id: generateUUID(),
        createTime: nowTimestamp()
      })

      // 设置会话标题
      if (sessionName) {
        this.getActiveSession.name = sessionName
      } else if (!this.getActiveSession.name && message.role === 'user') {
        this.getActiveSession.name = message.content
      }
    },
    appendMessageContent(content: string, images?: ChatMessageFile[]) {
      if (!this.getActiveSession) {
        return
      }
      const latestMessage = this.getActiveSession.messages.at(-1)
      if (!latestMessage) {
        return
      }

      latestMessage.content += content
      if (images) {
        latestMessage.images = images
      }
    },
    deleteMessage(messageId: string) {
      if (!this.getActiveSession) {
        return
      }
      this.getActiveSession.messages = this.getActiveSession.messages.filter(
        (m) => m.id != messageId
      )
    },
    deleteMessagesFrom(messageId: string) {
      if (!this.getActiveSession) {
        return false
      }
      const fromIndex = this.getActiveSession.messages.findIndex((m) => m.id === messageId)
      if (fromIndex <= 0) {
        return false
      }
      this.getActiveSession.messages = this.getActiveSession.messages.splice(0, fromIndex + 1)
      return true
    },
    getSessionById(sessionId: string): ChatSession | undefined {
      return this.sessions.find((s) => s.id === sessionId)
    },
    messageChoice(messageId: string, step: number) {
      if (!this.getActiveSession) {
        return
      }

      const message = this.getActiveSession.messages.find((m) => m.id === messageId)
      if (!message || !message.choices || message.choiceIndex === undefined) {
        return
      }

      message.choiceIndex += step
      if (message.choiceIndex < 0) {
        message.choiceIndex = 0
      } else if (message.choiceIndex > message.choices.length - 1) {
        message.choiceIndex = message.choices.length - 1
      }

      message.content = message.choices[message.choiceIndex].content
      message.images = message.choices[message.choiceIndex].images
    }
  },
  persist: true
})
