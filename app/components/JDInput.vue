<script setup lang="ts">
const model = defineModel<string>({ required: true })
</script>

<template>
  <div class="flex flex-col gap-2">
    <label class="text-sm font-semibold text-slate-700">Job Description</label>
    <textarea
      v-model="model"
      placeholder="Paste the full job description here..."
      rows="12"
      class="w-full px-4 py-3 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400 transition-shadow"
    />
  </div>
</template>
