<template>
  <div class="title-bar">
    <div class="title-content">
      <span class="title-icon">📡</span>
      <h1 class="title">{{ title }}</h1>
    </div>
    <button v-if="showBack" class="back-btn" @click="emit('back')">返回</button>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: '黄前水库矩阵管理平台 - 预演预案' },
  showBack: { type: Boolean, default: true }
})
const emit = defineEmits(['back'])
</script>

<style scoped>
.title-bar {
  height: 56px;
  background: linear-gradient(90deg, rgba(0, 25, 65, 0.98) 0%, rgba(0, 55, 140, 0.95) 50%, rgba(0, 25, 65, 0.98) 100%);
  border-bottom: 1px solid rgba(0, 212, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  position: relative;
  overflow: hidden;
}
.title-bar::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, #00d4ff 20%, #00d4ff 80%, transparent 100%);
  box-shadow: 0 0 8px rgba(0,212,255,0.8);
}
.title-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0,212,255,0.08), transparent);
  animation: scan 4s linear infinite;
  pointer-events: none;
}
@keyframes scan {
  0% { left: -100%; }
  100% { left: 100%; }
}
.title-content {
  display: flex;
  align-items: center;
  gap: 14px;
  position: relative;
  z-index: 1;
}
.title-icon {
  font-size: 22px;
  color: #00d4ff;
  filter: drop-shadow(0 0 8px rgba(0, 212, 255, 0.9));
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
.title {
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 4px;
  text-shadow: 0 0 12px rgba(0, 212, 255, 0.8);
  margin: 0;
  position: relative;
}
.title::after {
  content: '';
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 20px;
  background: #00d4ff;
  box-shadow: 0 0 8px rgba(0,212,255,0.9);
  animation: blink 1.2s steps(2) infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.back-btn {
  padding: 6px 22px;
  background: rgba(0, 212, 255, 0.08);
  border: 1px solid rgba(0, 212, 255, 0.5);
  color: #00d4ff;
  border-radius: 2px;
  cursor: pointer;
  font-size: 13px;
  letter-spacing: 2px;
  transition: all 0.3s;
  position: relative;
  z-index: 1;
}
.back-btn:hover {
  background: rgba(0, 212, 255, 0.2);
  box-shadow: 0 0 14px rgba(0, 212, 255, 0.5);
}
</style>