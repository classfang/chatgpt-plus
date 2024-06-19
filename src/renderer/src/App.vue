<script setup lang="ts">
import ChatGPT from '@renderer/components/ChatGPT.vue'
import { useAppSettingStore } from '@renderer/store/app-setting'
import { useChatSessionStore } from '@renderer/store/chat-session'
import { setThemeSource } from '@renderer/utils/ipc-util'
import { startDarkThemeListener } from '@renderer/utils/window-util'
import { useDark } from '@vueuse/core'
import en from 'element-plus/es/locale/lang/en'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// 仓库
const appSettingStore = useAppSettingStore()
const chatSessionStore = useChatSessionStore()

// 国际化
const { locale } = useI18n()

// Element Plus 国际化
const elementPlusLocales = {
  zh_CN: zhCn,
  en_US: en
}

// Element Plus 当前语言
const elementPlusLocale = computed(() => {
  return elementPlusLocales[appSettingStore.app.locale]
})

// 是否是黑暗模式
const isDark = useDark()

// 主题设置监听
let stopDarkThemeListener: any = null
watch(
  () => appSettingStore.app.themeModel,
  () => {
    updateTheme()
  }
)

// 更新主题
const updateTheme = () => {
  if (stopDarkThemeListener) {
    stopDarkThemeListener()
  }

  // 设置主进程主题
  setThemeSource(['system', 'light', 'dark'].at(appSettingStore.app.themeModel))

  // 跟随系统
  if (appSettingStore.app.themeModel === 0) {
    stopDarkThemeListener = startDarkThemeListener((isDarkValue: boolean) => {
      isDark.value = isDarkValue
    })
  } else {
    // 切换样式
    isDark.value = appSettingStore.app.themeModel === 2
  }
}

// 语言设置监听
watch(
  () => appSettingStore.app.locale,
  (lang) => {
    locale.value = lang
  }
)

// 设置会话名称为标题
const setSessionNameTitle = () => {
  document.title = chatSessionStore.getActiveSession?.name || 'ChatGPT Plus'
}

// 监听标题
watch(
  () => chatSessionStore.getActiveSession?.name,
  () => {
    setSessionNameTitle()
  }
)

onMounted(() => {
  // 更新主题
  updateTheme()
  // 设置语言
  locale.value = appSettingStore.app.locale
  // 设置标题
  setSessionNameTitle()
})
</script>

<template>
  <el-config-provider :locale="elementPlusLocale">
    <div class="app">
      <ChatGPT />
    </div>
  </el-config-provider>
</template>

<style lang="scss" scoped>
.app {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: var(--el-bg-color);
}
</style>
