import { isZH } from '@renderer/utils/window-util'
import { defineStore } from 'pinia'

export const useAppSettingStore = defineStore({
  id: 'app-setting',
  state: () => ({
    app: {
      // 主题模式：0自动 1明亮 2黑暗
      themeModel: 0,
      // 本地化
      locale: isZH() ? 'zh_CN' : 'en_US',
      // 网络代理
      proxy: ''
    },
    // https://platform.openai.com/docs/api-reference/chat/create
    openAI: {
      // 服务配置
      baseUrl: 'https://api.openai.com/v1',
      apiKey: '',

      // 对话配置
      chatOption: {
        model: 'gpt-4o',
        temperature: 1,
        topP: 1,
        maxTokens: 4096,
        presencePenalty: 0,
        frequencyPenalty: 0,
        contextSize: 5,
        autoGenerateSessionName: true
      },

      // 发音配置
      speechOption: {
        model: 'tts-1',
        voice: 'alloy',
        speed: 1
      } as SpeechOption,

      // 文生图配置
      textToImageOption: {
        enabled: false,
        model: 'dall-e-3',
        n: 1,
        quality: 'standard',
        size: '1024x1024',
        style: 'vivid'
      } as TextToImageOption
    },
    chatgpt: {
      sidebarVisible: true
    },
    internetSearchOption: {
      enabled: false,
      google: {
        baseUrl: 'https://www.googleapis.com/customsearch/v1',
        key: '',
        cx: ''
      }
    }
  }),
  getters: {
    getStoreJson(): string {
      return JSON.stringify({
        app: this.app,
        openAI: this.openAI,
        chatgpt: this.chatgpt,
        internetSearchOption: this.internetSearchOption
      })
    }
  },
  actions: {
    setStoreFromJson(jsonStr: string) {
      let importFlag = false
      if (!jsonStr) {
        return importFlag
      }
      const json = JSON.parse(jsonStr)
      if (json.app !== undefined) {
        this.app = json.app
        importFlag = true
      }
      if (json.openAI !== undefined) {
        this.openAI = json.openAI
        importFlag = true
      }
      if (json.chatgpt !== undefined) {
        this.chatgpt = json.chatgpt
        importFlag = true
      }
      if (json.internetSearchOption !== undefined) {
        this.internetSearchOption = json.internetSearchOption
        importFlag = true
      }
      return importFlag
    }
  },
  persist: true
})
