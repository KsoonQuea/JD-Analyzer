import type { AnalysisResult } from '~/types/analysis'

export function useAnalyzer() {
  const result = ref<AnalysisResult | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function analyze(jobDescription: string, skills: string) {
    loading.value = true
    error.value = null
    result.value = null

    try {
      result.value = await $fetch<AnalysisResult>('/api/analyze', {
        method: 'POST',
        body: { jobDescription, skills }
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analysis failed. Please try again.'
      error.value = msg
    } finally {
      loading.value = false
    }
  }

  function reset() {
    result.value = null
    error.value = null
  }

  return { result, loading, error, analyze, reset }
}
