<script setup lang="ts">
import { Reading } from '@element-plus/icons-vue'
import NewsPage from '@renderer/components/news/main/NewsPage.vue'
import { reactive, toRefs } from 'vue'

// 数据绑定
const data = reactive({
  drawerVisible: false
})
const { drawerVisible } = toRefs(data)
</script>

<template>
  <div>
    <div class="news-button" @click="drawerVisible = true">
      <Reading class="news-button-icon" />
      <div>{{ $t('app.news.title') }}</div>
    </div>
    <el-drawer
      v-model="drawerVisible"
      :title="$t('app.news.title')"
      size="100%"
      direction="btt"
      class="news-page-drawer"
      destroy-on-close
    >
      <NewsPage />
    </el-drawer>
  </div>
</template>

<style scoped lang="scss">
.news-button {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: $app-padding-small;
  color: var(--el-text-color-regular);
  cursor: pointer;
  transition: all $app-transition-base;

  &:hover {
    color: var(--el-text-color-primary);
  }

  .news-button-icon {
    height: $app-icon-size-small;
  }
}

:deep(.news-page-drawer) {
  .el-drawer__header {
    margin-bottom: 0;
  }
}
</style>
