<script setup lang="ts">
import { Delete, EditPen, MoreFilled } from '@element-plus/icons-vue'
import { useAppStateStore } from '@renderer/store/app-state'
import { useChatSessionStore } from '@renderer/store/chat-session'
import { nextTick, reactive, ref, toRefs } from 'vue'

// 仓库
const chatSessionStore = useChatSessionStore()
const appStateStore = useAppStateStore()

// ref
const sessionNameInputRef = ref()

// 数据绑定
const data = reactive({
  moreDropdownVisible: false,
  sessionNameEditFlag: false
})
const { moreDropdownVisible, sessionNameEditFlag } = toRefs(data)

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

// 修改会话名称
const editSession = () => {
  if (appStateStore.chatgptLoading) {
    return
  }
  data.sessionNameEditFlag = true
  nextTick(() => {
    sessionNameInputRef.value?.focus()
  })
}
</script>

<template>
  <div
    class="chatgpt-session"
    :class="{ 'chatgpt-session-active': chatSessionStore.activeSessionId === session.id }"
    @click="activeSession()"
  >
    <el-input
      v-if="sessionNameEditFlag"
      ref="sessionNameInputRef"
      v-model="session.name"
      class="session-name"
      @keydown.enter="sessionNameEditFlag = false"
      @blur="sessionNameEditFlag = false"
    />
    <div v-else class="session-name single-line-ellipsis">
      {{ session.name }}
    </div>
    <el-dropdown
      trigger="click"
      :disabled="appStateStore.chatgptLoading"
      @visible-change="(visible: boolean) => (moreDropdownVisible = visible)"
    >
      <MoreFilled
        class="more-icon"
        :class="{
          'more-icon-active': moreDropdownVisible,
          'more-icon-hidden': sessionNameEditFlag
        }"
        @click.stop
      />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item :icon="EditPen" @click="editSession()">
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

<style lang="scss" scoped>
.chatgpt-session {
  width: 100%;
  flex-shrink: 0;
  box-sizing: border-box;
  padding: $app-padding-small;
  border-radius: $app-border-radius-base;
  background-color: var(--el-fill-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: var(--el-fill-color-dark);

    .more-icon {
      width: $app-icon-size-small;
      padding-left: $app-padding-small;
    }
  }

  &-active {
    background-color: var(--el-fill-color-darker) !important;

    .more-icon {
      width: $app-icon-size-small !important;
      padding-left: $app-padding-small;
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
      padding-left: $app-padding-small;
    }

    &-hidden {
      width: 0 !important;
      padding-left: 0 !important;
    }
  }
}
</style>
