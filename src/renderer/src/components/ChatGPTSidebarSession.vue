<script setup lang="ts">
import { Delete, EditPen, MoreFilled } from '@element-plus/icons-vue'
import { useAppStateStore } from '@renderer/store/app-state'
import { useChatSessionStore } from '@renderer/store/chat-session'
import { reactive, toRefs } from 'vue'

// 仓库
const chatSessionStore = useChatSessionStore()
const appStateStore = useAppStateStore()

// 数据绑定
const data = reactive({
  moreDropdownVisible: false
})
const { moreDropdownVisible } = toRefs(data)

// 组件传参
const session = defineModel<ChatSession>('session', {
  default: () => {}
})

// 切换会话
const activeSession = () => {
  if (appStateStore.chatgptLoading) {
    return
  }
  chatSessionStore.activeSessionId = session.value.id!
}

// 删除会话
const deleteSession = () => {
  if (appStateStore.chatgptLoading) {
    return
  }
  chatSessionStore.delete(session.value.id!)
}
</script>

<template>
  <div
    v-if="session.messages.length > 0"
    class="chatgpt-session-session"
    :class="{ 'chatgpt-session-session-active': chatSessionStore.activeSessionId === session.id }"
    @click="activeSession()"
  >
    <div class="session-name single-line-ellipsis">{{ session.name }}</div>
    <el-dropdown
      trigger="click"
      :disabled="appStateStore.chatgptLoading"
      @visible-change="(visible: boolean) => (moreDropdownVisible = visible)"
    >
      <MoreFilled
        class="more-icon"
        :class="{ 'more-icon-active': moreDropdownVisible }"
        @click.stop
      />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item :icon="EditPen">
            {{ $t('app.chatgpt.sidebar.session.more.editName') }}
          </el-dropdown-item>
          <el-dropdown-item :icon="Delete" @click="deleteSession()">
            {{ $t('app.chatgpt.sidebar.session.more.delete') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="scss">
.chatgpt-session-session {
  width: 100%;
  flex-shrink: 0;
  box-sizing: border-box;
  padding: $app-padding-base;
  border-radius: $app-border-radius-base;
  cursor: pointer;
  display: flex;
  gap: $app-padding-base;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: var(--el-fill-color-dark);

    .more-icon {
      width: $app-icon-size-small;
    }
  }

  &-active {
    background-color: var(--el-fill-color-darker) !important;

    .more-icon {
      width: $app-icon-size-small !important;
    }
  }

  .session-name {
    min-width: 0;
    flex: 1 1 0;
  }

  .more-icon {
    height: $app-icon-size-small;
    width: 0;
    outline: none;

    &-active {
      width: $app-icon-size-small !important;
    }
  }
}
</style>
