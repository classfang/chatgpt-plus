<script setup lang="ts">
import { useAppStateStore } from '@renderer/store/app-state'
import { useChatSessionStore } from '@renderer/store/chat-session'
import { reactive, toRefs } from 'vue'

// 仓库
const chatSessionStore = useChatSessionStore()
const appStateStore = useAppStateStore()

// 组件传参
const message = defineModel<ChatMessage>('message', {
  default: () => {}
})

// 数据绑定
const data = reactive({
  mouseEnterFlag: false
})
const { mouseEnterFlag } = toRefs(data)
</script>

<template>
  <div class="chatgpt-message-divider">
    <el-divider
      class="divider"
      @click="!appStateStore.chatgptLoadingFlag && chatSessionStore.deleteMessage(message.id!)"
    >
      <span
        class="divider-content"
        @mouseenter="mouseEnterFlag = true"
        @mouseleave="mouseEnterFlag = false"
      >
        {{
          mouseEnterFlag
            ? $t('app.chatgpt.body.message.disconnectedContextCancel')
            : $t('app.chatgpt.body.message.disconnectedContext')
        }}
      </span>
    </el-divider>
  </div>
</template>

<style lang="scss" scoped>
.chatgpt-message-divider {
  width: 100%;
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: $app-padding-small;

  .divider {
    :deep(.el-divider__text) {
      background-color: var(--el-fill-color-extra-light);
      color: var(--el-text-color-regular);
      font-size: var(--el-font-size-small);
      padding: 0 $app-padding-base;

      .divider-content {
        cursor: pointer;
      }
    }
  }
}
</style>
