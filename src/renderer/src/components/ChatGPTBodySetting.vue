<script setup lang="ts">
import { OpenAIModels, OpenAISpeechModels, OpenAISpeechVoices } from '@renderer/config/OpenAIConfig'
import { useChatSessionStore } from '@renderer/store/chat-session'

// 仓库
const chatSessionStore = useChatSessionStore()

// 组件传参
const visible = defineModel<boolean>('visible', {
  default: () => false
})
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="$t('app.chatgpt.body.header.currentChat.setting')"
    width="700"
  >
    <div class="dialog-body">
      <el-tabs tab-position="left">
        <!-- 对话 -->
        <el-tab-pane :label="$t('app.setting.chat')">
          <el-form label-width="auto">
            <!-- Model -->
            <el-form-item :label="$t('app.setting.item.chat.model')">
              <el-select
                v-model="chatSessionStore.getActiveSession!.chatOption.model"
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
            <el-form-item :label="$t('app.setting.item.chat.temperature')">
              <el-tooltip
                :content="$t('app.setting.item.chat.explain.temperature')"
                placement="right"
              >
                <el-input-number
                  v-model="chatSessionStore.getActiveSession!.chatOption.temperature"
                  :min="0"
                  :max="1"
                  :step="0.1"
                />
              </el-tooltip>
            </el-form-item>

            <!-- Top P -->
            <el-form-item :label="$t('app.setting.item.chat.topP')">
              <el-tooltip :content="$t('app.setting.item.chat.explain.topP')" placement="right">
                <el-input-number
                  v-model="chatSessionStore.getActiveSession!.chatOption.topP"
                  :min="0"
                  :max="1"
                  :step="0.1"
                />
              </el-tooltip>
            </el-form-item>

            <!-- Max Tokens -->
            <el-form-item :label="$t('app.setting.item.chat.maxTokens')">
              <el-tooltip
                :content="$t('app.setting.item.chat.explain.maxTokens')"
                placement="right"
              >
                <el-input-number
                  v-model="chatSessionStore.getActiveSession!.chatOption.maxTokens"
                  :min="1024"
                  :max="1024000"
                  :step="1"
                />
              </el-tooltip>
            </el-form-item>

            <!-- Presence Penalty -->
            <el-form-item :label="$t('app.setting.item.chat.presencePenalty')">
              <el-tooltip
                :content="$t('app.setting.item.chat.explain.presencePenalty')"
                placement="right"
              >
                <el-input-number
                  v-model="chatSessionStore.getActiveSession!.chatOption.presencePenalty"
                  :min="-2"
                  :max="2"
                  :step="0.1"
                />
              </el-tooltip>
            </el-form-item>

            <!-- Frequency Penalty -->
            <el-form-item :label="$t('app.setting.item.chat.frequencyPenalty')">
              <el-tooltip
                :content="$t('app.setting.item.chat.explain.frequencyPenalty')"
                placement="right"
              >
                <el-input-number
                  v-model="chatSessionStore.getActiveSession!.chatOption.frequencyPenalty"
                  :min="-2"
                  :max="2"
                  :step="0.1"
                />
              </el-tooltip>
            </el-form-item>

            <!-- Context Size -->
            <el-form-item :label="$t('app.setting.item.chat.contextSize')">
              <el-tooltip
                :content="$t('app.setting.item.chat.explain.contextSize')"
                placement="right"
              >
                <el-input-number
                  v-model="chatSessionStore.getActiveSession!.chatOption.contextSize"
                  :min="0"
                  :max="100"
                  :step="1"
                />
              </el-tooltip>
            </el-form-item>

            <!-- Auto Generate Title -->
            <el-form-item :label="$t('app.setting.item.chat.autoGenerateSessionName')">
              <el-tooltip
                :content="$t('app.setting.item.chat.explain.autoGenerateSessionName')"
                placement="right"
              >
                <el-switch
                  v-model="chatSessionStore.getActiveSession!.chatOption.autoGenerateSessionName"
                />
              </el-tooltip>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 发音 -->
        <el-tab-pane :label="$t('app.setting.speech')">
          <el-form label-width="auto">
            <!-- Model -->
            <el-form-item :label="$t('app.setting.item.speech.model')">
              <el-select
                v-model="chatSessionStore.getActiveSession!.speechOption.model"
                allow-create
                filterable
              >
                <el-option-group
                  v-for="group in OpenAISpeechModels"
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

            <!-- voice -->
            <el-form-item :label="$t('app.setting.item.speech.voice')">
              <el-select
                v-model="chatSessionStore.getActiveSession!.speechOption.voice"
                allow-create
                filterable
              >
                <el-option
                  v-for="item in OpenAISpeechVoices"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <!-- speed -->
            <el-form-item :label="$t('app.setting.item.speech.speed')">
              <el-input-number
                v-model="chatSessionStore.getActiveSession!.speechOption.speed"
                :min="0.25"
                :max="4.0"
                :step="0.01"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.chatgpt-body-setting {
  .dialog-body {
    height: $app-dialog-height;

    :deep(.el-tabs) {
      height: 100%;

      .el-tabs--right,
      .el-tabs__content,
      .el-tabs--left,
      .el-tabs__content,
      .el-tab-pane {
        height: 100%;
      }
    }

    :deep(.el-tabs__content) {
      box-sizing: border-box;
      padding: $app-padding-extra-small $app-padding-small;
    }
  }
}
</style>
