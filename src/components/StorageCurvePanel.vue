<template>
  <div v-if="visible" class="storage-curve-mask" @click.self="handleClose">
    <div class="storage-curve-panel">
      <div class="sc-header">
        <div class="sc-header-left">
          <span class="sc-header-bar"></span>
          <span class="sc-header-icon">{{ icon }}</span>
          <span class="sc-header-title">{{ title }}</span>
        </div>
        <div class="sc-header-deco">
          <span></span><span></span><span></span>
        </div>
        <button class="sc-close-btn" @click="handleClose">✕</button>
      </div>

      <div class="sc-body">
        <div class="sc-toolbar">
          <div v-if="showYear" class="sc-year-select">
            <span class="sc-year-label">年</span>
            <DatePicker
              mode="year"
              :model-value="year"
              :min-year="pickerMin"
              :max-year="pickerMax"
              @update:model-value="val => emit('update:year', val)"
              @change="val => emit('yearChange', val)"
            />
          </div>
          <div v-if="note" class="sc-note">{{ note }}</div>
        </div>

        <LineChart
          :series="series"
          :x-labels="xLabels"
          :y-left-label="yLeftLabel"
          :y-right-label="yRightLabel"
          :y-left-min="yLeftMin"
          :y-left-max="yLeftMax"
          :y-right-min="yRightMin"
          :y-right-max="yRightMax"
          :show-legend="false"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import DatePicker from './DatePicker.vue'
import LineChart from './LineChart.vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: '库容曲线' },
  icon: { type: String, default: '📊' },
  note: { type: String, default: '注：1985年国家高程标准' },
  showYear: { type: Boolean, default: true },
  year: { type: [String, Number], default: 2024 },
  yearOptions: { type: Array, default: () => [
    { label: '2024', value: 2024 },
    { label: '2023', value: 2023 },
    { label: '2022', value: 2022 },
    { label: '2021', value: 2021 },
    { label: '2020', value: 2020 }
  ]},
  series: {
    type: Array,
    default: () => ([
      { name: '水位-库容', color: '#00d4ff', data: [185, 192, 198, 202, 206, 209, 211, 213, 214.5, 215.8] },
      { name: '水位-面积', color: '#ff8800', axis: 'right', data: [0.5, 1.8, 3.0, 4.2, 5.5, 6.8, 7.8, 8.5, 9.0, 9.5] }
    ])
  },
  xLabels: {
    type: Array,
    default: () => [1.00, 2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000]
  },
  yLeftLabel: { type: String, default: 'm' },
  yRightLabel: { type: String, default: 'km²' },
  yLeftMin: { type: Number, default: 185 },
  yLeftMax: { type: Number, default: 216 },
  yRightMin: { type: Number, default: 0 },
  yRightMax: { type: Number, default: 12 }
})

const emit = defineEmits(['close', 'update:visible', 'update:year', 'yearChange'])

const pickerMin = computed(() => {
  const values = props.yearOptions.map(o => Number(o.value)).filter(v => !isNaN(v))
  return values.length ? Math.min(...values) - 3 : 1970
})
const pickerMax = computed(() => {
  const values = props.yearOptions.map(o => Number(o.value)).filter(v => !isNaN(v))
  return values.length ? Math.max(...values) + 3 : 2099
})

const handleClose = () => {
  emit('close')
  emit('update:visible', false)
}
</script>

<style scoped>
.storage-curve-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 15, 40, 0.55);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: maskIn 0.2s ease;
}
@keyframes maskIn { from { opacity: 0; } to { opacity: 1; } }

.storage-curve-panel {
  width: 680px;
  background: rgba(5, 20, 55, 0.97);
  border: 1px solid rgba(0, 212, 255, 0.45);
  border-radius: 6px;
  box-shadow: 0 0 24px rgba(0, 120, 220, 0.4), 0 12px 48px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  animation: panelIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes panelIn {
  from { opacity: 0; transform: translateY(20px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.sc-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  height: 42px;
  background: linear-gradient(90deg, #00a8cc, #0055aa);
  position: relative;
  border-bottom: 2px solid rgba(255, 200, 50, 0.6);
}
.sc-header-bar {
  width: 4px;
  height: 20px;
  background: linear-gradient(180deg, #ffdd00, #ff8800);
  border-radius: 2px;
  box-shadow: 0 0 6px rgba(255, 200, 50, 0.8);
}
.sc-header-icon { font-size: 16px; }
.sc-header-title {
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 2px;
}
.sc-header-deco {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  gap: 3px;
}
.sc-header-deco span {
  width: 18px;
  height: 4px;
  background: linear-gradient(90deg, rgba(255,255,255,0.3), transparent);
  border-radius: 1px;
}
.sc-close-btn {
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #ffffff;
  border-radius: 3px;
  cursor: pointer;
  font-size: 13px;
  line-height: 1;
  transition: all 0.2s;
  font-family: inherit;
}
.sc-close-btn:hover {
  background: #ff3333;
  border-color: #ff6666;
  box-shadow: 0 0 10px rgba(255, 50, 50, 0.6);
}

.sc-body {
  padding: 18px 20px 20px;
}
.sc-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.sc-year-select {
  display: flex;
  align-items: center;
  gap: 10px;
}
.sc-year-label {
  color: #89b4d9;
  font-size: 13px;
}
.sc-note {
  color: #89b4d9;
  font-size: 11px;
  font-style: italic;
}

.sc-legend {
  display: flex;
  gap: 28px;
  margin-bottom: 10px;
}
.sc-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #c0d8ec;
  font-size: 12px;
}
.sc-legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.sc-legend-line {
  width: 18px;
  height: 2px;
  border-radius: 1px;
}

.sc-chart-wrap {
  position: relative;
  border: 1px solid rgba(0, 212, 255, 0.25);
  border-radius: 3px;
  padding: 4px;
  background: rgba(0, 15, 40, 0.4);
  cursor: crosshair;
}
.sc-svg {
  width: 100%;
  height: auto;
  display: block;
}

.sc-tooltip {
  min-width: 150px;
  background: rgba(0, 30, 80, 0.95);
  border: 1px solid rgba(0, 212, 255, 0.6);
  border-radius: 4px;
  padding: 10px 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(6px);
}
.sc-tooltip-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 1.8;
}
.sc-tooltip-label {
  color: #89b4d9;
  font-size: 12px;
}
.sc-tooltip-value {
  font-size: 13px;
  font-weight: 600;
  font-family: 'Consolas', 'Courier New', monospace;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>