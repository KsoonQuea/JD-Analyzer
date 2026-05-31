<script setup lang="ts">
const props = defineProps<{ score: number }>()

const radius = 45
const circumference = 2 * Math.PI * radius
const strokeDashoffset = computed(() => circumference * (1 - props.score / 100))

const color = computed(() => {
  if (props.score >= 70) return '#22c55e'
  if (props.score >= 50) return '#f59e0b'
  return '#ef4444'
})

const label = computed(() => {
  if (props.score >= 70) return 'Strong Match'
  if (props.score >= 50) return 'Partial Match'
  return 'Weak Match'
})
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <div class="relative w-36 h-36">
      <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90">
        <circle cx="50" cy="50" :r="radius" fill="none" stroke="#e2e8f0" stroke-width="8" />
        <circle
          cx="50" cy="50" :r="radius" fill="none"
          :stroke="color"
          stroke-width="8"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="strokeDashoffset"
          class="transition-all duration-700 ease-out"
        />
      </svg>
      <div class="absolute inset-0 flex items-center justify-center">
        <span class="text-3xl font-bold text-slate-800">{{ score }}%</span>
      </div>
    </div>
    <span class="text-sm font-semibold" :style="{ color }">{{ label }}</span>
  </div>
</template>
