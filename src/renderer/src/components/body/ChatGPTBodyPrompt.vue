<script setup lang="ts">
import prompts from '@renderer/assets/json/prompts.json'
import { useAppSettingStore } from '@renderer/store/app-setting'
import { getRandomElements } from '@renderer/utils/array-util'

// 仓库
const appSettingStore = useAppSettingStore()
</script>

<template>
  <div class="chatgpt-body-prompt">
    <div
      v-for="p in getRandomElements(prompts[appSettingStore.app.locale], 4)"
      :key="p[0]"
      class="prompt-item"
    >
      {{ p[0] }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chatgpt-body-prompt {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: $app-padding-base;
  font-size: var(--el-font-size-base);

  .prompt-item {
    padding: $app-padding-extra-small $app-padding-small;
    border-radius: $app-border-radius-base;
    background-color: var(--el-fill-color);
    color: var(--el-text-color-secondary);
    cursor: pointer;
    transition: all $app-transition-base;

    &:hover {
      background-color: var(--el-fill-color-dark);
      color: var(--el-text-color);
    }
  }
}
</style>
