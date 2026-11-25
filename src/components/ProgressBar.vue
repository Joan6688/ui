<template>
  <div class="progress-bar" ref="wrapperRef">
    <div class="bar-track" @click="onClickTrack">
      <div class="bar-fill" :style="{ width: `${modelValue}%` }"></div>
      <div
        class="bar-handle"
        :style="{ left: `${modelValue}%` }"
        @mousedown="startDrag"
      ></div>
    </div>
    <span v-if="showValue" class="bar-value">{{ modelValue.toFixed(0) }}%</span>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  showValue: { type: Boolean, default: false },
  max: { type: Number, default: 100 }
})
const emit = defineEmits(['update:modelValue', 'change'])

const wrapperRef = ref(null)
const dragging = ref(false)

const updateFromX = (x) => {
  if (!wrapperRef.value) return
  const rect = wrapperRef.value.querySelector('.bar-track').getBoundingClientRect()
  const percent = Math.max(0, Math.min(100, ((x - rect.left) / rect.width) * 100))
  emit('update:modelValue', percent)
  emit('change', percent)
}

const startDrag = (e) => {
  dragging.value = true
  updateFromX(e.clientX)
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}
const onClickTrack = (e) => { if (!dragging.value) updateFromX(e.clientX) }
const onDrag = (e) => { if (dragging.value) updateFromX(e.clientX) }
const stopDrag = () => {
  dragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}
onUnmounted(stopDrag)
</script>

<style scoped>
.progress-bar {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}
.bar-track {
  flex: 1;
  height: 8px;
  background: rgba(0,212,255,0.15);
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  overflow: visible;
}
.bar-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: linear-gradient(90deg, #0088aa, #00d4ff, #00ff88);
  border-radius: 4px;
  transition: width 0.08s linear;
  box-shadow: 0 0 8px rgba(0,212,255,0.5);
}
.bar-handle {
  position: absolute;
  top: 50%;
  width: 16px;
  height: 16px;
  background: #ffffff;
  border: 2px solid #00d4ff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: grab;
  box-shadow: 0 0 12px rgba(0,212,255,0.9);
  transition: transform 0.15s;
}
.bar-handle:hover { transform: translate(-50%, -50%) scale(1.2); }
.bar-handle:active { cursor: grabbing; transform: translate(-50%, -50%) scale(1.1); }
.bar-value {
  color: #00d4ff;
  font-size: 12px;
  font-family: 'Courier New', monospace;
  min-width: 36px;
  text-align: right;
}
</style>