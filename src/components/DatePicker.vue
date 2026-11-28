<template>
  <div class="date-picker" :class="{ open: isOpen, disabled, 'has-side': showSideArrows }" ref="wrapRef">
    <template v-if="showSideArrows">
      <button class="dp-side-btn" :disabled="disabled" @click.stop="arrowStep(-1)">&#171;</button>
    </template>
    <template v-if="showSideArrows">
      <input
        class="dp-input"
        type="text"
        :value="displayValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="onInputChange"
        @blur="onInputBlur"
      />
    </template>
    <button v-else class="dp-trigger" :disabled="disabled" @click="toggle">
      <span class="dp-icon">📅</span>
      <span class="dp-value">{{ displayValue || placeholder }}</span>
      <span class="dp-arrow" :class="{ flipped: isOpen }">▼</span>
    </button>
    <template v-if="showSideArrows">
      <button class="dp-side-btn" :disabled="disabled" @click.stop="arrowStep(1)">&#187;</button>
    </template>

    <Teleport to="body">
      <Transition name="dp-fade">
        <div v-if="isOpen" class="dp-panel" :style="panelStyle">
          <div class="dp-header">
            <template v-if="viewLevel === 'day'">
              <button class="dp-nav-btn" @click="shiftYear(-1)" title="上一年">&lt;&lt;</button>
              <button class="dp-nav-btn" @click="shiftMonth(-1)" title="上一月">&lt;</button>
              <button class="dp-title-btn" @click="zoomLevel">{{ headerLabel }}</button>
              <button class="dp-nav-btn" @click="shiftMonth(1)" title="下一月">&gt;</button>
              <button class="dp-nav-btn" @click="shiftYear(1)" title="下一年">&gt;&gt;</button>
            </template>
            <template v-else>
              <button class="dp-nav-btn" @click="shiftYear(-1)" title="上一年">&lt;</button>
              <button class="dp-title-btn" @click="zoomLevel">{{ headerLabel }}</button>
              <button class="dp-nav-btn" @click="shiftYear(1)" title="下一年">&gt;</button>
            </template>
          </div>

          <!-- 选日 -->
          <template v-if="viewLevel === 'day'">
            <div class="dp-week-row">
              <span v-for="w in weekNames" :key="w" class="dp-week-cell">{{ w }}</span>
            </div>
            <div class="dp-day-grid">
              <div
                v-for="(d, i) in days"
                :key="i"
                class="dp-day-cell"
                :class="{ empty: !d, other: d && d.month !== viewMonth, active: d && isSelected(d), current: d && isToday(d) }"
                @click="d && pickDay(d)"
              >{{ d?.day }}</div>
            </div>
          </template>

          <!-- 选月 -->
          <template v-else-if="viewLevel === 'month'">
            <div class="dp-month-grid">
              <div
                v-for="m in 12"
                :key="m"
                class="dp-month-cell"
                :class="{ active: m - 1 === dateObj?.getMonth() && viewYear === dateObj?.getFullYear(), current: m - 1 === currentMonth && viewYear === currentYear }"
                @click="pickMonth(m - 1)"
              >{{ m }}月</div>
            </div>
          </template>

          <!-- 选年 -->
          <template v-else>
            <div class="dp-year-grid">
              <div
                v-for="y in yearRange"
                :key="y"
                class="dp-year-cell"
                :class="{ active: y === dateObj?.getFullYear(), current: y === currentYear }"
                @click="pickYear(y)"
              >{{ y }}</div>
            </div>
          </template>

        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'

interface DayCell {
  year: number
  month: number
  day: number
}

type DPMode = 'date' | 'month' | 'year'
type ViewLevel = 'day' | 'month' | 'year'

const props = withDefaults(defineProps<{
  modelValue?: string | Date | number
  mode?: DPMode
  placeholder?: string
  disabled?: boolean
  minYear?: number
  maxYear?: number
}>(), {
  modelValue: '',
  mode: 'date',
  placeholder: '选择日期',
  disabled: false,
  minYear: 1970,
  maxYear: 2099
})
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | Date | number): void
  (e: 'change', value: string | Date | number): void
}>()

const wrapRef = ref<HTMLDivElement | null>(null)
const isOpen = ref(false)
const pos = ref({ top: 0, left: 0, flipUp: false })

const viewYear = ref(0)
const viewMonth = ref(0)
const viewLevel = ref<ViewLevel>('day')

const weekNames = ['日', '一', '二', '三', '四', '五', '六']
const now = new Date()
const currentYear = now.getFullYear()
const currentMonth = now.getMonth()

const dateObj = computed(() => {
  const v = props.modelValue
  if (v === '' || v === null || v === undefined) return null
  if (v instanceof Date) return Number.isNaN(v) ? null : v
  if (typeof v === 'number') {
    if (v > 1000 && v < 3000) return new Date(v, 0, 1)
    const d = new Date(v)
    return Number.isNaN(d) ? null : d
  }
  const d = new Date(v)
  return Number.isNaN(d) ? null : d
})

const rawYear = computed(() => {
  const v = props.modelValue
  if (typeof v === 'number' && v > 1000 && v < 3000) return v
  return dateObj.value?.getFullYear()
})

const displayValue = computed(() => {
  const d = dateObj.value
  if (!d) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  if (props.mode === 'year') return `${rawYear.value ?? y}`
  if (props.mode === 'month') return `${y}-${m}`
  return `${y}-${m}-${day}`
})

watch(dateObj, (d) => {
  if (d) { viewYear.value = d.getFullYear(); viewMonth.value = d.getMonth() }
  else { viewYear.value = currentYear; viewMonth.value = currentMonth }
  viewLevel.value = props.mode === 'date' ? 'day' : (props.mode === 'month' ? 'month' : 'year')
}, { immediate: true })

watch(() => props.mode, (m) => {
  viewLevel.value = m === 'date' ? 'day' : (m === 'month' ? 'month' : 'year')
})

const showSideArrows = computed(() => props.mode === 'year')

const arrowStep = (delta: number) => {
  if (props.mode === 'year') {
    const cur = rawYear.value ?? currentYear
    let y = cur + delta
    if (y < props.minYear) y = props.minYear
    if (y > props.maxYear) y = props.maxYear
    emit('update:modelValue', y)
    emit('change', y)
  } else if (props.mode === 'month') {
    const base = dateObj.value || new Date()
    let y = base.getFullYear(), m = base.getMonth() + delta
    if (m < 0) { m = 11; y-- }
    if (m > 11) { m = 0; y++ }
    if (y < props.minYear) { y = props.minYear; m = 0 }
    if (y > props.maxYear) { y = props.maxYear; m = 11 }
    const result = new Date(y, m, 1)
    emit('update:modelValue', result)
    emit('change', result)
  }
}

const onInputChange = (e: Event) => {
  if (props.mode === 'year') {
    const v = parseInt((e.target as HTMLInputElement).value, 10)
    if (!isNaN(v)) {
      let y = v
      if (y < props.minYear) y = props.minYear
      if (y > props.maxYear) y = props.maxYear
      emit('update:modelValue', y)
      emit('change', y)
    }
  }
}

const onInputBlur = () => {
  if (props.mode === 'year') {
    const cur = rawYear.value ?? currentYear
    emit('update:modelValue', cur)
    emit('change', cur)
  }
}

const viewStartYear = computed(() => {
  const base = viewYear.value
  return Math.floor(base / 12) * 12
})

const yearRange = computed(() => {
  const start = Math.max(props.minYear, viewStartYear.value)
  const end = Math.min(props.maxYear, viewStartYear.value + 11)
  const arr: number[] = []
  for (let y = start; y <= end; y++) arr.push(y)
  return arr
})

const days = computed<(DayCell | null)[]>(() => {
  const first = new Date(viewYear.value, viewMonth.value, 1)
  const firstDow = first.getDay()
  const daysInMonth = new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
  const prevMonthDays = new Date(viewYear.value, viewMonth.value, 0).getDate()
  const arr: (DayCell | null)[] = []
  for (let i = firstDow - 1; i >= 0; i--) arr.push({ year: viewYear.value, month: viewMonth.value - 1, day: prevMonthDays - i })
  for (let d = 1; d <= daysInMonth; d++) arr.push({ year: viewYear.value, month: viewMonth.value, day: d })
  let tail = (7 - arr.length % 7) % 7
  for (let d = 1; d <= tail; d++) arr.push({ year: viewYear.value, month: viewMonth.value + 1, day: d })
  return arr
})

const panelStyle = computed(() => ({
  position: 'fixed' as const,
  top: `${pos.value.top}px`,
  left: `${pos.value.left}px`,
  transform: pos.value.flipUp ? 'translateY(-100%)' : 'translateY(0)',
  zIndex: 9999
}))

const isSelected = (d: DayCell) => {
  if (!dateObj.value) return false
  return d.year === dateObj.value.getFullYear() && d.month === dateObj.value.getMonth() && d.day === dateObj.value.getDate()
}
const isToday = (d: DayCell) => d.year === currentYear && d.month === currentMonth && d.day === now.getDate()

const calcPos = () => {
  if (!wrapRef.value) return
  const r = wrapRef.value.getBoundingClientRect()
  const panelH = 320
  const flipUp = window.innerHeight - r.bottom < panelH + 20 && r.top > panelH + 20
  pos.value = { top: flipUp ? r.top - 4 : r.bottom + 4, left: r.left, flipUp }
}

const toggle = async () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    if (dateObj.value) { viewYear.value = dateObj.value.getFullYear(); viewMonth.value = dateObj.value.getMonth() }
    viewLevel.value = props.mode === 'date' ? 'day' : (props.mode === 'month' ? 'month' : 'year')
    await nextTick()
    calcPos()
  }
}

const zoomLevel = () => {
  if (props.mode === 'year') return
  if (viewLevel.value === 'day') viewLevel.value = 'month'
  else if (viewLevel.value === 'month') viewLevel.value = 'year'
}

const headerLabel = computed(() => {
  if (viewLevel.value === 'day') return `${viewYear.value}年 ${viewMonth.value + 1}月`
  if (viewLevel.value === 'month') return `${viewYear.value}年`
  return `${viewStartYear.value} - ${viewStartYear.value + 11}`
})

const shiftYear = (delta: number) => {
  let y = viewYear.value + delta
  if (y < props.minYear) y = props.minYear
  if (y > props.maxYear) y = props.maxYear
  viewYear.value = y
}
const shiftMonth = (delta: number) => {
  let m = viewMonth.value + delta
  let y = viewYear.value
  if (m < 0) { m = 11; y-- }
  if (m > 11) { m = 0; y++ }
  if (y < props.minYear) { y = props.minYear; m = 0 }
  if (y > props.maxYear) { y = props.maxYear; m = 11 }
  viewYear.value = y; viewMonth.value = m
}

const pickDay = (d: DayCell) => {
  const realMonth = d.month < 0 ? 11 : (d.month > 11 ? 0 : d.month)
  const realYear = d.month < 0 ? d.year - 1 : (d.month > 11 ? d.year + 1 : d.year)
  if (realMonth !== viewMonth.value) { viewMonth.value = realMonth; viewYear.value = realYear; return }
  const result = new Date(realYear, realMonth, d.day)
  emit('update:modelValue', result)
  emit('change', result)
  isOpen.value = false
}

const pickMonth = (m: number) => {
  const result = new Date(viewYear.value, m, 1)
  emit('update:modelValue', result)
  emit('change', result)
  isOpen.value = false
}
const pickYear = (y: number) => {
  const result = new Date(y, viewMonth.value || 0, 1)
  if (props.mode === 'year') {
    emit('update:modelValue', y); emit('change', y)
  } else {
    emit('update:modelValue', result); emit('change', result)
  }
  isOpen.value = false
}

const close = (e: MouseEvent) => {
  if (!isOpen.value) return
  const target = e.target as HTMLElement
  if (!wrapRef.value?.contains(target) && !target.closest('.dp-panel')) isOpen.value = false
}
const onScroll = () => { if (isOpen.value) calcPos() }

onMounted(() => {
  document.addEventListener('click', close)
  window.addEventListener('scroll', onScroll, true)
  window.addEventListener('resize', onScroll)
})
onUnmounted(() => {
  document.removeEventListener('click', close)
  window.removeEventListener('scroll', onScroll, true)
  window.removeEventListener('resize', onScroll)
})
</script>

<style scoped>
.date-picker { display: inline-block; }
.date-picker.has-side { display: inline-flex; align-items: stretch; }
.date-picker.has-side .dp-trigger { border-radius: 0; }
.date-picker.has-side .dp-side-btn + .dp-trigger { border-left: none; }
.date-picker.has-side .dp-trigger + .dp-side-btn { border-left: none; }
.dp-side-btn {
  width: 28px; height: 30px;
  background: rgba(0,0,0,0.35);
  border: 1px solid rgba(0,212,255,0.4);
  color: #00d4ff;
  cursor: pointer;
  font-size: 13px;
  padding: 0;
  transition: all 0.25s;
  display: flex; align-items: center; justify-content: center;
  line-height: 1;
}
.dp-side-btn:first-child { border-radius: 3px 0 0 3px; }
.dp-side-btn:last-child { border-radius: 0 3px 3px 0; }
.dp-side-btn:hover:not(:disabled) { background: rgba(0,212,255,0.25); color: #fff; }
.dp-side-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.date-picker.open .dp-side-btn { border-color: #00d4ff; }
.dp-input {
  width: 80px;
  height: 30px;
  background: rgba(0,0,0,0.35);
  border: 1px solid rgba(0,212,255,0.4);
  color: #ffffff;
  font-size: 13px;
  font-family: inherit;
  text-align: center;
  outline: none;
  padding: 0 4px;
  transition: all 0.25s;
}
.dp-input:hover:not(:disabled) { border-color: #00d4ff; }
.dp-input:focus { border-color: #00d4ff; box-shadow: 0 0 6px rgba(0,212,255,0.3); }
.dp-input:disabled { opacity: 0.5; cursor: not-allowed; }
.dp-trigger {
  min-width: 148px;
  height: 30px;
  padding: 0 28px 0 28px;
  background: rgba(0,0,0,0.35);
  border: 1px solid rgba(0,212,255,0.4);
  border-radius: 3px;
  color: #ffffff;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.25s;
}
.dp-trigger:hover:not(:disabled) { border-color: #00d4ff; box-shadow: 0 0 6px rgba(0,212,255,0.3); }
.date-picker.open .dp-trigger { border-color: #00d4ff; box-shadow: 0 0 10px rgba(0,212,255,0.5); }
.date-picker.disabled .dp-trigger { opacity: 0.5; cursor: not-allowed; }
.dp-icon { position: absolute; left: 8px; font-size: 12px; }
.dp-value { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dp-arrow {
  position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
  color: #00d4ff; font-size: 10px; transition: transform 0.25s;
}
.dp-arrow.flipped { transform: translateY(-50%) rotate(180deg); }
.dp-fade-enter-active, .dp-fade-leave-active { transition: opacity 0.15s; }
.dp-fade-enter-from, .dp-fade-leave-to { opacity: 0; transform: translateY(-6px); }
</style>

<style>
.dp-panel {
  width: 260px;
  background: rgba(5, 20, 55, 0.97);
  border: 1px solid rgba(0, 212, 255, 0.5);
  border-radius: 5px;
  box-shadow: 0 8px 28px rgba(0, 60, 150, 0.5);
  padding: 12px;
  backdrop-filter: blur(8px);
  user-select: none;
}

.dp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2px;
  margin-bottom: 10px;
}
.dp-nav-btn {
  width: 28px; height: 28px;
  background: rgba(0,212,255,0.08);
  border: 1px solid rgba(0,212,255,0.25);
  color: #00d4ff;
  border-radius: 3px;
  cursor: pointer;
  font-size: 13px;
  line-height: 1;
  font-family: inherit;
  padding: 0;
  transition: all 0.15s;
}
.dp-nav-btn:hover { background: rgba(0,212,255,0.25); }
.dp-title-btn {
  flex: 1;
  height: 28px;
  background: transparent;
  border: 1px solid rgba(0,212,255,0.2);
  color: #ffffff;
  border-radius: 3px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  transition: all 0.15s;
}
.dp-title-btn:hover { background: rgba(0,212,255,0.15); border-color: rgba(0,212,255,0.5); }

.dp-week-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 4px;
}
.dp-week-cell {
  text-align: center;
  color: #89b4d9;
  font-size: 11px;
  padding: 4px 0;
}
.dp-day-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}
.dp-day-cell {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,212,255,0.04);
  border: 1px solid transparent;
  border-radius: 3px;
  color: #c0d8ec;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.12s;
}
.dp-day-cell:hover:not(.empty) { background: rgba(0,212,255,0.2); color: #fff; }
.dp-day-cell.empty { background: transparent; cursor: default; }
.dp-day-cell.other { color: rgba(137,180,217,0.4); }
.dp-day-cell.active {
  background: linear-gradient(135deg, #00a8cc, #00d4ff);
  color: #001830; font-weight: 600;
  box-shadow: 0 0 8px rgba(0,212,255,0.5);
}
.dp-day-cell.current:not(.active) { border-color: rgba(255,200,50,0.6); color: #ffcc00; }

.dp-month-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; padding: 4px;
}
.dp-month-cell {
  height: 42px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,212,255,0.06);
  border: 1px solid rgba(0,212,255,0.2);
  border-radius: 3px;
  color: #c0d8ec; font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
}
.dp-month-cell:hover { background: rgba(0,212,255,0.2); border-color: #00d4ff; color: #fff; }
.dp-month-cell.active {
  background: linear-gradient(135deg, #00a8cc, #00d4ff);
  border-color: #00d4ff; color: #001830; font-weight: 600;
  box-shadow: 0 0 10px rgba(0,212,255,0.5);
}
.dp-month-cell.current:not(.active) { border-color: rgba(255,200,50,0.6); color: #ffcc00; }

.dp-year-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; padding: 6px;
}
.dp-year-cell {
  height: 48px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,212,255,0.04);
  border-radius: 4px;
  color: #c0d8ec; font-size: 14px; font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}
.dp-year-cell:hover {
  background: rgba(0,212,255,0.18);
  color: #fff;
  transform: translateY(-1px);
}
.dp-year-cell.active {
  background: linear-gradient(135deg, #00a8cc, #00d4ff);
  color: #001830; font-weight: 700; font-size: 15px;
  box-shadow: 0 4px 12px rgba(0,212,255,0.45);
}
.dp-year-cell.current:not(.active) {
  color: #ffcc00;
  background: rgba(255,200,50,0.1);
}

</style>