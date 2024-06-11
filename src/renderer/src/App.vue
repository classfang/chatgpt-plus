<script setup lang="ts">
import AppHeader from '@renderer/components/AppHeader.vue'
import ChatGPT from '@renderer/components/ChatGPT.vue'
import { useAppSettingStore } from '@renderer/store/app-setting'
import en from 'element-plus/es/locale/lang/en'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { computed } from 'vue'

// 仓库
const appSettingStore = useAppSettingStore()

// Element Plus 国际化
const elementPlusLocales = {
  zh_CN: zhCn,
  en_US: en
}

// Element Plus 当前语言
const elementPlusLocale = computed(() => {
  return elementPlusLocales[appSettingStore.app.locale]
})
</script>

<template>
  <el-config-provider :locale="elementPlusLocale">
    <div class="app">
      <AppHeader />
      <ChatGPT />
    </div>
  </el-config-provider>
</template>

<style lang="scss">
.app {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: var(--el-bg-color);
}
</style>
