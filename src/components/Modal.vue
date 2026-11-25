<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="modal-mask" @click.self="handleMaskClose">
        <div class="modal-wrap" :style="wrapStyle">
          <div class="modal-header">
            <span class="modal-title">{{ title }}</span>
            <button v-if="closable" class="modal-close" @click="close">×</button>
          </div>
          <div class="modal-body">
            <slot />
          </div>
          <div v-if="showFooter" class="modal-footer">
            <Button type="ghost" @click="handleCancel">{{ cancelText }}</Button>
            <Button type="primary" @click="handleConfirm">{{ confirmText }}</Button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import Button from './Button.vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: '' },
  width: { type: [String, Number], default: 420 },
  closable: { type: Boolean, default: true },
  showFooter: { type: Boolean, default: true },
  confirmText: { type: String, default: '确定' },
  cancelText: { type: String, default: '取消' },
  maskClosable: { type: Boolean, default: true }
})
const emit = defineEmits(['update:visible', 'close', 'confirm', 'cancel'])

const wrapStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width
}))

const close = () => {
  emit('update:visible', false)
  emit('close')
}
const handleMaskClose = () => {
  if (props.maskClosable) close()
}
const handleConfirm = () => emit('confirm')
const handleCancel = () => {
  emit('cancel')
  close()
}

const onEsc = (e) => { if (e.key === 'Escape' && props.visible) close() }
onMounted(() => document.addEventListener('keydown', onEsc))
onUnmounted(() => document.removeEventListener('keydown', onEsc))
</script>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 10, 30, 0.65);
  backdrop-filter: blur(3px);
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-wrap {
  background: linear-gradient(160deg, #0a2248 0%, #061832 100%);
  border: 1px solid rgba(0, 212, 255, 0.45);
  border-radius: 4px;
  box-shadow: 0 0 0 1px rgba(0, 212, 255, 0.12),
              0 12px 40px rgba(0, 40, 120, 0.55),
              inset 0 0 30px rgba(0, 80, 160, 0.12);
  position: relative;
  overflow: hidden;
}
.modal-wrap::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00d4ff, transparent);
  opacity: 0.7;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
  background: rgba(0, 60, 140, 0.25);
}
.modal-title {
  font-size: 15px;
  font-weight: 500;
  color: #eaf6ff;
  letter-spacing: 1px;
}
.modal-close {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid rgba(0, 212, 255, 0.4);
  background: transparent;
  color: #8ac4ec;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-family: inherit;
}
.modal-close:hover {
  color: #ffffff;
  border-color: #00d4ff;
  background: rgba(0, 212, 255, 0.2);
  box-shadow: 0 0 6px rgba(0, 212, 255, 0.5);
}

.modal-body {
  padding: 20px;
  color: #c0d8ec;
  font-size: 13px;
}

.modal-footer {
  padding: 12px 20px;
  border-top: 1px solid rgba(0, 212, 255, 0.18);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  background: rgba(0, 40, 100, 0.2);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-active .modal-wrap,
.modal-fade-leave-active .modal-wrap {
  transition: transform 0.22s ease, opacity 0.22s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-from .modal-wrap { transform: translateY(-12px) scale(0.97); opacity: 0; }
.modal-fade-leave-to .modal-wrap { transform: translateY(6px) scale(0.98); opacity: 0; }
</style>