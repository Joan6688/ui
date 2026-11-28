<template>
  <div class="info-item">
    <span class="info-label">{{ label }}</span>
    <span class="info-divider"></span>
    <span class="info-value">{{ value }}</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  label?: string
  value?: string | number
}>(), {
  label: '',
  value: ''
})
</script>

<style scoped>
.info-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px dashed rgba(0, 212, 255, 0.15);
  transition: background 0.2s;
}
.info-item:hover {
  background: rgba(0, 212, 255, 0.04);
}
.info-label {
  color: #89b4d9;
  font-size: 13px;
  letter-spacing: 1px;
}
.info-divider {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, rgba(0,212,255,0.25), transparent);
  margin: 0 12px;
}
.info-value {
  color: #00d4ff;
  font-size: 13px;
  font-weight: 600;
  font-family: 'Consolas', 'Courier New', monospace;
  text-shadow: 0 0 8px rgba(0,212,255,0.5);
}
</style>