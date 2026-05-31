<script setup lang="ts">
const emit = defineEmits<{
  extracted: [text: string, filename: string]
  cleared: []
}>()

const isDragging = ref(false)
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const uploadedFilename = ref<string | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

async function handleFile(file: File) {
  errorMessage.value = null
  isLoading.value = true
  uploadedFilename.value = null

  try {
    const form = new FormData()
    form.append('resume', file)

    const uploadResult = await $fetch<{ text: string; filename: string }>('/api/extract', {
      method: 'POST',
      body: form
    })

    uploadedFilename.value = uploadResult.filename
    emit('extracted', uploadResult.text, uploadResult.filename)
  } catch (error: unknown) {
    errorMessage.value = error instanceof Error ? error.message : 'Upload failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

function onInputChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) handleFile(file)
}

function onDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) handleFile(file)
}

function clear() {
  uploadedFilename.value = null
  errorMessage.value = null
  if (inputRef.value) inputRef.value.value = ''
  emit('cleared')
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label class="text-sm font-semibold text-slate-700">
      Resume
      <span class="text-slate-400 font-normal ml-1">optional</span>
    </label>

    <label
      :class="[
        'relative flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed transition-colors',
        uploadedFilename ? 'border-green-300 bg-green-50 cursor-default' : 'cursor-pointer',
        isDragging && !uploadedFilename ? 'border-indigo-400 bg-indigo-50' : !uploadedFilename ? 'border-slate-200 hover:border-indigo-300 bg-white' : '',
      ]"
      @dragover.prevent="!uploadedFilename && (isDragging = true)"
      @dragleave="isDragging = false"
      @drop.prevent="!uploadedFilename && onDrop($event)"
    >
      <input
        ref="inputRef"
        type="file"
        accept=".pdf,.docx"
        class="sr-only"
        :disabled="!!uploadedFilename || isLoading"
        @change="onInputChange"
      />

      <!-- Loading -->
      <template v-if="isLoading">
        <div class="w-6 h-6 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
        <span class="text-xs text-slate-500">Extracting text…</span>
      </template>

      <!-- Uploaded -->
      <template v-else-if="uploadedFilename">
        <div class="flex items-center gap-3 w-full">
          <span class="text-xl shrink-0">📄</span>
          <div class="flex flex-col min-w-0 flex-1">
            <span class="text-sm font-medium text-green-800 truncate">{{ uploadedFilename }}</span>
            <span class="text-xs text-green-600">Text extracted successfully</span>
          </div>
          <button
            type="button"
            class="shrink-0 text-xs text-slate-400 hover:text-red-500 transition-colors px-2 py-1 rounded"
            @click.prevent="clear"
          >
            Remove
          </button>
        </div>
      </template>

      <!-- Empty -->
      <template v-else>
        <span class="text-2xl select-none">📄</span>
        <div class="text-center">
          <p class="text-sm text-slate-600">
            Drop your resume or
            <span class="text-indigo-600 font-medium">browse</span>
          </p>
          <p class="text-xs text-slate-400 mt-0.5">PDF or DOCX</p>
        </div>
      </template>
    </label>

    <p v-if="errorMessage" class="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
      {{ errorMessage }}
    </p>
  </div>
</template>
