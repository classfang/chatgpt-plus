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
    getStoreJson(): string {
      return JSON.stringify({
        sessions: this.sessions,
        activeSessionId: this.activeSessionId
      })
    },
    getUsedSessions(): ChatSession[] {
      return this.sessions.filter((s) => s.messages.length > 0 && !s.archived)
    },
    getArchivedSessions(): ChatSession[] {
      return this.sessions.filter((s) => s.archived === true)
    },
    getActiveSession(): ChatSession | undefined {
      return this.sessions.find((s) => s.id === this.activeSessionId)
    }
  },
  actions: {
    setStoreFromJson(jsonStr: string) {
      let importCount = 0
      if (!jsonStr) {
        return importCount
      }
      const json = JSON.parse(jsonStr)
      if (json.sessions !== undefined) {
        this.sessions = json.sessions
        importCount = this.sessions.length
      }
      if (json.activeSessionId !== undefined) {
        this.activeSessionId = json.activeSessionId
      }
      return importCount
    },
    clear() {
      this.sessions = []
      this.activeSessionId = ''
    },
    create(setting: {
      chatOption: ChatOption
      speechOption: SpeechOption
      textToImageOption: TextToImageOption
      memoryOption: MemoryOption
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
        archived: false,
        chatOption: setting.chatOption,
        speechOption: setting.speechOption,
        textToImageOption: setting.textToImageOption,
        memoryOption: setting.memoryOption,
        internetSearchOption: setting.internetSearchOption
      })
      this.activeSessionId = sessionId
    },
    archived(id: string) {
      const session = this.sessions.find((s) => s.id === id)
      if (session) {
        session.archived = true
      }
      this.activeSessionId = this.sessions.at(0)?.id ?? ''
    },
    archivedAll() {
      this.sessions.forEach((s) => {
        if (s.messages.length > 0) {
          s.archived = true
        }
      })
      this.activeSessionId = this.sessions.at(0)?.id ?? ''
    },
    unarchived(id: string) {
      const session = this.sessions.find((s) => s.id === id)
      if (session) {
        session.archived = false
      }
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
    appendMessageContent(
      content: string,
      images?: ChatMessageFile[],
      searchItems?: InternetSearchResultItem[]
    ) {
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
      if (searchItems) {
        latestMessage.searchItems = searchItems
      }
    },
    clearContext(messageId: string) {
      if (!this.getActiveSession) {
        return
      }
      const index = this.getActiveSession.messages.findIndex((m) => m.id === messageId)
      if (index > -1 && this.getActiveSession.messages.at(index + 1)?.type != 'divider') {
        this.getActiveSession.messages.splice(index + 1, 0, {
          role: 'system',
          type: 'divider',
          content: '',
          id: generateUUID(),
          createTime: nowTimestamp()
        })
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
    changeChoice(messageId: string, step: number) {
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
      message.searchItems = message.choices[message.choiceIndex].searchItems
    },
    saveChoice() {
      if (!this.getActiveSession) {
        return
      }
      const latestMessage = this.getActiveSession.messages.at(-1)
      if (!latestMessage) {
        return
      }

      if (latestMessage.choices) {
        latestMessage.choices[latestMessage.choices.length - 1].content = latestMessage.content
        latestMessage.choices[latestMessage.choices.length - 1].images = latestMessage.images
        latestMessage.choices[latestMessage.choices.length - 1].searchItems =
          latestMessage.searchItems
      }
    },
    pushChoice() {
      if (!this.getActiveSession) {
        return
      }
      const latestMessage = this.getActiveSession.messages.at(-1)
      if (!latestMessage) {
        return
      }

      // 初始化choices
      if (!latestMessage.choices) {
        latestMessage.choices = [
          {
            content: latestMessage.content,
            images: latestMessage.images,
            searchItems: latestMessage.searchItems
          }
        ]
      }
      latestMessage.choices.push({
        content: '',
        images: [],
        searchItems: []
      })

      // 初始化choiceIndex
      if (!latestMessage.choiceIndex) {
        latestMessage.choiceIndex = 1
      } else {
        latestMessage.choiceIndex++
      }
    },
    clearLatestMessage() {
      if (!this.getActiveSession) {
        return
      }
      const latestMessage = this.getActiveSession.messages.at(-1)
      if (!latestMessage) {
        return
      }

      latestMessage.content = ''
      latestMessage.images = []
      latestMessage.searchItems = []
    }
  },
  persist: true
})
