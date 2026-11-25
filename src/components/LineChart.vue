<template>
  <div
    class="line-chart"
    ref="wrapRef"
    @mousemove="onMouseMove"
    @mouseleave="hoverIdx = -1"
  >
    <div v-if="showLegend" class="lc-legend">
      <span
        v-for="s in series"
        :key="s.name"
        class="lc-legend-item"
      >
        <span class="lc-legend-dot" :style="{ background: s.color }"></span>
        <span class="lc-legend-line" :style="{ background: s.color }"></span>
        {{ s.name }}
      </span>
    </div>

    <svg :viewBox="`0 0 ${svgW} ${svgH}`" class="lc-svg" preserveAspectRatio="none">
      <line :x1="padL" :y1="padT" :x2="padL" :y2="svgH - padB" stroke="rgba(0,212,255,0.5)" stroke-width="1" />
      <line :x1="padL" :y1="svgH - padB" :x2="svgW - padR" :y2="svgH - padB" stroke="rgba(0,212,255,0.5)" stroke-width="1" />

      <g v-for="(tick, i) in yTicks" :key="'y'+i">
        <line
          v-if="i !== 0 && i !== yTicks.length - 1"
          :x1="padL" :y1="tick.y"
          :x2="svgW - padR" :y2="tick.y"
          stroke="rgba(0,212,255,0.12)"
          stroke-dasharray="3,3"
        />
        <text :x="padL - 8" :y="tick.y + 4" fill="#c0d8ec" font-size="11" text-anchor="end">{{ tick.labelL }}</text>
        <text v-if="hasRightAxis" :x="svgW - padR + 8" :y="tick.y + 4" :fill="rightColor" font-size="11" text-anchor="start">{{ tick.labelR }}</text>
      </g>

      <g v-for="(tick, i) in xTicks" :key="'x'+i">
        <line :x1="tick.x" :y1="svgH - padB" :x2="tick.x" :y2="svgH - padB + 4" stroke="rgba(0,212,255,0.5)" />
        <text :x="tick.x" :y="svgH - padB + 16" fill="#c0d8ec" font-size="11" text-anchor="middle">{{ tick.label }}</text>
      </g>

      <text :x="padL - 8" :y="padT - 14" :fill="series[0]?.color || '#00d4ff'" font-size="11" text-anchor="end">{{ yLeftLabel }}</text>
      <text v-if="hasRightAxis" :x="svgW - padR + 8" :y="padT - 14" :fill="rightColor" font-size="11" font-weight="600" text-anchor="start">{{ yRightLabel }}</text>

      <polyline
        v-for="(s, si) in series"
        :key="si"
        :points="getLinePoints(s)"
        fill="none"
        :stroke="s.color"
        stroke-width="2.2"
        stroke-linejoin="round"
        stroke-linecap="round"
      />

      <g v-if="hoverIdx !== -1">
        <line
          :x1="getX(hoverIdx)"
          :y1="padT"
          :x2="getX(hoverIdx)"
          :y2="svgH - padB"
          stroke="rgba(255,255,255,0.4)"
          stroke-dasharray="3,2"
        />
        <circle
          v-for="(s, si) in series"
          :key="'dot'+si"
          :cx="getX(hoverIdx)"
          :cy="getY(s, hoverIdx)"
          r="4"
          :fill="s.color"
          stroke="#fff"
          stroke-width="1.2"
        />
      </g>
    </svg>

    <Transition name="fade">
      <div
        v-if="hoverIdx !== -1"
        class="lc-tooltip"
        :style="tooltipStyle"
      >
        <div class="lc-tooltip-head">{{ xLabels[hoverIdx] }}</div>
        <div
          v-for="(s, si) in series"
          :key="'tr'+si"
          class="lc-tooltip-row"
        >
          <span class="lc-dot" :style="{ background: s.color }"></span>
          <span class="lc-tooltip-label">{{ s.name }}</span>
          <span class="lc-tooltip-value" :style="{ color: s.color }">{{ formatSeriesVal(s, hoverIdx) }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  series: {
    type: Array,
    required: true
  },
  xLabels: {
    type: Array,
    required: true
  },
  yLeftLabel: { type: String, default: '' },
  yRightLabel: { type: String, default: '' },
  yLeftMin: { type: Number, default: 0 },
  yLeftMax: { type: Number, default: 100 },
  yRightMin: { type: Number, default: 0 },
  yRightMax: { type: Number, default: 100 },
  showLegend: { type: Boolean, default: true },
  height: { type: Number, default: 300 }
})

const emit = defineEmits(['hover'])

const svgW = 600
const svgH = 300
const padT = 28, padB = 44, padL = 52, padR = 52

const wrapRef = ref(null)
const hoverIdx = ref(-1)
const mouseX = ref(0)
const mouseY = ref(0)

const hasRightAxis = computed(() => props.series.some(s => s.axis === 'right'))
const rightColor = computed(() => props.series.find(s => s.axis === 'right')?.color || '#ff8800')

const yTicks = computed(() => {
  const arr = []
  for (let i = 0; i <= 5; i++) {
    const y = padT + (svgH - padT - padB) * (1 - i / 5)
    arr.push({
      y,
      labelL: (props.yLeftMin + (props.yLeftMax - props.yLeftMin) / 5 * i).toFixed(2),
      labelR: (props.yRightMin + (props.yRightMax - props.yRightMin) / 5 * i).toFixed(2)
    })
  }
  return arr
})

const xTicks = computed(() => {
  const count = Math.min(8, props.xLabels.length)
  const step = (svgW - padL - padR) / (count - 1 || 1)
  const useOriginal = props.xLabels.some(v => typeof v === 'string')
  if (useOriginal) {
    const idxs = Array.from({ length: count }, (_, i) => Math.round(i * (props.xLabels.length - 1) / (count - 1 || 1)))
    return idxs.map((origIdx, i) => ({
      x: padL + step * i,
      label: props.xLabels[origIdx]
    }))
  }
  return Array.from({ length: count }, (_, i) => ({
    x: padL + step * i,
    label: props.xLabels[i]
  }))
})

const getX = (i) => {
  const step = (svgW - padL - padR) / (props.xLabels.length - 1 || 1)
  return padL + step * i
}
const getY = (s, i) => {
  const val = s.data[i] ?? 0
  if (s.axis === 'right') {
    const range = props.yRightMax - props.yRightMin || 1
    return svgH - padB - ((val - props.yRightMin) / range) * (svgH - padT - padB)
  }
  const range = props.yLeftMax - props.yLeftMin || 1
  return svgH - padB - ((val - props.yLeftMin) / range) * (svgH - padT - padB)
}
const getLinePoints = (s) => {
  if (!s.data?.length) return ''
  return s.data.map((_, i) => `${getX(i)},${getY(s, i)}`).join(' ')
}

const formatSeriesVal = (s, idx) => {
  const val = s.data[idx]
  if (val == null || isNaN(val)) return '-'
  const unit = s.axis === 'right' ? props.yRightLabel : props.yLeftLabel
  return unit ? `${val.toFixed(2)} ${unit}` : val.toFixed(2)
}

const tooltipStyle = computed(() => {
  let left = mouseX.value + 14
  let top = mouseY.value - 60
  if (left + 180 > svgW) left = mouseX.value - 190
  if (top < 0) top = mouseY.value + 14
  return {
    left: `${left}px`,
    top: `${top}px`
  }
})

const onMouseMove = (e) => {
  const rect = wrapRef.value.getBoundingClientRect()
  const relX = e.clientX - rect.left
  const scale = rect.width / svgW
  const localX = relX / scale
  if (localX < padL || localX > svgW - padR) {
    hoverIdx.value = -1
    return
  }
  const ratio = (svgW - padL - padR) / (props.xLabels.length - 1 || 1)
  const idx = Math.round((localX - padL) / ratio)
  if (idx >= 0 && idx < props.xLabels.length) {
    hoverIdx.value = idx
    mouseX.value = localX
    mouseY.value = ((e.clientY - rect.top) / rect.height) * svgH
    emit('hover', { index: idx, label: props.xLabels[idx], series: props.series })
  } else {
    hoverIdx.value = -1
  }
}
</script>

<style scoped>
.line-chart {
  position: relative;
  width: 100%;
  border: 1px solid rgba(0, 212, 255, 0.25);
  border-radius: 3px;
  padding: 4px;
  background: rgba(0, 15, 40, 0.4);
  cursor: crosshair;
  box-sizing: border-box;
}
.lc-svg {
  width: 100%;
  height: auto;
  display: block;
}

.lc-legend {
  display: flex;
  gap: 28px;
  padding: 6px 8px;
}
.lc-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #c0d8ec;
  font-size: 12px;
}
.lc-legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.lc-legend-line {
  width: 18px;
  height: 2px;
  border-radius: 1px;
}

.lc-tooltip {
  position: absolute;
  min-width: 150px;
  background: rgba(0, 30, 80, 0.95);
  border: 1px solid rgba(0, 212, 255, 0.6);
  border-radius: 4px;
  padding: 10px 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(6px);
  pointer-events: none;
}
.lc-tooltip-head {
  color: #ffffff;
  font-size: 12px;
  font-weight: 500;
  padding-bottom: 6px;
  margin-bottom: 4px;
  border-bottom: 1px dashed rgba(0, 212, 255, 0.25);
}
.lc-tooltip-row {
  display: flex;
  align-items: center;
  gap: 6px;
  line-height: 1.8;
}
.lc-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.lc-tooltip-label {
  color: #89b4d9;
  font-size: 12px;
  flex: 1;
}
.lc-tooltip-value {
  font-size: 12px;
  font-weight: 600;
  font-family: 'Consolas', 'Courier New', monospace;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>