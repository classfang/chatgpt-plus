<script setup lang="ts">
// 组件传参
defineProps({
  minRows: {
    type: Number,
    default: 1
  }
})
const content = defineModel<string>('content', {
  default: () => ''
})
</script>

<template>
  <div class="note-editor">
    <el-input
      v-model="content"
      type="textarea"
      :placeholder="$t('app.calendar.note.placeholder')"
      :autosize="{ minRows }"
      resize="none"
    />
  </div>
</template>

<style scoped lang="scss">
.note-editor {
  :deep(.el-textarea) {
    .el-textarea__inner {
      box-shadow: none;
    }
  }
}
</style>
