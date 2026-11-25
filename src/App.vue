<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="logo">组件库预览</div>
      <ul class="menu-list">
        <li 
          v-for="item in menuItems" 
          :key="item.key"
          :class="{ active: currentMenu === item.key }"
          @click="currentMenu = item.key"
        >
          {{ item.label }}
        </li>
      </ul>
    </aside>

    <main class="main-content">
      <TitleBar :title="currentMenuLabel" :showBack="false" />
      
      <div class="content-wrapper">
        <div v-show="currentMenu === 'basic'" class="demo-grid">
          <PanelCard title="Button 按钮" subtitle="基础/尺寸/状态/勾选">
            <div class="demo-row">
              <Button type="primary">主要</Button>
              <Button type="warn">警告</Button>
              <Button type="success">成功</Button>
              <Button type="ghost">幽灵</Button>
            </div>
            <div class="demo-row" style="margin-top:10px">
              <Button shape="circle" type="success" v-model="dot2" />
              <Button shape="checkbox" v-model="chk1">选项</Button>
              <Button block>整行宽</Button>
            </div>
          </PanelCard>
      
          <PanelCard title="ActiveButton 切换按钮">
            <div class="demo-row">
              <ActiveButton v-model:active="a1" color="blue">按钮</ActiveButton>
              <ActiveButton v-model:active="a2" color="orange">按钮</ActiveButton>
              <ActiveButton v-model:active="a3" color="green">按钮</ActiveButton>
            </div>
          </PanelCard>
          <PanelCard title="ProgressBar 进度条">
            <ProgressBar v-model="progress" :show-value="true" />
          </PanelCard>
          <PanelCard title="TagBadge 标签徽章 + InfoItem 信息键值">
            <div class="demo-row">
              <TagBadge text="方案" />
              <TagBadge type="warn" text="方案" />
              <TagBadge type="success" text="方案" />
            </div>
            <div style="margin-top:10px">
              <InfoItem label="流量" value="1200 m³/s" />
              <InfoItem label="水位" value="206.2 m" />
            </div>
          </PanelCard>
        </div>

      
        <div v-show="currentMenu === 'form'" class="demo-grid">
          <PanelCard title="Input 输入框" subtitle="可清除/带单位">
            <div class="demo-row">
              <Input v-model="v1" placeholder="请输入" clearable style="width:180px" />
              <Input v-model="v2" placeholder="请输入" unit="m³/s" clearable style="width:200px" />
            </div>
          </PanelCard>
          <PanelCard title="InputNumber 数字输入" subtitle="步进/范围/单位">
            <InputNumber v-model="v3" :min="0" :max="2000" :step="10" unit="mm" />
          </PanelCard>
          <PanelCard title="Select 下拉选择">
            <div class="demo-row">
              <Select v-model="v4" :options="selectOptions" />
            </div>
          </PanelCard>
          <PanelCard title="DatePicker 日历选择器" subtitle="年/月/日">
            <div class="demo-row">
              <DatePicker v-model="d1" mode="year" />
              <DatePicker v-model="d2" mode="month" />
              <DatePicker v-model="d3" mode="date" />
            </div>
          </PanelCard>
          <PanelCard title="Form 表单容器 + FormItem 表单项" subtitle="label对齐/必填/校验/多列">
            <Form label-width="80px" :cols="1" gap="12px">
              <FormItem label="用户名" required>
                <Input v-model="formData.username" placeholder="请输入用户名" clearable />
              </FormItem>
              <FormItem label="密码" required>
                <Input v-model="formData.password" type="password" placeholder="请输入密码" />
              </FormItem>
              <FormItem label="类型">
                <Select v-model="formData.type" :options="selectOptions" />
              </FormItem>
              <FormItem label="备注">
                <Input v-model="formData.desc" placeholder="选填" clearable />
              </FormItem>
            </Form>
          </PanelCard>
        </div>

      
        <div v-show="currentMenu === 'data'" class="demo-grid">
          <PanelCard title="TabGroup 标签组">
            <TabGroup v-model="tab" :tabs="tabList" />
          </PanelCard>
          <PanelCard title="LineChart 折线图" subtitle="双Y轴/图例/悬浮">
            <LineChart
              :series="chartSeries"
              :x-labels="chartX"
              y-left-label="m³/s"
              y-right-label="m"
              :y-left-min="0" :y-left-max="10000"
              :y-right-min="205" :y-right-max="216"
            />
          </PanelCard>
          <PanelCard title="Table 数据表格" subtitle="多选/工具栏/斑马纹">
            <Table :columns="cols" :data="rows" row-key="id" v-model="selected" :bordered="false">
              <Button type="primary" size="md">查询</Button>
            </Table>
          </PanelCard>
        </div>

        
        <div v-show="currentMenu === 'panel'" class="demo-grid">
          <PanelCard title="Modal 弹窗 + ThresholdForm 阈值表单">
            <div class="demo-row">
              <Button type="primary" @click="showModal = true">打开弹窗</Button>
            </div>
          </PanelCard>
          <PanelCard title="StorageCurvePanel 库容曲线弹窗">
            <div class="demo-row">
              <Button type="primary" @click="showCurve = true">📊 打开库容曲线</Button>
            </div>
          </PanelCard>
          <PanelCard title="GateSchedulePanel 闸门调度面板">
            <div class="demo-row">
              <Button type="primary" @click="showGate = true">🚪 打开闸门调度</Button>
            </div>
          </PanelCard>
        </div>
      </div>
    </main>

    <Modal v-model:visible="showModal" title="新增阈值信息" :width="420" @confirm="handleConfirm">
      <ThresholdForm ref="formRef" />
    </Modal>
    <StorageCurvePanel
      v-model:visible="showCurve"
      v-model:year="yearVal"
      title="库容曲线"
      :series="curveSeries"
      :x-labels="curveX"
      y-left-label="m"
      y-right-label="km²"
      :y-left-min="185" :y-left-max="216"
      :y-right-min="0" :y-right-max="12"
    />
    <GateSchedulePanel
      :visible="showGate"
      :list="gateList"
      :current-id="gateCurrent"
      @close="showGate = false"
      @select="gateCurrent = $event.id"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

import type { SelectOption, ChartSeries, TableColumn } from './types'

import type { ScheduleListItem } from './components/GateSchedulePanel.vue'

import TitleBar from './components/TitleBar.vue'
import PanelCard from './components/PanelCard.vue'
import Button from './components/Button.vue'
import Input from './components/Input.vue'
import InputNumber from './components/InputNumber.vue'
import Select from './components/Select.vue'
import Form from './components/Form.vue'
import FormItem from './components/FormItem.vue'
import DatePicker from './components/DatePicker.vue'
import TabGroup from './components/TabGroup.vue'
import ActiveButton from './components/ActiveButton.vue'
import ProgressBar from './components/ProgressBar.vue'
import LineChart from './components/LineChart.vue'
import Table from './components/Table.vue'
import TagBadge from './components/TagBadge.vue'
import InfoItem from './components/InfoItem.vue'
import Modal from './components/Modal.vue'
import ThresholdForm from './components/ThresholdForm.vue'
import StorageCurvePanel from './components/StorageCurvePanel.vue'
import GateSchedulePanel from './components/GateSchedulePanel.vue'


interface MenuItem {
  key: string;
  label: string;
}

const menuItems: MenuItem[] = [
  { key: 'basic', label: '基础组件' },
  { key: 'form', label: '表单组件' },
  { key: 'data', label: '数据展示' },
  { key: 'panel', label: '弹窗与面板' }
]

const currentMenu = ref<string>('basic')
const currentMenuLabel = computed(() => menuItems.find(m => m.key === currentMenu.value)?.label || '')


const v1 = ref<string>('')
const v2 = ref<string>('')
const v3 = ref<number>(999)
const v4 = ref<string>('default')
const formData = reactive({ username: '', password: '', type: 'default', desc: '' })
const d1 = ref<number>(2024)
const d2 = ref<Date>(new Date(2024, 5, 1))
const d3 = ref<Date>(new Date())
const tab = ref<string>('p1')
const a1 = ref<boolean>(false)
const a2 = ref<boolean>(true)
const a3 = ref<boolean>(false)
const progress = ref<number>(33)
const dot2 = ref<boolean>(true)
const chk1 = ref<boolean>(true)

const selectOptions: SelectOption[] = [
  { label: '默认配置', value: 'default' },
  { label: '高级配置', value: 'custom' }
]
const tabList: SelectOption[] = [
  { label: '方案1', value: 'p1' },
  { label: '方案2', value: 'p2' }
]

const chartX: string[] = ['11-21 07:00', '11-21 13:00', '11-21 19:00', '11-22 01:00', '11-22 07:00']
const chartSeries: ChartSeries[] = [
  { name: '入库流量', color: '#00d4ff', axis: 'left', data: [1200, 6400, 9800, 5200, 1400] },
  { name: '出库流量', color: '#00dc78', axis: 'left', data: [900, 4200, 7800, 4600, 1200] },
  { name: '库水位', color: '#ff8800', axis: 'right', data: [206.2, 212.5, 215.8, 213.1, 208.4] }
]

const cols: TableColumn[] = [
  { key: 'name', label: '名称', width: '120px' },
  { key: 'type', label: '类型', width: '100px' },
  { key: 'value', label: '阈值', width: '100px', align: 'right' }
]
const rows = [
  { id: 1, name: '水位报警', type: '预警', value: 210.5, status: true },
  { id: 2, name: '流量报警', type: '紧急', value: 8000, status: true },
  { id: 3, name: '库容报警', type: '一般', value: 10000, status: false }
]
const selected = ref<(string | number)[]>([1])

const showModal = ref<boolean>(false)
const formRef = ref<any>(null)
const handleConfirm = () => {
  const f = formRef.value?.form
  alert(`已提交：${f?.type} / ${f?.value}`)
  showModal.value = false
}

const showCurve = ref<boolean>(false)
const yearVal = ref<number>(2024)
const curveSeries: ChartSeries[] = [
  { name: '水位', color: '#00d4ff', data: [185, 192, 198, 202, 206, 209, 211, 213, 214.5, 215.8] },
  { name: '面积', color: '#ff8800', axis: 'right', data: [0.5, 1.8, 3.0, 4.2, 5.5, 6.8, 7.8, 8.5, 9.0, 9.5] }
]
const curveX: number[] = [1, 2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000]

const showGate = ref<boolean>(false)
const gateCurrent = ref<number>(1)

const gateList: ScheduleListItem[] = [
  { id: 1, name: '默认', modifyTime: '2024-11-26 14:29:59' },
  { id: 2, name: '保大坝', modifyTime: '2024-11-25 09:10:30' },
  { id: 3, name: '保下涨', modifyTime: '2024-11-24 16:45:22' }
]
</script>

<style>
html, body, #app { height: 100%; margin: 0; padding: 0; background: #051228; }
body { font-family: -apple-system, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif; color: #ffffff; }
* { box-sizing: border-box; }
</style>

<style scoped>

.app-layout {
  display: flex;
  height: 100vh;
  background:
    radial-gradient(ellipse at 30% 0%, rgba(0,180,255,0.15), transparent 60%),
    radial-gradient(ellipse at 80% 100%, rgba(0,100,200,0.12), transparent 50%),
    #051228;
  overflow: hidden;
  position: relative;
}
.app-layout::before {
  content: '';
  position: fixed; inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px);
  background-size: 40px 40px;
  z-index: 0;
}


.sidebar {
  width: 220px;
  background: rgba(5, 20, 55, 0.95);
  border-right: 1px solid rgba(0, 212, 255, 0.3);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}
.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-weight: bold;
  color: #00d4ff;
  font-size: 18px;
  letter-spacing: 2px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
}
.menu-list {
  list-style: none;
  padding: 10px 0;
  margin: 0;
  flex: 1;
}
.menu-list li {
  padding: 14px 20px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  color: #a0c4e4;
}
.menu-list li:hover {
  background: rgba(0, 212, 255, 0.1);
  color: #fff;
}
.menu-list li.active {
  background: rgba(0, 212, 255, 0.2);
  border-right: 3px solid #00d4ff;
  color: #00d4ff;
  font-weight: 500;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  z-index: 1;
}
.content-wrapper {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}


.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
}

.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}
</style>