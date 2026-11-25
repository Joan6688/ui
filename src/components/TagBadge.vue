<template>
  <span class="tag-badge" :class="`tag-${type}`">
    <slot>{{ text }}</slot>
  </span>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'default' },
  text: { type: String, default: '' }
})
</script>

<style scoped>
.tag-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.tag-default {
  background: rgba(0, 212, 255, 0.15);
  color: #00d4ff;
  border: 1px solid rgba(0, 212, 255, 0.4);
}
.tag-warn {
  background: rgba(255, 107, 0, 0.15);
  color: #ff6b00;
  border: 1px solid rgba(255, 107, 0, 0.4);
}
.tag-success {
  background: rgba(0, 255, 136, 0.15);
  color: #00ff88;
  border: 1px solid rgba(0, 255, 136, 0.4);
}
.tag-danger {
  background: rgba(255, 50, 50, 0.15);
  color: #ff3232;
  border: 1px solid rgba(255, 50, 50, 0.4);
}
.tag-info {
  background: rgba(150, 180, 220, 0.15);
  color: #96b4dc;
  border: 1px solid rgba(150, 180, 220, 0.4);
}
</style>