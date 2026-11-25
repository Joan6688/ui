<template>
  <div class="tab-group">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      class="tab-btn"
      :class="{ active: modelValue === tab.value }"
      @click="handleClick(tab.value)"
    >
      <span class="tab-icon" v-if="tab.icon">{{ tab.icon }}</span>
      <span class="tab-label">{{ tab.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">

export interface TabOption {
  value: string | number;
  label: string;
  icon?: string;
}

export interface TabGroupProps {
  tabs: TabOption[];
  modelValue: string | number;
}

const props = defineProps<TabGroupProps>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'change', value: string | number): void;
}>()

const handleClick = (val: string | number) => {
  if (val !== props.modelValue) {
    emit('update:modelValue', val)
    emit('change', val)
  }
}
</script>

<style scoped>
.tab-group {
  display: flex;
  flex-direction: column; 
  width: 160px;
  background: rgba(0, 212, 255, 0.03);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 6px;
  overflow: hidden;
  padding: 8px;
  gap: 6px;
}
.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: transparent;
  border: none;
  color: #89b4d9;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.25s ease;
  position: relative;
  text-align: left;
}
.tab-btn:hover:not(.active) {
  color: #ffffff;
  background: rgba(0,212,255,0.08);
}
.tab-btn.active {
  color: #00d4ff;
  background: linear-gradient(90deg, rgba(0,212,255,0.15), transparent);
  box-shadow: inset 2px 0 0 #00d4ff;
  text-shadow: 0 0 6px rgba(0,212,255,0.6);
  font-weight: 500;
}
.tab-icon { font-size: 14px; }
</style>