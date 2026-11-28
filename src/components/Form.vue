<template>
  <form class="tech-form" :style="formStyle" @submit.prevent>
    <slot />
  </form>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'

const props = withDefaults(defineProps<{
  labelWidth?: string
  labelAlign?: string
  gap?: string
  cols?: number
}>(), {
  labelWidth: '80px',
  labelAlign: 'right',
  gap: '16px',
  cols: 1
})

provide('tech-form', {
  labelWidth: computed(() => props.labelWidth),
  labelAlign: computed(() => props.labelAlign)
})

const formStyle = computed(() => ({
  '--tf-label-width': props.labelWidth,
  '--tf-label-align': props.labelAlign,
  '--tf-gap': props.gap,
  '--tf-cols': props.cols
}))
</script>

<style scoped>
.tech-form {
  display: grid;
  grid-template-columns: repeat(var(--tf-cols), 1fr);
  gap: var(--tf-gap);
  width: 100%;
}
</style>