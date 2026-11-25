<template>
  <div v-if="visible" class="gp-mask" @click.self="$emit('close')">
    <div class="gate-panel">
      <div class="gp-header">
        <span class="gp-header-bar"></span>
        <span class="gp-header-icon">🚪</span>
        <span class="gp-header-title">闸门调度</span>
        <div class="gp-header-deco"><span></span><span></span><span></span></div>
        <button class="gp-close" @click="$emit('close')">✕</button>
      </div>

    <div class="gp-body">
      <div class="gp-left">
        <div class="gp-panel-title">
          <span class="gp-title-bar"></span>
          <span>历史列表</span>
          <button class="gp-add-btn" @click="$emit('create')">+</button>
        </div>

        <div class="gp-list">
          <div
            v-for="(item, i) in list"
            :key="i"
            class="gp-list-item"
            :class="{ active: currentId === item.id }"
            @click="select(item)"
          >
            <span class="gp-item-name">{{ item.name }}</span>
            <div class="gp-item-actions">
              <button
                v-if="currentId === item.id"
                class="gp-mini-btn"
                @click.stop="$emit('apply', item)"
              >应用</button>
              <button
                v-else
                class="gp-mini-btn gp-mini-edit"
                @click.stop="$emit('edit', item)"
              >编辑</button>
              <button
                class="gp-mini-btn gp-mini-del"
                @click.stop="$emit('remove', item)"
              >删除</button>
            </div>
          </div>
        </div>

        <button class="gp-compare-btn" @click="$emit('compare')">调度对比</button>
      </div>

      <div class="gp-right">
        <div class="gp-row gp-row-top">
          <label>调度名称：</label>
          <Input
            :model-value="current?.name || ''"
            placeholder="请输入调度名称"
            style="flex:1;max-width:280px;"
            @update:model-value="val => updateName(val)"
          />
          <span class="gp-help-icon">?</span>
          <span class="gp-mod-time">修改时间：{{ current?.modifyTime || '--' }}</span>
        </div>

        <div class="gp-chart-block">
          <div class="gp-chart-label">当前应用：<small>m</small></div>
          <LineChart
            :series="appliedSeries"
            :x-labels="xLabels"
            :y-left-label="'m'"
            :y-left-min="0"
            :y-left-max="8"
            :show-legend="false"
          />
        </div>

        <div class="gp-chart-block">
          <div class="gp-chart-label">当前调度：<small>m</small></div>
          <LineChart
            :series="scheduledSeries"
            :x-labels="xLabels2"
            :y-left-label="'m'"
            :y-left-min="0"
            :y-left-max="8"
            :show-legend="false"
          />
        </div>

        <div class="gp-footer">
          <Button type="primary" size="md" @click="$emit('apply', current)">应用</Button>
          <Button size="md" @click="$emit('remove', current)">删除</Button>
          <Button type="success" size="md" @click="$emit('save', current)">保存</Button>
          <Button type="ghost" size="md" @click="$emit('duplicate', current)">创建副本</Button>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ChartSeries } from '../types'
import Input from './Input.vue'
import Button from './Button.vue'
import LineChart from './LineChart.vue'


export interface ScheduleListItem {
  id: string | number;
  name: string;
  modifyTime?: string;
}

export interface GateSchedulePanelProps {
  visible?: boolean;
  list?: ScheduleListItem[];
  currentId?: string | number | null;
  appliedSeriesData?: ChartSeries[];
  scheduledSeriesData?: ChartSeries[];
}

const props = withDefaults(defineProps<GateSchedulePanelProps>(), {
  visible: false,
  list: () => [],
  currentId: null,
  appliedSeriesData: () => [],
  scheduledSeriesData: () => []
})

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'select', item: ScheduleListItem): void;
  (e: 'create'): void;
  (e: 'apply', item: ScheduleListItem | null): void;
  (e: 'edit', item: ScheduleListItem): void;
  (e: 'remove', item: ScheduleListItem | null): void;
  (e: 'save', item: ScheduleListItem | null): void;
  (e: 'duplicate', item: ScheduleListItem | null): void;
  (e: 'compare'): void;
  (e: 'update-name', data: { id: string | number | undefined; name: string }): void;
}>()

const current = computed(() => props.list.find(i => i.id === props.currentId) || props.list[0] || null)

const xLabels = ['0', '5', '10', '15', '20', '25', '30', '35']
const xLabels2 = ['0', '5', '10', '15', '20', '25', '30', '35', '38.5']

const appliedSeries = computed<ChartSeries[]>(() => props.appliedSeriesData.length ? props.appliedSeriesData : [
  { name: '当前应用', color: '#00dc78', data: [6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 6.4, 0.5] }
])
const scheduledSeries = computed<ChartSeries[]>(() => props.scheduledSeriesData.length ? props.scheduledSeriesData : [
  { name: '当前调度', color: '#00dc78', data: [6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 1.0, 0] }
])

function select(item: ScheduleListItem) { emit('select', item) }
function updateName(val: string) { emit('update-name', { id: current.value?.id, name: val }) }
</script>

<style scoped>
.gp-mask {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(2, 10, 30, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}
.gate-panel {
  width: 960px;
  max-width: 96vw;
  max-height: 92vh;
  background: rgba(5, 20, 55, 0.97);
  border: 1px solid rgba(0, 212, 255, 0.45);
  border-radius: 6px;
  box-shadow: 0 0 24px rgba(0, 120, 220, 0.4), 0 12px 48px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.gp-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  height: 42px;
  background: linear-gradient(90deg, #00a8cc, #0055aa);
  border-bottom: 2px solid rgba(255, 200, 50, 0.6);
  flex-shrink: 0;
}
.gp-header-bar {
  width: 4px; height: 20px;
  background: linear-gradient(180deg, #ffdd00, #ff8800);
  border-radius: 2px;
  box-shadow: 0 0 6px rgba(255, 200, 50, 0.8);
}
.gp-header-icon { font-size: 16px; }
.gp-header-title {
  color: #fff; font-size: 16px; font-weight: 600; letter-spacing: 2px;
}
.gp-header-deco { flex: 1; display: flex; justify-content: flex-end; gap: 3px; }
.gp-header-deco span {
  width: 18px; height: 4px;
  background: linear-gradient(90deg, rgba(255,255,255,0.3), transparent);
  border-radius: 1px;
}
.gp-close {
  width: 28px; height: 28px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff; border-radius: 3px;
  cursor: pointer; font-size: 13px; line-height: 1;
  transition: all 0.2s; font-family: inherit;
}
.gp-close:hover {
  background: #ff3333; border-color: #ff6666;
  box-shadow: 0 0 10px rgba(255, 50, 50, 0.6);
}
.gp-body {
  display: flex;
  flex: 1;
  min-height: 0;
}
.gp-left {
  width: 200px;
  border-right: 1px solid rgba(0, 212, 255, 0.25);
  display: flex;
  flex-direction: column;
  padding: 14px 12px;
  background: rgba(0, 15, 40, 0.4);
}
.gp-panel-title {
  display: flex; align-items: center; gap: 8px;
  color: #fff; font-size: 14px; font-weight: 600;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.25);
}
.gp-title-bar {
  width: 3px; height: 14px;
  background: linear-gradient(180deg, #00d4ff, #0088cc);
  border-radius: 2px;
}
.gp-add-btn {
  margin-left: auto;
  width: 24px; height: 24px;
  border: 1px dashed rgba(0, 212, 255, 0.6);
  background: transparent;
  color: #00d4ff; font-size: 16px; line-height: 1;
  border-radius: 3px; cursor: pointer;
  transition: all 0.15s;
}
.gp-add-btn:hover {
  background: rgba(0, 212, 255, 0.15);
  box-shadow: 0 0 6px rgba(0, 212, 255, 0.4);
}
.gp-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;
}
.gp-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  margin-bottom: 4px;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid transparent;
}
.gp-list-item:hover {
  background: rgba(0, 212, 255, 0.1);
}
.gp-list-item.active {
  background: rgba(0, 212, 255, 0.18);
  border-color: rgba(0, 212, 255, 0.5);
  box-shadow: inset 0 0 8px rgba(0, 212, 255, 0.2);
}
.gp-item-name {
  color: #d8e8f6; font-size: 13px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  flex: 1;
}
.gp-item-actions {
  display: flex; gap: 4px; margin-left: 6px;
}
.gp-mini-btn {
  padding: 3px 8px;
  font-size: 11px;
  border-radius: 2px;
  border: 1px solid rgba(0, 212, 255, 0.5);
  background: rgba(0, 40, 90, 0.6);
  color: #00d4ff;
  cursor: pointer;
  transition: all 0.15s;
}
.gp-mini-btn:hover {
  background: rgba(0, 212, 255, 0.2);
  box-shadow: 0 0 4px rgba(0, 212, 255, 0.4);
}
.gp-mini-edit { border-color: rgba(255, 200, 50, 0.6); color: #ffc832; }
.gp-mini-edit:hover { background: rgba(255, 200, 50, 0.15); }
.gp-mini-del { border-color: rgba(255, 100, 100, 0.5); color: #ff6464; }
.gp-mini-del:hover { background: rgba(255, 100, 100, 0.15); }
.gp-compare-btn {
  width: 100%;
  padding: 10px;
  margin-top: 8px;
  background: rgba(0, 120, 200, 0.2);
  border: 1px solid rgba(0, 212, 255, 0.5);
  border-radius: 3px;
  color: #00d4ff;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
}
.gp-compare-btn:hover {
  background: rgba(0, 212, 255, 0.2);
  box-shadow: 0 0 8px rgba(0, 212, 255, 0.4);
}
.gp-right {
  flex: 1;
  padding: 14px 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}
.gp-row-top {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.gp-row-top label {
  color: #89b4d9; font-size: 13px; white-space: nowrap;
}
.gp-help-icon {
  display: inline-flex;
  width: 20px; height: 20px;
  border-radius: 50%;
  border: 1px solid rgba(0, 212, 255, 0.5);
  background: rgba(0, 40, 90, 0.5);
  color: #00d4ff; font-size: 12px; font-weight: 700;
  align-items: center; justify-content: center;
  cursor: help;
}
.gp-mod-time {
  color: #89b4d9; font-size: 12px; margin-left: auto; white-space: nowrap;
}
.gp-chart-block {
  display: flex; flex-direction: column; gap: 6px;
}
.gp-chart-label {
  color: #fff; font-size: 13px; font-weight: 500;
}
.gp-chart-label small {
  color: #89b4d9; font-weight: normal; margin-left: 4px;
}
.gp-footer {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 212, 255, 0.2);
  margin-top: auto;
}
</style>