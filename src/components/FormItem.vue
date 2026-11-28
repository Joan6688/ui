<template>
  <div class="tech-form-item" :class="{ 'has-error': !!error, inline }">
    <label v-if="label" class="tf-label" :style="labelStyle">
      <span v-if="required" class="tf-required">*</span>
      {{ label }}
    </label>
    <div class="tf-control">
      <slot />
      <div v-if="error" class="tf-error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'

const props = withDefaults(defineProps<{
  label?: string
  required?: boolean
  error?: string
  labelWidth?: string
  labelAlign?: string
  inline?: boolean
}>(), {
  label: '',
  required: false,
  error: '',
  labelWidth: '',
  labelAlign: '',
  inline: false
})

const form = inject<{ labelWidth?: string; labelAlign?: string } | null>('tech-form', null)

const labelStyle = computed<Record<string, string>>(() => {
  const w = props.labelWidth || form?.labelWidth || 'var(--tf-label-width)'
  const a = props.labelAlign || form?.labelAlign || 'var(--tf-label-align)'
  return { width: w, textAlign: a }
})
</script>

<style scoped>
.tech-form-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.tech-form-item.inline { align-items: center; }
.tf-label {
  flex-shrink: 0;
  color: #89b4d9;
  font-size: 13px;
  line-height: 30px;
  padding-top: 1px;
  box-sizing: border-box;
}
.tf-required {
  color: #ff5050;
  margin-right: 2px;
}
.tf-control {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.tf-control :deep(.tech-input),
.tf-control :deep(.tech-select) {
  width: 100%;
}
.tf-error {
  color: #ff5050;
  font-size: 12px;
  padding: 0 2px;
}
</style>