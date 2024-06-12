<script setup lang="ts">
import { Monitor, Moon, Sunny } from '@element-plus/icons-vue'
import { OpenAIModels } from '@renderer/config/OpenAIConfig'
import { useAppSettingStore } from '@renderer/store/app-setting'
import { setProxy } from '@renderer/utils/ipc-util'

// 组件传参
const visible = defineModel<boolean>('visible', {
  default: () => false
})

// 仓库
const appSettingStore = useAppSettingStore()
</script>

<template>
  <div class="app-setting">
    <el-dialog v-model="visible" :title="$t('app.setting.title')" width="700">
      <div class="dialog-body">
        <el-tabs tab-position="left">
          <!-- 外观 -->
          <el-tab-pane :label="$t('app.setting.appearance')">
            <el-form label-width="auto">
              <!-- 主题 -->
              <el-form-item :label="$t('app.setting.item.theme.label')">
                <el-radio-group v-model="appSettingStore.app.themeModel" size="small">
                  <el-radio-button :value="0">
                    <el-space :size="5">
                      <el-icon :size="16">
                        <Monitor />
                      </el-icon>
                      <div>{{ $t('app.setting.item.theme.auto') }}</div>
                    </el-space>
                  </el-radio-button>
                  <el-radio-button :value="1">
                    <el-space :size="5">
                      <el-icon :size="16">
                        <Sunny />
                      </el-icon>
                      <div>{{ $t('app.setting.item.theme.light') }}</div>
                    </el-space>
                  </el-radio-button>
                  <el-radio-button :value="2">
                    <el-space :size="5">
                      <el-icon :size="16">
                        <Moon />
                      </el-icon>
                      <div>{{ $t('app.setting.item.theme.dark') }}</div>
                    </el-space>
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>

              <!-- 语言 -->
              <el-form-item :label="$t('app.setting.item.language.label')">
                <el-radio-group v-model="appSettingStore.app.locale" size="small">
                  <el-radio-button :label="$t('app.setting.item.language.zhCN')" value="zh_CN" />
                  <el-radio-button :label="$t('app.setting.item.language.enUS')" value="en_US" />
                </el-radio-group>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <!-- 网络 -->
          <el-tab-pane :label="$t('app.setting.network')">
            <el-form label-width="auto">
              <!-- 网络代理 -->
              <el-form-item :label="$t('app.setting.item.proxy.label')">
                <el-input
                  v-model="appSettingStore.app.proxy"
                  size="small"
                  @change="setProxy(appSettingStore.app.proxy)"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <!-- OpenAI -->
          <el-tab-pane :label="$t('app.setting.openai')">
            <el-scrollbar class="setting-openai-scrollbar">
              <el-form label-width="auto">
                <!-- Base URL -->
                <el-form-item :label="$t('app.setting.item.openai.baseUrl')">
                  <el-input v-model="appSettingStore.openAI.baseUrl" size="small" />
                </el-form-item>

                <!-- API Key -->
                <el-form-item :label="$t('app.setting.item.openai.apiKey')">
                  <el-input
                    v-model="appSettingStore.openAI.apiKey"
                    show-password
                    type="password"
                    size="small"
                  />
                </el-form-item>

                <!-- Model -->
                <el-form-item :label="$t('app.setting.item.openai.model')">
                  <el-select v-model="appSettingStore.openAI.model" size="small">
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
                      v-model="appSettingStore.openAI.temperature"
                      :min="0"
                      :max="1"
                      :step="0.1"
                      size="small"
                    />
                  </el-tooltip>
                </el-form-item>

                <!-- Top P -->
                <el-form-item :label="$t('app.setting.item.openai.topP')">
                  <el-tooltip
                    :content="$t('app.setting.item.openai.explain.topP')"
                    placement="right"
                  >
                    <el-input-number
                      v-model="appSettingStore.openAI.topP"
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
                      v-model="appSettingStore.openAI.maxTokens"
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
                      v-model="appSettingStore.openAI.presencePenalty"
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
                      v-model="appSettingStore.openAI.frequencyPenalty"
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
                      v-model="appSettingStore.openAI.contextSize"
                      :min="0"
                      :max="100"
                      :step="1"
                      size="small"
                    />
                  </el-tooltip>
                </el-form-item>
              </el-form>
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.app-setting {
  .dialog-body {
    height: $app-dialog-height;

    .el-tabs--right,
    .el-tabs__content,
    .el-tabs--left,
    .el-tabs__content {
      height: 100%;
    }

    .el-tabs__content {
      box-sizing: border-box;
      padding: $app-padding-small;

      .setting-openai-scrollbar {
        height: calc($app-dialog-height - $app-padding-small * 2);
      }
    }
  }
}
</style>
