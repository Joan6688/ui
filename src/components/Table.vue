<template>
  <div class="data-table" :class="{ 'dt-bordered': bordered }">
    <div v-if="$slots.toolbar || $slots.default" class="dt-toolbar">
      <slot />
    </div>
    <div class="dt-scroll">
      <table class="dt-table">
        <thead>
          <tr>
            <th v-if="selectable" class="dt-col-check">
              <span
                class="dt-checkbox"
                :class="{ checked: isAllSelected, indeterminate: !isAllSelected && selectedKeys.length > 0 }"
                @click="toggleSelectAll"
              >
                <span v-if="isAllSelected" class="dt-check-mark">✓</span>
                <span v-else-if="!isAllSelected && selectedKeys.length > 0" class="dt-check-mark">-</span>
              </span>
            </th>
            <th
              v-for="col in columns"
              :key="col.key"
              :style="{ minWidth: col.width, textAlign: col.align || 'left' }"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, ri) in data"
            :key="row[rowKey] ?? ri"
            class="dt-row"
            :class="{ 'dt-row-selected': selectedKeys.includes(row[rowKey] ?? ri) }"
            @click="selectable && toggleRow(row[rowKey] ?? ri)"
          >
            <td v-if="selectable" class="dt-col-check" @click.stop>
              <span
                class="dt-checkbox"
                :class="{ checked: selectedKeys.includes(row[rowKey] ?? ri) }"
                @click="toggleRow(row[rowKey] ?? ri)"
              >
                <span v-if="selectedKeys.includes(row[rowKey] ?? ri)" class="dt-check-mark">✓</span>
              </span>
            </td>
            <td
              v-for="col in columns"
              :key="col.key"
              :style="{ textAlign: col.align || 'left' }"
            >
              <span v-if="col.type === 'tag'">
                <span v-if="row[col.key]" class="dt-tag dt-tag-ok">✓</span>
                <span v-else class="dt-tag dt-tag-no">✗</span>
              </span>
              <span v-else>{{ row[col.key] ?? '-' }}</span>
            </td>
          </tr>
          <tr v-if="!data.length" class="dt-empty">
            <td :colspan="(selectable ? 1 : 0) + columns.length" class="dt-empty-cell">暂无数据</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="$slots.footer" class="dt-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, ref, watch } from 'vue'
import type { TableColumn } from '../types'


export interface TableProps<T = any> {
  columns: TableColumn[];
  data: T[];
  selectable?: boolean;
  rowKey?: string;
  modelValue?: (string | number)[];
  bordered?: boolean;
}

const props = withDefaults(defineProps<TableProps<T>>(), {
  data: () => [],
  selectable: true,
  rowKey: 'id',
  modelValue: () => [],
  bordered: true
})

// 定义 Emits 接口
const emit = defineEmits<{
  (e: 'update:modelValue', val: (string | number)[]): void;
  (e: 'selection-change', val: (string | number)[]): void;
}>()

const selectedKeys = ref<(string | number)[]>([...props.modelValue])

watch(() => props.modelValue, v => { selectedKeys.value = [...v] })

const isAllSelected = computed(() => {
  if (!props.data.length) return false
  return props.data.every((row: T) => selectedKeys.value.includes(row[props.rowKey]))
})

function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedKeys.value = []
  } else {
    selectedKeys.value = props.data.map((row: T) => row[props.rowKey])
  }
  sync()
}

function toggleRow(key: string | number) {
  const idx = selectedKeys.value.indexOf(key)
  if (idx >= 0) selectedKeys.value.splice(idx, 1)
  else selectedKeys.value.push(key)
  sync()
}

function sync() {
  emit('update:modelValue', [...selectedKeys.value])
  emit('selection-change', selectedKeys.value)
}

defineExpose({
  clearSelection: () => { selectedKeys.value = []; sync() },
  selectAll: () => { selectedKeys.value = props.data.map((r: T) => r[props.rowKey]); sync() },
  selectedKeys
})
</script>

<style scoped>
.data-table { overflow: hidden; }
.dt-bordered {
  border: 1px solid rgba(0, 212, 255, 0.35);
  border-radius: 4px;
  background: rgba(5, 20, 55, 0.85);
}
.dt-toolbar {
  display: flex; gap: 10px; align-items: center; flex-wrap: wrap;
  padding: 10px 14px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.25);
  background: linear-gradient(180deg, rgba(0, 120, 200, 0.18), transparent);
}
.dt-scroll { overflow-x: auto; overflow-y: auto; max-height: 420px; }
.dt-table { width: 100%; border-collapse: collapse; font-size: 13px; color: #d8e8f6; }
.dt-table thead { position: sticky; top: 0; z-index: 1; }
.dt-table thead th {
  background: linear-gradient(180deg, rgba(0, 120, 200, 0.35), rgba(0, 60, 140, 0.2));
  color: #ffffff; font-weight: 600; padding: 10px 12px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.45);
  letter-spacing: 1px; white-space: nowrap; font-size: 12px;
}
.dt-table tbody tr { transition: background 0.15s; cursor: pointer; }
.dt-table tbody tr:hover { background: rgba(0, 212, 255, 0.1); }
.dt-table tbody tr:nth-child(even) { background: rgba(0, 40, 90, 0.35); }
.dt-table tbody tr:nth-child(even):hover { background: rgba(0, 212, 255, 0.12); }
.dt-table tbody tr.dt-row-selected { background: rgba(0, 212, 255, 0.18) !important; }
.dt-table tbody td {
  padding: 10px 12px; border-bottom: 1px solid rgba(0, 212, 255, 0.1);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.dt-col-check { width: 44px; text-align: center !important; }
.dt-checkbox {
  display: inline-flex; align-items: center; justify-content: center;
  width: 16px; height: 16px; border: 1px solid rgba(0, 212, 255, 0.5);
  background: rgba(0, 30, 80, 0.6); border-radius: 2px; cursor: pointer;
  transition: all 0.15s; user-select: none; position: relative;
}
.dt-checkbox:hover { border-color: #00d4ff; box-shadow: 0 0 6px rgba(0, 212, 255, 0.4); }
.dt-checkbox.checked { background: linear-gradient(135deg, #00d4ff, #0088cc); border-color: #00d4ff; box-shadow: 0 0 8px rgba(0, 212, 255, 0.5); }
.dt-checkbox.indeterminate { background: linear-gradient(135deg, #00d4ff, #0088cc); border-color: #00d4ff; }
.dt-check-mark { color: #ffffff; font-size: 11px; font-weight: 700; line-height: 1; }
.dt-tag { display: inline-block; width: 18px; height: 18px; line-height: 18px; text-align: center; border-radius: 50%; font-size: 11px; font-weight: 700; }
.dt-tag-ok { background: rgba(0, 220, 120, 0.2); color: #00dc78; border: 1px solid rgba(0, 220, 120, 0.5); }
.dt-tag-no { background: rgba(255, 80, 80, 0.2); color: #ff5050; border: 1px solid rgba(255, 80, 80, 0.5); }
.dt-empty td { text-align: center; padding: 40px 0; color: #5a7fa0; cursor: default; }
.dt-empty tr:hover { background: transparent !important; }
.dt-footer {
  display: flex; justify-content: flex-end; align-items: center;
  padding: 10px 14px; border-top: 1px solid rgba(0, 212, 255, 0.25);
  background: linear-gradient(0deg, rgba(0, 120, 200, 0.15), transparent); gap: 10px;
}
</style>