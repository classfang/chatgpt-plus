<script setup lang="ts">
import MoreButton from '@renderer/components/more/button/MoreButton.vue'
import AppSetting from '@renderer/components/setting/AppSetting.vue'
</script>

<template>
  <div class="chatgpt-sidebar-footer-container">
    <AppSetting />
    <MoreButton />
  </div>
</template>

<style lang="scss" scoped>
.chatgpt-sidebar-footer-container {
  height: $app-chatgpt-sidebar-footer-height;
  width: 100%;
  box-sizing: border-box;
  padding: 0 $app-padding-base;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
