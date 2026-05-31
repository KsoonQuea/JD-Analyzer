<script setup lang="ts">
const jobDescription = ref('')
const skills = ref('')
const resumeText = ref('')

const { result, isLoading, error, analyze } = useAnalyzer()

const canSubmit = computed(() =>
  jobDescription.value.trim() &&
  (skills.value.trim() || resumeText.value.trim()) &&
  !isLoading.value
)

async function handleSubmit() {
  await analyze(jobDescription.value, skills.value, resumeText.value || undefined)
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <header class="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
        <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
          <span class="text-white text-xs font-bold">JD</span>
        </div>
        <div>
          <h1 class="text-base font-bold text-slate-900 leading-tight">JD Analyzer</h1>
          <p class="text-xs text-slate-500">AI-powered job description match scoring</p>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-6 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <!-- Input panel -->
        <div class="flex flex-col gap-5">
          <JDInput v-model="jobDescription" />
          <ResumeUpload
            @extracted="(text) => resumeText = text"
            @cleared="resumeText = ''"
          />
          <SkillsInput v-model="skills" />
          <button
            :disabled="!canSubmit"
            class="w-full py-3 px-6 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            @click="handleSubmit"
          >
            {{ isLoading ? 'Analyzing…' : 'Analyze Match' }}
          </button>
          <p v-if="error" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {{ error }}
          </p>
        </div>

        <!-- Result panel -->
        <div>
          <AnalysisResult v-if="result" :result="result" />

          <div v-else-if="isLoading" class="flex flex-col items-center justify-center h-72 gap-4">
            <div class="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p class="text-sm text-slate-500">Analyzing your profile…</p>
          </div>

          <div v-else class="flex flex-col items-center justify-center h-72 gap-3 text-center">
            <div class="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl select-none">
              📋
            </div>
            <p class="text-slate-400 text-sm leading-relaxed">
              Paste a job description, upload your resume or list your skills,<br>
              then click <strong class="text-slate-600">Analyze Match</strong>.
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
