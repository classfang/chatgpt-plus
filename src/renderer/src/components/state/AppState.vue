<script setup lang="ts">
import { useAppSettingStore } from '@renderer/store/app-setting'
import { useAppStateStore } from '@renderer/store/app-state'

// 仓库
const appStateStore = useAppStateStore()
const appSettingStore = useAppSettingStore()
</script>

<template>
  <div class="app-state">
    <template v-if="!appSettingStore.openAI.apiKey">
      {{ $t('app.state.openAIApiKeyMiss') }}
    </template>
    <template v-else-if="appStateStore.chatgptAnswering">
      {{ $t('app.state.chatgptAnswering') }}
    </template>
    <template v-else>
      {{ $t('app.state.default') }}
    </template>
  </div>
</template>

<style lang="scss" scoped>
.app-state {
  font-size: var(--el-font-size-small);
}
</style>
