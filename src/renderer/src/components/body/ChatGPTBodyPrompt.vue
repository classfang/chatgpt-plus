<script setup lang="ts">
import { MoreFilled } from '@element-plus/icons-vue'
import prompts from '@renderer/assets/json/prompts.json'
import { useAppSettingStore } from '@renderer/store/app-setting'
import { getRandomElements } from '@renderer/utils/array-util'

// 仓库
const appSettingStore = useAppSettingStore()

// 事件
const emits = defineEmits(['use-prompt'])
</script>

<template>
  <div class="chatgpt-body-prompt">
    <div
      v-for="p in getRandomElements(prompts[appSettingStore.app.locale], 4)"
      :key="p[0]"
      class="prompt-item"
      @click="emits('use-prompt', p[1])"
    >
      {{ p[0] }}
    </div>
    <div class="prompt-item">
      <el-icon>
        <MoreFilled />
      </el-icon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chatgpt-body-prompt {
  width: 100%;
  box-sizing: border-box;
  padding: 0 $app-padding-base;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: $app-padding-base;
  font-size: var(--el-font-size-base);

  .prompt-item {
    height: 30px;
    box-sizing: border-box;
    padding: 0 $app-padding-small;
    border-radius: $app-border-radius-base;
    background-color: var(--el-fill-color);
    color: var(--el-text-color-secondary);
    cursor: pointer;
    transition: all $app-transition-base;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: var(--el-fill-color-dark);
      color: var(--el-text-color);
    }
  }
}
</style>
