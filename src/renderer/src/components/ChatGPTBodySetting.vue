<script setup lang="ts">
import { OpenAIModels } from '@renderer/config/OpenAIConfig'
import { useChatSessionStore } from '@renderer/store/chat-session'

// 仓库
const chatSessionStore = useChatSessionStore()

// 组件传参
const visible = defineModel<boolean>('visible', {
  default: () => false
})
</script>

<template>
  <div class="chatgpt-body-setting">
    <el-dialog
      v-model="visible"
      :title="$t('app.chatgpt.body.header.currentChat.setting')"
      width="700"
    >
      <div class="dialog-body">
        <el-scrollbar height="100%">
          <el-form label-width="auto">
            <!-- Model -->
            <el-form-item :label="$t('app.setting.item.openai.model')">
              <el-select
                v-model="chatSessionStore.getActiveSession!.model"
                size="small"
                allow-create
                filterable
              >
                <el-option-group
                  v-for="group in OpenAIModels"
                  :key="group.label"
                  :label="group.label"
                >
                  <el-option
                    v-for="item in group.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-option-group>
              </el-select>
            </el-form-item>

            <!-- Temperature -->
            <el-form-item :label="$t('app.setting.item.openai.temperature')">
              <el-tooltip
                :content="$t('app.setting.item.openai.explain.temperature')"
                placement="right"
              >
                <el-input-number
                  v-model="chatSessionStore.getActiveSession!.temperature"
                  :min="0"
                  :max="1"
                  :step="0.1"
                  size="small"
                />
              </el-tooltip>
            </el-form-item>

            <!-- Top P -->
            <el-form-item :label="$t('app.setting.item.openai.topP')">
              <el-tooltip :content="$t('app.setting.item.openai.explain.topP')" placement="right">
                <el-input-number
                  v-model="chatSessionStore.getActiveSession!.topP"
                  :min="0"
                  :max="1"
                  :step="0.1"
                  size="small"
                />
              </el-tooltip>
            </el-form-item>

            <!-- Max Tokens -->
            <el-form-item :label="$t('app.setting.item.openai.maxTokens')">
              <el-tooltip
                :content="$t('app.setting.item.openai.explain.maxTokens')"
                placement="right"
              >
                <el-input-number
                  v-model="chatSessionStore.getActiveSession!.maxTokens"
                  :min="1024"
                  :max="1024000"
                  :step="1"
                  size="small"
                />
              </el-tooltip>
            </el-form-item>

            <!-- Presence Penalty -->
            <el-form-item :label="$t('app.setting.item.openai.presencePenalty')">
              <el-tooltip
                :content="$t('app.setting.item.openai.explain.presencePenalty')"
                placement="right"
              >
                <el-input-number
                  v-model="chatSessionStore.getActiveSession!.presencePenalty"
                  :min="-2"
                  :max="2"
                  :step="0.1"
                  size="small"
                />
              </el-tooltip>
            </el-form-item>

            <!-- Frequency Penalty -->
            <el-form-item :label="$t('app.setting.item.openai.frequencyPenalty')">
              <el-tooltip
                :content="$t('app.setting.item.openai.explain.frequencyPenalty')"
                placement="right"
              >
                <el-input-number
                  v-model="chatSessionStore.getActiveSession!.frequencyPenalty"
                  :min="-2"
                  :max="2"
                  :step="0.1"
                  size="small"
                />
              </el-tooltip>
            </el-form-item>

            <!-- Context Size -->
            <el-form-item :label="$t('app.setting.item.openai.contextSize')">
              <el-tooltip
                :content="$t('app.setting.item.openai.explain.contextSize')"
                placement="right"
              >
                <el-input-number
                  v-model="chatSessionStore.getActiveSession!.contextSize"
                  :min="0"
                  :max="100"
                  :step="1"
                  size="small"
                />
              </el-tooltip>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.chatgpt-body-setting {
  .dialog-body {
    height: $app-dialog-height;
  }
}
</style>
