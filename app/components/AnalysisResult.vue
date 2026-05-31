<script setup lang="ts">
import type { AnalysisResult } from '~/types/analysis'

defineProps<{ result: AnalysisResult }>()
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- Match score -->
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-center gap-4">
      <h2 class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Overall Match</h2>
      <MatchScore :score="result.matchScore" />
      <p class="text-sm text-slate-600 text-center leading-relaxed">{{ result.summary }}</p>
    </div>

    <!-- Skills breakdown -->
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5">
      <h2 class="text-sm font-semibold text-slate-800">Skills Breakdown</h2>
      <div v-if="result.matchedSkills.length" class="flex flex-col gap-2">
        <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">Matched</p>
        <div class="flex flex-wrap gap-2">
          <SkillBadge v-for="skill in result.matchedSkills" :key="skill.skill" :skill="skill" />
        </div>
      </div>
      <div v-if="result.missingSkills.length" class="flex flex-col gap-2">
        <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">Missing</p>
        <div class="flex flex-wrap gap-2">
          <SkillBadge v-for="skill in result.missingSkills" :key="skill.skill" :skill="skill" />
        </div>
      </div>
    </div>

    <!-- Strengths & Gaps -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="bg-green-50 rounded-2xl border border-green-100 p-5">
        <h3 class="text-sm font-semibold text-green-800 mb-3">Strengths</h3>
        <ul class="flex flex-col gap-2">
          <li v-for="strength in result.strengths" :key="strength" class="flex gap-2 text-sm text-green-700">
            <span class="shrink-0 mt-0.5">•</span>{{ strength }}
          </li>
        </ul>
      </div>
      <div class="bg-red-50 rounded-2xl border border-red-100 p-5">
        <h3 class="text-sm font-semibold text-red-800 mb-3">Gaps</h3>
        <ul class="flex flex-col gap-2">
          <li v-for="gap in result.gaps" :key="gap" class="flex gap-2 text-sm text-red-700">
            <span class="shrink-0 mt-0.5">•</span>{{ gap }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Recommendation -->
    <div class="bg-indigo-50 rounded-2xl border border-indigo-100 p-5">
      <h3 class="text-sm font-semibold text-indigo-800 mb-2">Recommendation</h3>
      <p class="text-sm text-indigo-700 leading-relaxed">{{ result.recommendation }}</p>
    </div>
  </div>
</template>
