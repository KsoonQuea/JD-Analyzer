<script setup lang="ts">
import type { SkillMatch } from '~/types/analysis'

const props = defineProps<{ skill: SkillMatch }>()

const colorClass = computed(() => {
  if (props.skill.matched) {
    if (props.skill.relevance === 'required') return 'bg-green-100 text-green-800 border-green-200'
    if (props.skill.relevance === 'preferred') return 'bg-blue-100 text-blue-800 border-blue-200'
    return 'bg-cyan-100 text-cyan-800 border-cyan-200'
  }
  if (props.skill.relevance === 'required') return 'bg-red-100 text-red-800 border-red-200'
  if (props.skill.relevance === 'preferred') return 'bg-orange-100 text-orange-800 border-orange-200'
  return 'bg-slate-100 text-slate-600 border-slate-200'
})
</script>

<template>
  <span
    :title="skill.note"
    :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border', colorClass]"
  >
    <span>{{ skill.matched ? '✓' : '✗' }}</span>
    {{ skill.skill }}
    <span class="opacity-50 capitalize">({{ skill.relevance }})</span>
  </span>
</template>
