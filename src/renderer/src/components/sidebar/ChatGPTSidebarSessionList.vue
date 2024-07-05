<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import ChatGPTSidebarSession from '@renderer/components/sidebar/ChatGPTSidebarSession.vue'
import { useAppStateStore } from '@renderer/store/app-state'
import { useChatSessionStore } from '@renderer/store/chat-session'
import dayjs from 'dayjs'
import { computed, nextTick, onMounted, reactive, ref, toRefs } from 'vue'

// 仓库
const chatSessionStore = useChatSessionStore()
const appStateStore = useAppStateStore()

// ref
const sessionListScrollbarRef = ref()

// 数据绑定
const data = reactive({
  sessionKeyword: ''
})
const { sessionKeyword } = toRefs(data)

// 计算日期标签
const dateFlagMap = computed(() => {
  const map = new Map<number, string>()

  // 动态获取今天
  const today = dayjs(appStateStore.dayKey)

  map.set(
    chatSessionStore.getUsedSessions.findIndex(
      (s) => dayjs(s.createTime).format('YYYY-MM-DD') === today.format('YYYY-MM-DD')
    ),
    'today'
  )

  map.set(
    chatSessionStore.getUsedSessions.findIndex(
      (s) => dayjs(s.createTime).format('YYYY-MM-DD') === today.add(-1, 'day').format('YYYY-MM-DD')
    ),
    'yesterday'
  )

  map.set(
    chatSessionStore.getUsedSessions.findIndex(
      (s) =>
        dayjs(s.createTime).format('YYYY') === today.format('YYYY') &&
        dayjs(s.createTime).isBefore(today.add(-1, 'day'), 'day') &&
        dayjs(s.createTime).isAfter(today.add(-7, 'day'), 'day')
    ),
    'previous7'
  )

  map.set(
    chatSessionStore.getUsedSessions.findIndex(
      (s) =>
        dayjs(s.createTime).format('YYYY') === today.format('YYYY') &&
        dayjs(s.createTime).isBefore(today.add(-7, 'day'), 'day') &&
        dayjs(s.createTime).isAfter(today.add(-30, 'day'), 'day')
    ),
    'previous30'
  )

  map.set(
    chatSessionStore.getUsedSessions.findIndex(
      (s) =>
        dayjs(s.createTime).format('YYYY') === today.format('YYYY') &&
        dayjs(s.createTime).isBefore(today.add(-30, 'day'), 'day') &&
        dayjs(s.createTime).get('month') === 0
    ),
    'january'
  )

  map.set(
    chatSessionStore.getUsedSessions.findIndex(
      (s) =>
        dayjs(s.createTime).format('YYYY') === today.format('YYYY') &&
        dayjs(s.createTime).isBefore(today.add(-30, 'day'), 'day') &&
        dayjs(s.createTime).get('month') === 1
    ),
    'february'
  )

  map.set(
    chatSessionStore.getUsedSessions.findIndex(
      (s) =>
        dayjs(s.createTime).format('YYYY') === today.format('YYYY') &&
        dayjs(s.createTime).isBefore(today.add(-30, 'day'), 'day') &&
        dayjs(s.createTime).get('month') === 2
    ),
    'march'
  )

  map.set(
    chatSessionStore.getUsedSessions.findIndex(
      (s) =>
        dayjs(s.createTime).format('YYYY') === today.format('YYYY') &&
        dayjs(s.createTime).isBefore(today.add(-30, 'day'), 'day') &&
        dayjs(s.createTime).get('month') === 3
    ),
    'april'
  )

  map.set(
    chatSessionStore.getUsedSessions.findIndex(
      (s) =>
        dayjs(s.createTime).format('YYYY') === today.format('YYYY') &&
        dayjs(s.createTime).isBefore(today.add(-30, 'day'), 'day') &&
        dayjs(s.createTime).get('month') === 4
    ),
    'may'
  )

  map.set(
    chatSessionStore.getUsedSessions.findIndex(
      (s) =>
        dayjs(s.createTime).format('YYYY') === today.format('YYYY') &&
        dayjs(s.createTime).isBefore(today.add(-30, 'day'), 'day') &&
        dayjs(s.createTime).get('month') === 5
    ),
    'june'
  )

  map.set(
    chatSessionStore.getUsedSessions.findIndex(
      (s) =>
        dayjs(s.createTime).format('YYYY') === today.format('YYYY') &&
        dayjs(s.createTime).isBefore(today.add(-30, 'day'), 'day') &&
        dayjs(s.createTime).get('month') === 6
    ),
    'july'
  )

  map.set(
    chatSessionStore.getUsedSessions.findIndex(
      (s) =>
        dayjs(s.createTime).format('YYYY') === today.format('YYYY') &&
        dayjs(s.createTime).isBefore(today.add(-30, 'day'), 'day') &&
        dayjs(s.createTime).get('month') === 7
    ),
    'august'
  )

  map.set(
    chatSessionStore.getUsedSessions.findIndex(
      (s) =>
        dayjs(s.createTime).format('YYYY') === today.format('YYYY') &&
        dayjs(s.createTime).isBefore(today.add(-30, 'day'), 'day') &&
        dayjs(s.createTime).get('month') === 8
    ),
    'september'
  )

  map.set(
    chatSessionStore.getUsedSessions.findIndex(
      (s) =>
        dayjs(s.createTime).format('YYYY') === today.format('YYYY') &&
        dayjs(s.createTime).isBefore(today.add(-30, 'day'), 'day') &&
        dayjs(s.createTime).get('month') === 9
    ),
    'october'
  )

  map.set(
    chatSessionStore.getUsedSessions.findIndex(
      (s) =>
        dayjs(s.createTime).format('YYYY') === today.format('YYYY') &&
        dayjs(s.createTime).isBefore(today.add(-30, 'day'), 'day') &&
        dayjs(s.createTime).get('month') === 10
    ),
    'november'
  )

  map.set(
    chatSessionStore.getUsedSessions.findIndex(
      (s) =>
        dayjs(s.createTime).format('YYYY') === today.format('YYYY') &&
        dayjs(s.createTime).isBefore(today.add(-30, 'day'), 'day') &&
        dayjs(s.createTime).get('month') === 11
    ),
    'december'
  )

  map.set(
    chatSessionStore.getUsedSessions.findIndex((s) => dayjs(s.createTime).isBefore(today, 'year')),
    'earlier'
  )

  return map
})

// 滚动到顶部
const scrollToTop = () => {
  sessionListScrollbarRef.value?.setScrollTop(0)
}

// 暴露方法
defineExpose({
  scrollToTop
})

onMounted(() => {
  nextTick(() => {
    // 当前会话进入视窗
    document.querySelector('.chatgpt-session-active')?.scrollIntoView(false)
  })
})
</script>

<template>
  <div class="chatgpt-session-list">
    <div class="chatgpt-session-list-search">
      <el-input
        v-model="sessionKeyword"
        :prefix-icon="Search"
        :placeholder="$t('app.common.search')"
      />
    </div>
    <el-scrollbar ref="sessionListScrollbarRef" class="chatgpt-session-list-scrollbar">
      <div class="session-list">
        <template
          v-for="(s, index) in chatSessionStore.getUsedSessions.filter(
            (session) =>
              session.name.includes(sessionKeyword) ||
              session.messages.findIndex((m) => m.content.includes(sessionKeyword)) > -1
          )"
          :key="s.id"
        >
          <!-- 日期标签 -->
          <div v-if="dateFlagMap.get(index)" class="date-flag">
            {{ $t('app.chatgpt.sidebar.session.dateFlag.' + dateFlagMap.get(index)) }}
          </div>

          <!-- 会话 -->
          <ChatGPTSidebarSession :session="s" />
        </template>

        <!-- 空底部，用于占位 -->
        <div></div>
      </div>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.chatgpt-session-list {
  height: calc(100% - $app-chatgpt-sidebar-header-height - $app-chatgpt-sidebar-footer-height);

  .chatgpt-session-list-search {
    height: $app-chatgpt-sidebar-search-height;
    padding: 0 $app-padding-base;
    display: flex;
    align-items: center;
    justify-content: center;

    :deep(.el-input) {
      .el-input__wrapper {
        background-color: var(--el-fill-color);
        box-shadow: 0 0 0 1px var(--el-fill-color-dark);
        border-radius: $app-border-radius-base;
        transition: all $app-transition-base;
      }

      .is-focus {
        background-color: var(--el-fill-color-dark);
        box-shadow: 0 0 0 1px var(--el-fill-color-darker);
      }
    }
  }

  .chatgpt-session-list-scrollbar {
    height: calc(100% - $app-chatgpt-sidebar-search-height);
    width: 100%;

    .session-list {
      min-height: 0;
      flex: 1 1 0;
      width: 100%;
      box-sizing: border-box;
      padding: $app-padding-base $app-padding-base 0 $app-padding-base;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $app-padding-extra-small;

      .date-flag {
        width: 100%;
        color: var(--el-text-color-secondary);
        font-size: var(--el-font-size-small);
        line-height: $app-line-height-min;
        margin: $app-padding-extra-small 0;
      }
    }
  }
}
</style>
