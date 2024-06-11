<script setup lang="ts">
import { Setting } from '@element-plus/icons-vue'
import AppSetting from '@renderer/components/AppSetting.vue'
import { useAppSettingStore } from '@renderer/store/app-setting'
import { startDarkThemeListener } from '@renderer/utils/window-util'
import { useDark } from '@vueuse/core'
import { reactive, toRefs, watch } from 'vue'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// 国际化
const { locale } = useI18n()

// 仓库
const appSettingStore = useAppSettingStore()

// 是否是黑暗模式
const isDark = useDark()

// 数据绑定
const data = reactive({
  appSettingVisible: false
})
const { appSettingVisible } = toRefs(data)

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
    <div class="title">ChatGPT Plus</div>
    <Setting class="setting-icon no-drag-area" @click="appSettingVisible = true" />
    <AppSetting v-model:visible="appSettingVisible" />
  </div>
</template>

<style lang="scss">
.app-header {
  height: 30px;
  width: 100%;
  background-color: var(--el-fill-color);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 0 10px;

  .left-holder {
    width: 18px;
  }

  .title {
    min-width: 0;
    flex-grow: 1;
    text-align: center;
    font-size: var(--el-font-size-small);
  }

  .setting-icon {
    height: 18px;
    width: 18px;
  }
}
</style>
