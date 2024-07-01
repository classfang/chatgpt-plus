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
      <div
        class="divider-content"
        @mouseenter="mouseEnterFlag = true"
        @mouseleave="mouseEnterFlag = false"
      >
        <transition name="slide-in-top" mode="out-in">
          <div v-if="mouseEnterFlag" class="cancel-btn">
            {{ $t('app.chatgpt.body.message.disconnectedContextCancel') }}
          </div>
          <div v-else>
            {{ $t('app.chatgpt.body.message.disconnectedContext') }}
          </div>
        </transition>
      </div>
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
        overflow-y: hidden;

        .cancel-btn {
          color: var(--el-color-primary);
        }
      }
    }
  }
}
</style>
