<script setup lang="ts">
const model = defineModel<string>({ required: true })
</script>

<template>
  <div class="flex flex-col gap-2">
    <label class="text-sm font-semibold text-slate-700">Your Skills</label>
    <p class="text-xs text-slate-500">One per line or comma-separated</p>
    <textarea
      v-model="model"
      placeholder="e.g. React, TypeScript, Node.js, PostgreSQL..."
      rows="6"
      class="w-full px-4 py-3 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400 transition-shadow"
    />
  </div>
</template>
