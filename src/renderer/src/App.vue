<script setup lang="ts">
import ChatGPT from '@renderer/components/chatgpt/main/ChatGPT.vue'
import { useInit } from '@renderer/service/init-service'
import { useLocal } from '@renderer/service/local-service'
import { useTheme } from '@renderer/service/theme-service'
import { useTitle } from '@renderer/service/title-service'

// 主题切换
useTheme()

// 本地化
const { elementPlusLocale } = useLocal()

// 应用动态标题
useTitle()

// 应用初始化
useInit()
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
  background-color: var(--el-bg-color);
}
</style>
