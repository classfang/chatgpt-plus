<script setup lang="ts">
import prompts from '@renderer/assets/json/prompts.json'
</script>

<template>
  <div class="chatgpt-body-prompt"></div>
</template>

<style lang="scss" scoped>
.chatgpt-body-prompt {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $app-padding-base;
}
</style>
