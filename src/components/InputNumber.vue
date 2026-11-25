<template>
  <div class="input-number" :class="{ disabled }">
    <button
      class="step-btn"
      :disabled="disabled || (modelValue - step) < min"
      @click="change(-step)"
    >
      −
    </button>
    <input
      type="number"
      class="number-input"
      :value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :placeholder="placeholder"
      @input="onInput"
      @blur="onBlur"
    />
    <span v-if="unit" class="input-unit">{{ unit }}</span>
    <button
      class="step-btn"
      :disabled="disabled || (modelValue + step) > max"
      @click="change(step)"
    >
      +
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  min: { type: Number, default: -Infinity },
  max: { type: Number, default: Infinity },
  step: { type: Number, default: 1 },
  unit: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue', 'change'])

const tempValue = ref(props.modelValue)

const onInput = (e) => {
  const val = Number(e.target.value)
  if (!Number.isNaN(val)) emit('update:modelValue', val)
}
const onBlur = () => {
  tempValue.value = props.modelValue
}
const change = (delta) => {
  const next = Math.max(props.min, Math.min(props.max, props.modelValue + delta))
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<style scoped>
.input-number {
  display: inline-flex;
  align-items: center;
  background: rgba(0,0,0,0.35);
  border: 1px solid rgba(0,212,255,0.4);
  border-radius: 3px;
  overflow: hidden;
  transition: border-color 0.25s, box-shadow 0.25s;
}
.input-number:focus-within {
  border-color: #00d4ff;
  box-shadow: 0 0 6px rgba(0,212,255,0.4);
}
.input-number.disabled { opacity: 0.5; cursor: not-allowed; }

.step-btn {
  width: 28px;
  height: 30px;
  background: rgba(0,212,255,0.08);
  border: none;
  color: #00d4ff;
  font-size: 16px;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s;
}
.step-btn:hover:not(:disabled) { background: rgba(0,212,255,0.2); }
.step-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.number-input {
  width: 70px;
  height: 30px;
  background: transparent;
  border: none;
  color: #ffffff;
  text-align: center;
  font-size: 13px;
  font-family: inherit;
  outline: none;
  -moz-appearance: textfield;
}
.number-input::-webkit-outer-spin-button,
.number-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

.input-unit {
  color: #89b4d9;
  font-size: 11px;
  padding: 0 6px;
  border-left: 1px solid rgba(0,212,255,0.2);
}
</style>