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
    openAI: {
      baseUrl: 'https://api.openai.com/v1',
      key: ''
    }
  }),
  persist: true
})
