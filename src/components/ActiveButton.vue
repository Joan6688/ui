<template>
  <button
    class="active-btn"
    :class="[`active-${color}`, { active }]"
    @click="toggle"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  active?: boolean
  color?: string
}>(), {
  active: false,
  color: 'blue'
})
const emit = defineEmits<{
  (e: 'update:active', value: boolean): void
  (e: 'change', value: boolean): void
}>()

const toggle = () => {
  const next = !props.active
  emit('update:active', next)
  emit('change', next)
}
</script>

<style scoped>
.active-btn {
  padding: 6px 14px;
  background: rgba(0,212,255,0.08);
  border: 1px solid rgba(0,212,255,0.4);
  color: #89b4d9;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  font-family: inherit;
  transition: all 0.25s ease;
  outline: none;
  user-select: none;
}
.active-btn:hover:not(.active) {
  color: #ffffff;
  background: rgba(0,212,255,0.18);
}
.active-btn.active-blue.active {
  background: rgba(0,212,255,0.25);
  border-color: #00d4ff;
  color: #00d4ff;
  box-shadow: 0 0 12px rgba(0,212,255,0.6);
  text-shadow: 0 0 4px rgba(0,212,255,0.7);
}
.active-btn.active-orange.active {
  background: rgba(255,140,0,0.25);
  border-color: #ff8c00;
  color: #ff8c00;
  box-shadow: 0 0 12px rgba(255,140,0,0.6);
  text-shadow: 0 0 4px rgba(255,140,0,0.7);
}
.active-btn.active-green.active {
  background: rgba(0,255,136,0.25);
  border-color: #00ff88;
  color: #00ff88;
  box-shadow: 0 0 12px rgba(0,255,136,0.6);
  text-shadow: 0 0 4px rgba(0,255,136,0.7);
}
</style>