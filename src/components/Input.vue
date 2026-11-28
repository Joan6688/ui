<template>
  <div class="tech-input" :class="[`input-${size}`, { disabled, focused }]">
    <input
      ref="inputRef"
      :type="type"
      class="input-inner"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      @input="onInput"
      @focus="focused = true; emit('focus', $event)"
      @blur="focused = false; emit('blur', $event)"
      @change="emit('change', $event)"
      @keydown="emit('keydown', $event)"
    />
    <span v-if="unit" class="input-unit">{{ unit }}</span>
    <button
      v-if="type === 'password' && modelValue"
      class="input-eye"
      type="button"
      @click="togglePwd"
    >{{ pwdVisible ? '🙈' : '👁' }}</button>
    <button
      v-if="clearable && modelValue && !disabled"
      class="input-clear"
      type="button"
      @click="clear"
    >×</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  type?: string
  placeholder?: string
  size?: string
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  unit?: string
  maxlength?: number
}>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  size: 'md',
  disabled: false,
  readonly: false,
  clearable: false,
  unit: '',
  maxlength: undefined
})
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', event: Event): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'keydown', event: KeyboardEvent): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const focused = ref(false)
const pwdVisible = ref(false)

const onInput = (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value)
const clear = () => { emit('update:modelValue', ''); inputRef.value?.focus() }
const togglePwd = () => {
  pwdVisible.value = !pwdVisible.value
  const el = inputRef.value
  if (el) el.type = pwdVisible.value ? 'text' : 'password'
}
</script>

<style scoped>
.tech-input {
  display: inline-flex;
  align-items: center;
  background: rgba(0,0,0,0.35);
  border: 1px solid rgba(0,212,255,0.4);
  border-radius: 3px;
  overflow: hidden;
  transition: border-color 0.25s, box-shadow 0.25s;
  width: 100%;
}
.tech-input.focused {
  border-color: #00d4ff;
  box-shadow: 0 0 6px rgba(0,212,255,0.4);
}
.tech-input.disabled { opacity: 0.5; cursor: not-allowed; }

.input-inner {
  flex: 1;
  min-width: 0;
  height: 30px;
  padding: 0 10px;
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 13px;
  font-family: inherit;
  outline: none;
}
.input-inner::placeholder { color: rgba(137,180,217,0.55); }
.input-inner:disabled { cursor: not-allowed; }

.input-sm .input-inner { height: 26px; font-size: 12px; padding: 0 8px; }
.input-lg .input-inner { height: 36px; font-size: 14px; padding: 0 12px; }

.input-unit {
  color: #89b4d9;
  font-size: 12px;
  padding: 0 10px;
  border-left: 1px solid rgba(0,212,255,0.2);
  flex-shrink: 0;
}

.input-eye, .input-clear {
  width: 26px; height: 30px;
  background: transparent;
  border: none;
  color: #89b4d9;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  font-family: inherit;
}
.input-eye:hover, .input-clear:hover { color: #ffffff; }
.input-clear { font-size: 18px; line-height: 1; }

.input-sm .input-eye, .input-sm .input-clear { height: 26px; }
.input-lg .input-eye, .input-lg .input-clear { height: 36px; }
</style>