<script setup lang="ts">
import chatgptAvatar from '@renderer/assets/image/chatgpt-avatar.png'
</script>

<template>
  <div class="chatgpt-body-empty">
    <el-avatar :size="50" :src="chatgptAvatar" />
    <div>{{ $t('app.chatgpt.body.empty.content') }}</div>
  </div>
</template>

<style lang="scss" scoped>
.chatgpt-body-empty {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $app-padding-large;
  font-size: var(--el-font-size-large);
}
</style>
