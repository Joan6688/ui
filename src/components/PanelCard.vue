<template>
  <div
    class="tech-panel"
    :class="{ 'panel-bordered': bordered }"
  >
    <div v-if="hasHeader" class="panel-header" :class="{ 'no-title': !title && !subtitle && !$slots?.header }">
      <div class="panel-header-left">
        <span v-if="title" class="panel-title">{{ title }}</span>
        <span v-if="subtitle" class="panel-subtitle">{{ subtitle }}</span>
      </div>
      <slot name="header" />
    </div>
    <div class="panel-body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="panel-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  bordered?: boolean
}>(), {
  title: '',
  subtitle: '',
  bordered: true
})
const slots = useSlots()

const hasHeader = computed(() => props.title || props.subtitle || slots.header)
</script>

<style scoped>
.tech-panel {
  background: linear-gradient(180deg, rgba(3,25,65,0.95), rgba(2,18,48,0.98));
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}
.panel-bordered {
  border: 1px solid rgba(0,212,255,0.35);
  box-shadow: 0 0 18px rgba(0,120,220,0.18);
}
.panel-header {
  padding: 12px 16px;
  background: linear-gradient(90deg, rgba(0,212,255,0.12), rgba(0,212,255,0.02));
  border-bottom: 1px solid rgba(0,212,255,0.3);
  display: flex;
  align-items: center;
  gap: 12px;
}
.panel-header.no-title { padding: 8px 16px; }
.panel-header-left { display: flex; align-items: center; gap: 10px; }
.panel-title {
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 1px;
}
.panel-subtitle {
  color: #00d4ff;
  font-size: 11px;
  padding: 2px 8px;
  background: rgba(0,212,255,0.1);
  border-radius: 4px;
  border: 1px solid rgba(0,212,255,0.3);
}
.panel-body { flex: 1; padding: 16px 20px; overflow: visible; }
.panel-footer {
  padding: 12px 16px;
  background: rgba(0,0,0,0.2);
  border-top: 1px solid rgba(0,212,255,0.2);
}
</style>