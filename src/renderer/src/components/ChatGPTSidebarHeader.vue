<script setup lang="ts">
import { Edit, Expand, Fold } from '@element-plus/icons-vue'
import { useAppSettingStore } from '@renderer/store/app-setting'
import { useAppStateStore } from '@renderer/store/app-state'
import { useChatSessionStore } from '@renderer/store/chat-session'
import { onMounted, watch } from 'vue'

// 仓库
const appSettingStore = useAppSettingStore()
const chatSessionStore = useChatSessionStore()
const appStateStore = useAppStateStore()

// 创建会话
const createSession = () => {
  if (appStateStore.chatgptLoading) {
    return
  }
  chatSessionStore.create({
    ...appSettingStore.openAI
  })
}

// 监听当前激活会话，自动创建会话
watch(
  () => chatSessionStore.activeSessionId,
  () => {
    if (!chatSessionStore.activeSessionId) {
      createSession()
    }
  }
)

onMounted(() => {
  // 创建初始会话
  if (chatSessionStore.sessions.length === 0) {
    createSession()
  }
})
</script>

<template>
  <div class="chatgpt-sidebar-header-container">
    <div
      class="sidebar-header"
      :class="{ 'sidebar-header-visible': appSettingStore.chatgpt.sidebarVisible }"
    >
      <Fold
        v-if="appSettingStore.chatgpt.sidebarVisible"
        class="sidebar-fold-icon"
        @click="appSettingStore.chatgpt.sidebarVisible = false"
      />
      <Expand
        v-else
        class="sidebar-expand-icon"
        @click="appSettingStore.chatgpt.sidebarVisible = true"
      />
      <Edit class="session-create-icon" @click="createSession()" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chatgpt-sidebar-header-container {
  height: $app-chatgpt-sidebar-header-height;
  width: 100%;

  .sidebar-header {
    height: $app-chatgpt-sidebar-header-height;
    width: calc($app-icon-size-base * 2 + $app-padding-base * 3);
    transition: width $app-transition-base;
    box-sizing: border-box;
    padding: 0 $app-padding-base;
    position: absolute;
    top: $app-header-height;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &-visible {
      width: $app-chatgpt-sidebar-width;
    }

    .sidebar-fold-icon,
    .sidebar-expand-icon,
    .session-create-icon {
      height: $app-icon-size-base;
      width: $app-icon-size-base;
    }
  }
}
</style>
