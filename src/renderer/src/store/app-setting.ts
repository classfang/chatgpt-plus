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
      model: 'gpt-4o',
      temperature: 1,
      topP: 1,
      maxTokens: 4096,
      presencePenalty: 0,
      frequencyPenalty: 0,
      contextSize: 5,

      // 功能配置
      autoGenerateSessionName: true
    },
    chatgpt: {
      sidebarVisible: true
    }
  }),
  persist: true
})
