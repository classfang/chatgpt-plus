<script setup lang="ts">
import AppSetting from '@renderer/components/AppSetting.vue'
import { useAppSettingStore } from '@renderer/store/app-setting'
import { useChatSessionStore } from '@renderer/store/chat-session'
import { startDarkThemeListener } from '@renderer/utils/window-util'
import { useDark } from '@vueuse/core'
import { watch } from 'vue'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// 国际化
const { locale } = useI18n()

// 仓库
const appSettingStore = useAppSettingStore()
const chatSessionStore = useChatSessionStore()

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

onMounted(() => {
  // 更新主题
  updateTheme()
  // 设置语言
  locale.value = appSettingStore.app.locale
})
</script>

<template>
  <div class="app-header drag-area">
    <div class="left-holder"></div>
    <div class="title">
      <div class="active-session-name single-line-ellipsis">
        {{ chatSessionStore.getActiveSession?.name || 'ChatGPT Plus' }}
      </div>
    </div>
    <AppSetting class="no-drag-area" />
  </div>
</template>

<style lang="scss" scoped>
.app-header {
  height: $app-header-height;
  width: 100%;
  background-color: var(--el-fill-color);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 0 $app-padding-base;

  .left-holder {
    width: $app-icon-size-base;
  }

  .title {
    min-width: 0;
    flex: 1 1 0;
    text-align: center;
    font-size: var(--el-font-size-base);
    display: flex;
    align-items: center;
    justify-content: center;

    .active-session-name {
      max-width: 60%;
    }
  }
}
</style>
