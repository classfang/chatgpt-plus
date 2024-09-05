<script setup lang="ts"></script>

<template>
  <div class="news-page">
    <webview class="webview" src="https://openai.com/news/" allowpopups />
  </div>
</template>

<style scoped lang="scss">
.news-page {
  height: 100%;
  width: 100%;
  border-radius: $app-border-radius-base;
  overflow: hidden;

  .webview {
    height: 100%;
    background-color: var(--el-fill-color-light);
  }
}
</style>
