<script setup lang="ts">
import NewsButton from '@renderer/components/news/button/NewsButton.vue'
</script>

<template>
  <div class="chatgpt-sidebar-menu">
    <NewsButton />
  </div>
</template>

<style scoped lang="scss">
.chatgpt-sidebar-menu {
  width: 100%;
  box-sizing: border-box;
  padding: 0 $app-padding-base;
  display: flex;
  flex-direction: column;
  gap: $app-padding-small;
}
</style>
