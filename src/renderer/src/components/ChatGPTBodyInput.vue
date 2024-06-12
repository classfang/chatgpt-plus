<script setup lang="ts">
import { Top } from '@element-plus/icons-vue'
import { reactive, toRefs } from 'vue'

// 数据绑定
const data = reactive({
  question: ''
})
const { question } = toRefs(data)
</script>

<template>
  <div class="chatgpt-body-input">
    <el-input
      v-model="question"
      type="textarea"
      size="large"
      :placeholder="$t('app.chatgpt.body.input.question.placeholder')"
      class="question-input"
    />
    <Top
      class="question-input-btn"
      :class="{ 'question-input-btn-available': question.trim().length > 0 }"
    />
  </div>
</template>

<style lang="scss">
.chatgpt-body-input {
  width: 100%;
  box-sizing: border-box;
  padding: $app-padding-base;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $app-padding-base;

  .question-input {
    min-width: 0;
    flex: 1 1 0;

    .el-input__wrapper {
      border-radius: var(--el-border-radius-round);
      box-shadow: none;
      background-color: var(--el-fill-color);
    }
  }

  .question-input-btn {
    background-color: var(--el-fill-color);
    height: $app-icon-size-large;
    width: $app-icon-size-large;
    border-radius: var(--el-border-radius-round);
    box-sizing: border-box;
    padding: $app-padding-base;
    transition: background-color $app-transition-base;

    &-available {
      background-color: var(--el-fill-color-darker);
      cursor: pointer;
    }
  }
}
</style>
