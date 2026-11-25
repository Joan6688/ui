<template>
  <div class="tech-select" :class="{ open: isOpen, disabled }" ref="wrapRef">
    <button
      class="select-trigger"
      :disabled="disabled"
      @click="toggleDropdown"
    >
      <span class="select-label">{{ currentLabel || placeholder }}</span>
      <span class="select-arrow" :class="{ flipped: isOpen }">▼</span>
    </button>

    <Teleport to="body">
      <Transition name="slide">
        <div
          v-if="isOpen"
          class="select-dropdown-wrap"
          :style="dropStyle"
        >
          <div class="select-dropdown-inner">
            <div
              v-for="opt in options"
              :key="opt.value"
              class="select-option"
              :class="{ active: opt.value === modelValue }"
              @click="select(opt.value)"
            >
              {{ opt.label }}
              <span v-if="opt.value === modelValue" class="option-check">✓</span>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: '请选择' },
  disabled: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue', 'change'])

const wrapRef = ref(null)
const isOpen = ref(false)
const pos = ref({ top: 0, left: 0, width: 0, flipUp: false })

const currentLabel = computed(() => {
  const opt = props.options.find(o => o.value === props.modelValue)
  return opt?.label || ''
})

const dropStyle = computed(() => {
  const d = pos.value
  return {
    position: 'fixed',
    top: d.flipUp ? `${d.top}px` : `${d.top}px`,
    left: `${d.left}px`,
    width: `${d.width}px`,
    transform: d.flipUp ? 'translateY(-100%)' : 'translateY(0)'
  }
})

const calcPos = () => {
  if (!wrapRef.value) return
  const r = wrapRef.value.getBoundingClientRect()
  const dropH = props.options.length * 36 + 8
  const spaceBelow = window.innerHeight - r.bottom
  const flipUp = spaceBelow < dropH + 20 && r.top > dropH + 20
  pos.value = {
    top: flipUp ? r.top - 4 : r.bottom + 4,
    left: r.left,
    width: r.width,
    flipUp
  }
}

const toggleDropdown = async () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    await nextTick()
    calcPos()
  }
}

const select = (val) => {
  emit('update:modelValue', val)
  emit('change', val)
  isOpen.value = false
}

const close = (e) => {
  if (!isOpen.value) return
  if (!wrapRef.value?.contains(e.target) && !e.target.closest('.select-dropdown-inner')) {
    isOpen.value = false
  }
}
const onScroll = () => { if (isOpen.value) calcPos() }
const onResize = () => { if (isOpen.value) calcPos() }

onMounted(() => {
  document.addEventListener('click', close)
  window.addEventListener('scroll', onScroll, true)
  window.addEventListener('resize', onResize)
})
onUnmounted(() => {
  document.removeEventListener('click', close)
  window.removeEventListener('scroll', onScroll, true)
  window.removeEventListener('resize', onResize)
})
</script>

<style scoped>
.tech-select {
  display: inline-block;
}
.select-trigger {
  width: 100%;
  min-width: 110px;
  height: 30px;
  padding: 0 28px 0 12px;
  background: rgba(0,0,0,0.35);
  border: 1px solid rgba(0,212,255,0.4);
  border-radius: 3px;
  color: #ffffff;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  position: relative;
  transition: all 0.25s;
  display: flex;
  align-items: center;
}
.select-trigger:hover:not(:disabled) {
  border-color: #00d4ff;
  box-shadow: 0 0 6px rgba(0,212,255,0.3);
}
.tech-select.disabled .select-trigger { opacity: 0.5; cursor: not-allowed; }
.tech-select.open .select-trigger {
  border-color: #00d4ff;
  box-shadow: 0 0 10px rgba(0,212,255,0.5);
}

.select-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.select-arrow {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #00d4ff;
  font-size: 10px;
  transition: transform 0.25s;
}
.select-arrow.flipped { transform: translateY(-50%) rotate(180deg); }

.slide-enter-active, .slide-leave-active { transition: opacity 0.18s, transform 0.18s; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-6px); }
</style>

<!-- Teleport 到 body 的下拉样式（不用 scoped） -->
<style>
.select-dropdown-wrap {
  z-index: 9999;
  pointer-events: auto;
}
.select-dropdown-inner {
  background: rgba(0, 30, 80, 0.97);
  border: 1px solid rgba(0, 212, 255, 0.5);
  border-radius: 4px;
  box-shadow: 0 8px 28px rgba(0, 60, 150, 0.5);
  padding: 4px 0;
  backdrop-filter: blur(8px);
}
.select-option {
  padding: 8px 14px;
  color: #c0d8ec;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.12s;
  line-height: 1.4;
}
.select-option:hover {
  background: rgba(0, 212, 255, 0.18);
  color: #ffffff;
}
.select-option.active {
  color: #00d4ff;
  background: rgba(0, 212, 255, 0.12);
  font-weight: 500;
}
.option-check { font-size: 11px; color: #00ff88; }
</style>