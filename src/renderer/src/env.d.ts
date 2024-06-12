/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

type LLMProvider = 'OpenAI'

type ChatRole = 'user' | 'assistant' | 'system' | 'tool'

type ChatMessageType = 'chat' | 'error' | 'separator'

interface BaseEntity {
  id: string
  createTime: number
  updateTime: number
}

interface ChatMessageFile {
  name: string
  path: string
  size: number
}

interface ChatMessage extends BaseEntity {
  type: ChatMessageType
  role: ChatRole
  content: string
  images?: ChatMessageFile[]
  files?: ChatMessageFile[]
}

interface OpenAIOption {
  model: string
  temperature: number
  topP: number
  maxTokens: number
  presencePenalty: number
  frequencyPenalty: number
  contextSize: number
}

interface ChatSession extends BaseEntity, OpenAIOption {
  name: string
  provider: LLMProvider
  messages: ChatMessage[]
}
