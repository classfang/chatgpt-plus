<script setup lang="ts">
import { useChatSessionStore } from '@renderer/store/chat-session'

// 仓库
const chatSessionStore = useChatSessionStore()
</script>

<template>
  <el-scrollbar class="session-list-scrollbar">
    <div class="session-list">
      <template v-for="s in chatSessionStore.sessions" :key="s.id">
        <div v-if="s.messages.length > 0" class="session-item">
          {{ s.id }}
        </div>
      </template>
    </div>
  </el-scrollbar>
</template>

<style lang="scss">
.session-list-scrollbar {
  height: calc(100% - $app-chatgpt-sidebar-header-height);
  width: 100%;

  .session-list {
    min-height: 0;
    flex-grow: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $app-padding-base;
  }
}
</style>
