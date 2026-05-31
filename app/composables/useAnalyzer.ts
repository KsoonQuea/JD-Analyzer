import type { AnalysisResult } from '~/types/analysis'

export function useAnalyzer() {
  const result = ref<AnalysisResult | null>(null)
  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)

  async function analyze(jobDescription: string, skills: string, resumeText?: string) {
    isLoading.value = true
    errorMessage.value = null
    result.value = null

    try {
      result.value = await $fetch<AnalysisResult>('/api/analyze', {
        method: 'POST',
        body: { jobDescription, skills, resumeText }
      })
    } catch (error: unknown) {
      errorMessage.value = error instanceof Error ? error.message : 'Analysis failed. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  function reset() {
    result.value = null
    errorMessage.value = null
  }

  return { result, isLoading, error: errorMessage, analyze, reset }
}
