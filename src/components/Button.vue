<template>
  <button
    class="tech-btn"
    :class="[
      `btn-${type}`,
      `btn-${size}`,
      `btn-${shape}`,
      { 'btn-block': block, 'btn-disabled': disabled, 'btn-active': isToggle && modelValue }
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <span v-if="shape === 'checkbox'" class="btn-check-icon" aria-hidden="true">
      <svg v-if="modelValue" viewBox="0 0 16 16" width="12" height="12">
        <path d="M3 8 L7 12 L13 4" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
    <span v-if="$slots.default"><slot /></span>
  </button>
</template>

<script setup lang="ts">

export interface ButtonProps {
  type?: 'primary' | 'warn' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'default' | 'circle' | 'checkbox';
  block?: boolean;
  disabled?: boolean;
  modelValue?: boolean;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'primary',
  size: 'md',
  shape: 'default',
  block: false,
  disabled: false,
  modelValue: undefined
})


const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
  (e: 'update:modelValue', value: boolean): void;
  (e: 'change', value: boolean): void;
}>()

const isToggle = props.modelValue !== undefined

const handleClick = (e: MouseEvent) => {
  if (isToggle) {
    emit('update:modelValue', !props.modelValue)
    emit('change', !props.modelValue)
  }
  emit('click', e)
}
</script>

<style scoped>
.tech-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  cursor: pointer;
  border-radius: 4px;
  font-family: inherit;
  font-weight: 500;
  transition: all 0.25s ease;
  outline: none;
  user-select: none;
}
.btn-sm { padding: 4px 12px; font-size: 12px; }
.btn-md { padding: 8px 20px; font-size: 14px; }
.btn-lg { padding: 12px 32px; font-size: 16px; font-weight: 600; }
.btn-primary {
  background: linear-gradient(135deg, rgba(0,120,170,0.75), rgba(0,180,220,0.75));
  border-color: rgba(0,212,255,0.4);
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(0,180,220,0.15);
}
.btn-primary:hover:not(.btn-disabled) {
  background: linear-gradient(135deg, rgba(0,140,190,0.9), rgba(0,200,240,0.9));
  border-color: rgba(0,212,255,0.9);
  box-shadow: 0 0 14px rgba(0,212,255,0.5), 0 0 30px rgba(0,212,255,0.25);
}
.btn-primary:active:not(.btn-disabled) {
  background: linear-gradient(135deg, rgba(0,180,230,1), rgba(0,220,255,1));
  box-shadow: 0 0 20px rgba(0,212,255,0.8), 0 0 40px rgba(0,212,255,0.4);
}
.btn-warn {
  background: linear-gradient(135deg, rgba(180,100,20,0.7), rgba(230,140,40,0.7));
  border-color: rgba(255,150,50,0.4);
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(230,140,40,0.15);
}
.btn-warn:hover:not(.btn-disabled) {
  background: linear-gradient(135deg, rgba(200,115,25,0.85), rgba(245,155,50,0.85));
  border-color: rgba(255,150,50,0.9);
  box-shadow: 0 0 14px rgba(255,140,0,0.5), 0 0 30px rgba(255,140,0,0.25);
}
.btn-warn:active:not(.btn-disabled) {
  background: linear-gradient(135deg, rgba(230,130,30,1), rgba(255,170,60,1));
  box-shadow: 0 0 20px rgba(255,140,0,0.8), 0 0 40px rgba(255,140,0,0.4);
}
.btn-success {
  background: linear-gradient(135deg, rgba(0,140,70,0.7), rgba(0,190,100,0.7));
  border-color: rgba(0,220,120,0.4);
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(0,190,100,0.15);
}
.btn-success:hover:not(.btn-disabled) {
  background: linear-gradient(135deg, rgba(0,160,80,0.85), rgba(0,210,115,0.85));
  border-color: rgba(0,220,120,0.9);
  box-shadow: 0 0 14px rgba(0,200,120,0.5), 0 0 30px rgba(0,200,120,0.25);
}
.btn-success:active:not(.btn-disabled) {
  background: linear-gradient(135deg, rgba(0,200,110,1), rgba(0,240,130,1));
  box-shadow: 0 0 20px rgba(0,200,120,0.8), 0 0 40px rgba(0,200,120,0.4);
}
.btn-ghost {
  background: rgba(0,212,255,0.05);
  border-color: rgba(0,212,255,0.4);
  color: #00d4ff;
}
.btn-ghost:hover:not(.btn-disabled) {
  background: rgba(0,212,255,0.18);
  border-color: rgba(0,212,255,0.8);
  box-shadow: 0 0 14px rgba(0,212,255,0.4);
}
.btn-ghost:active:not(.btn-disabled) {
  background: rgba(0,212,255,0.35);
  box-shadow: 0 0 20px rgba(0,212,255,0.7);
}
.btn-block { width: 100%; }
.btn-disabled {
  opacity: 0.45;
  cursor: not-allowed;
  filter: grayscale(0.4);
}
.btn-circle {
  width: 22px; height: 22px;
  border-radius: 50%;
  padding: 0;
  border: 1px solid rgba(0,212,255,0.45);
  background: transparent;
  position: relative;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}
.btn-circle::after {
  content: '';
  width: 9px; height: 9px;
  border-radius: 50%;
  background: rgba(0,212,255,0.25);
  transition: all 0.2s ease;
}
.btn-circle:hover:not(.btn-disabled) { border-color: rgba(0,212,255,0.85); }
.btn-circle:hover:not(.btn-disabled)::after { background: rgba(0,212,255,0.5); }
.btn-circle.btn-active {
  border-color: #00d4ff;
  box-shadow: 0 0 8px rgba(0,212,255,0.5);
}
.btn-circle.btn-active::after {
  background: #00d4ff;
  box-shadow: 0 0 6px #00d4ff, 0 0 14px rgba(0,212,255,0.5);
}
.btn-circle.btn-success { border-color: rgba(0,220,120,0.45); }
.btn-circle.btn-success::after { background: rgba(0,220,120,0.25); }
.btn-circle.btn-success:hover:not(.btn-disabled) { border-color: rgba(0,220,120,0.85); }
.btn-circle.btn-success:hover:not(.btn-disabled)::after { background: rgba(0,220,120,0.5); }
.btn-circle.btn-success.btn-active {
  border-color: #00dc78;
  box-shadow: 0 0 8px rgba(0,220,120,0.5);
}
.btn-circle.btn-success.btn-active::after {
  background: #00dc78;
  box-shadow: 0 0 6px #00dc78, 0 0 14px rgba(0,220,120,0.5);
}
.btn-circle.btn-warn { border-color: rgba(255,150,50,0.45); }
.btn-circle.btn-warn::after { background: rgba(255,150,50,0.25); }
.btn-circle.btn-warn:hover:not(.btn-disabled) { border-color: rgba(255,150,50,0.85); }
.btn-circle.btn-warn:hover:not(.btn-disabled)::after { background: rgba(255,150,50,0.5); }
.btn-circle.btn-warn.btn-active {
  border-color: #ff9632;
  box-shadow: 0 0 8px rgba(255,150,50,0.5);
}
.btn-circle.btn-warn.btn-active::after {
  background: #ff9632;
  box-shadow: 0 0 6px #ff9632, 0 0 14px rgba(255,150,50,0.5);
}
.btn-circle.btn-disabled { border-color: rgba(100,120,140,0.35) !important; cursor: not-allowed; }
.btn-circle.btn-disabled::after { background: rgba(100,120,140,0.2) !important; box-shadow: none !important; }
.btn-checkbox {
  border-radius: 3px;
  padding: 6px 10px;
  min-width: 22px;
  height: auto;
  background: rgba(0,0,0,0.35);
  border-color: rgba(0,212,255,0.45);
  color: rgba(137,180,217,0.65);
  justify-content: flex-start;
  gap: 8px;
}
.btn-checkbox:hover:not(.btn-disabled) {
  border-color: rgba(0,212,255,0.8);
  color: #c0d8ec;
}
.btn-checkbox.btn-active {
  background: linear-gradient(135deg, rgba(0,120,170,0.75), rgba(0,180,220,0.75));
  border-color: rgba(0,212,255,0.95);
  color: #ffffff;
  box-shadow: 0 0 10px rgba(0,212,255,0.5);
}
.btn-checkbox .btn-check-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  border-radius: 2px;
  background: rgba(0,0,0,0.4);
  border: 1px solid rgba(0,212,255,0.55);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.btn-checkbox.btn-active .btn-check-icon {
  background: #00d4ff;
  border-color: #00d4ff;
  color: #001830;
}
</style>