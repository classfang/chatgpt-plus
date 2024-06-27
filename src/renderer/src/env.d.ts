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
  saveName: string
  extname: string
  size?: number
}

interface ChatMessageChoose {
  content: string
  images?: ChatMessageFile[]
  searchItems?: InternetSearchResultItem[]
}

interface InternetSearchResultItem {
  title: string
  snippet: string
  link: string
  displayLink: string
}

interface ChatMessage extends BaseEntity {
  type: ChatMessageType
  role: ChatRole
  content: string
  images?: ChatMessageFile[]
  files?: ChatMessageFile[]
  searchItems?: InternetSearchResultItem[]
  choices?: ChatMessageChoose[]
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

interface TextToImageOption {
  enabled: boolean
  model: string
  n: number
  quality: 'standard' | 'hd'
  size: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792'
  style: 'vivid' | 'natural'
}

interface InternetSearchOption {
  enabled: boolean
  google: {
    baseUrl: string
    key: string
    cx: string
  }
}

interface MemoryOption {
  enabled: boolean
}

interface ChatMemory extends BaseEntity {
  content: string
}

interface ChatSession extends BaseEntity {
  name: string
  provider: LLMProvider
  messages: ChatMessage[]
  chatOption: ChatOption
  speechOption: SpeechOption
  textToImageOption: TextToImageOption
  memoryOption: MemoryOption
  internetSearchOption: InternetSearchOption
}
