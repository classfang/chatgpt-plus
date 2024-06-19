<script setup lang="ts">
// 组件传参
import ChatGPTMessageConsole from '@renderer/components/ChatGPTMessageConsole.vue'

const message = defineModel<ChatMessage>('message', {
  default: () => {}
})
</script>

<template>
  <div class="chatgpt-message-user">
    <div class="message-content select-text">
      <span>{{ message.content }}</span>
      <div v-if="message.images && message.images.length > 0" class="file-list">
        <div v-for="(att, index) in message.images" :key="att.path" class="file-item">
          <el-image
            class="item-image"
            :src="`file://${att.path}`"
            :preview-src-list="message.images.map((a) => `file://${a.path}`)"
            :initial-index="index"
            fit="cover"
          />
        </div>
      </div>
    </div>

    <ChatGPTMessageConsole v-model:message="message" class="message-console" />
  </div>
</template>

<style lang="scss" scoped>
.chatgpt-message-user {
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: $app-padding-small;

  .message-content {
    min-width: 4rem;
    max-width: 80%;
    flex: 1 1 0;
    white-space: pre-wrap;
    line-break: anywhere;
    background-color: var(--el-fill-color);
    box-sizing: border-box;
    padding: $app-padding-small;
    border-radius: calc(1.5rem / 2 + $app-padding-small);
    line-height: 1.3rem;
    display: flex;
    flex-direction: column;
    gap: $app-padding-small;

    .file-list {
      display: flex;
      gap: $app-padding-small;
      flex-wrap: wrap;

      .file-item {
        height: 60px;
        width: 60px;
        position: relative;

        .item-image {
          height: 100%;
          width: 100%;
          border-radius: $app-border-radius-base;
        }

        .item-close-btn {
          height: $app-icon-size-small;
          width: $app-icon-size-small;
          position: absolute;
          top: calc($app-icon-size-small / -2);
          right: calc($app-icon-size-small / -2);
        }
      }
    }
  }

  .message-console {
    opacity: 0;
    transition: opacity $app-transition-base;
    justify-content: flex-end;
  }

  &:hover {
    .message-console {
      opacity: 1;
    }
  }
}
</style>
