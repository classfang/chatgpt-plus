<script setup lang="ts">
import AICalendarButton from '@renderer/components/calendar/button/AICalendarButton.vue'
import NewsButton from '@renderer/components/news/button/NewsButton.vue'
</script>

<template>
  <div class="more-page">
    <AICalendarButton />
    <NewsButton />
  </div>
</template>

<style scoped lang="scss">
.more-page {
  width: 100%;
  box-sizing: border-box;
  padding: $app-padding-extra-small;
  display: flex;
  align-items: center;
  gap: $app-padding-base;
  flex-wrap: wrap;
}
</style>
