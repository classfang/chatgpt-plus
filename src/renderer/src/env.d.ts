/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

type LLMProvider = 'OpenAI'

type ChatRole = 'user' | 'assistant' | 'system' | 'tool'

type ChatMessageType = 'chat' | 'error'

interface BaseEntity {
  id?: string
  createTime?: number
}

interface ChatMessageFile {
  name: string
  extname: string
  path: string
  size: number
}

interface ChatMessage extends BaseEntity {
  type: ChatMessageType
  role: ChatRole
  content: string
  images?: ChatMessageFile[]
  files?: ChatMessageFile[]
  choices?: string[]
  choiceIndex?: number
}

interface ChatOption {
  model: string
  temperature: number
  topP: number
  maxTokens: number
  presencePenalty: number
  frequencyPenalty: number
  contextSize: number
  autoGenerateSessionName: boolean
}

interface SpeechOption {
  model: string
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
  speed: number
}

interface InternetSearchOption {
  enabled: boolean
}

interface ChatSession extends BaseEntity {
  name: string
  provider: LLMProvider
  messages: ChatMessage[]
  chatOption: ChatOption
  speechOption: SpeechOption
  internetSearchOption: InternetSearchOption
}
