<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-card rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-hidden">
      <!-- 헤더 -->
      <div class="flex items-center justify-between p-6 border-b border-border">
        <h2 class="text-lg font-semibold text-foreground">항목 추가</h2>
        <button
          @click="$emit('close')"
          class="text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 내용 -->
      <div class="p-6">
        <div class="space-y-4">
          <!-- 제목 (선택) -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">제목 (선택)</label>
            <input
              v-model="title"
              type="text"
              placeholder="제목을 입력하세요 (선택)"
              class="w-full p-3 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <!-- 내용 (필수) -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">내용 <span class="text-red-500">*</span></label>
            <textarea
              v-model="content"
              placeholder="내용을 입력하세요"
              class="w-full h-28 p-3 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            ></textarea>
          </div>

          <!-- 태그 (선택) -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">태그 (선택, 쉼표로 구분)</label>
            <input
              v-model="tagsText"
              type="text"
              placeholder="예: Vue.js, Firebase, 개발"
              class="w-full p-3 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <!-- 옵션 -->
          <label class="flex items-center space-x-2 text-sm text-foreground">
            <input type="checkbox" v-model="reprocessAI" class="rounded border-border text-primary focus:ring-primary" />
            <span>추가 후 AI로 정리하기</span>
          </label>

          <!-- 액션 -->
          <div class="flex justify-end gap-2 pt-2">
            <button @click="$emit('close')" type="button" class="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90">취소</button>
            <button
              @click="handleSubmit"
              :disabled="!content.trim() || isSubmitting"
              class="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isSubmitting">처리 중...</span>
              <span v-else>추가 완료</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'QAModal',
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const title = ref('')
    const content = ref('')
    const tagsText = ref('')
    const reprocessAI = ref(false)
    const isSubmitting = ref(false)

    const handleSubmit = async () => {
      if (!content.value.trim()) return
      
      isSubmitting.value = true
      try {
        const tags = tagsText.value
          ? tagsText.value.split(',').map(t => t.trim()).filter(Boolean)
          : []
        emit('submit', {
          title: title.value.trim(),
          content: content.value.trim(),
          tags,
          reprocessAI: reprocessAI.value,
        })
        title.value = ''
        content.value = ''
        tagsText.value = ''
        reprocessAI.value = false
      } finally {
        isSubmitting.value = false
      }
    }

    return {
      title,
      content,
      tagsText,
      reprocessAI,
      isSubmitting,
      handleSubmit
    }
  }
}
</script>
