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
    <template v-else-if="appStateStore.loadFileFlag">
      {{ $t('app.state.loadFileFlag') }}
    </template>
    <template v-else-if="appStateStore.readWebFlag">
      {{ $t('app.state.readWebFlag') }}
    </template>
    <template v-else-if="appStateStore.currentToolName">
      {{ $t(`app.state.currentTool.${appStateStore.currentToolName}`) }}
    </template>
    <template v-else-if="appStateStore.chatgptAnswerFlag">
      {{ $t('app.state.chatgptAnswerFlag') }}
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
