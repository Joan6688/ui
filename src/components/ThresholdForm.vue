<template>
  <Form label-width="80px" label-align="right">
    <FormItem label="阈值类型" required>
      <Select v-model="form.type" :options="typeOptions" placeholder="请选择阈值类型" />
    </FormItem>
    <FormItem label="报警阈值" required :error="form.value && Number(form.value) <= 0 ? '阈值必须大于 0' : ''">
      <Input v-model="form.value" placeholder="请填写报警阈值" unit="m" clearable />
    </FormItem>
    <FormItem label="备注">
      <Input v-model="form.remark" placeholder="选填" clearable />
    </FormItem>
  </Form>
</template>

<script setup>
import { reactive } from 'vue'
import Form from './Form.vue'
import FormItem from './FormItem.vue'
import Select from './Select.vue'
import Input from './Input.vue'

const form = reactive({ type: '', value: '', remark: '' })
const typeOptions = [
  { label: '水位阈值', value: 'water' },
  { label: '流量阈值', value: 'flow' },
  { label: '库容阈值', value: 'volume' }
]

defineExpose({ form })
</script>