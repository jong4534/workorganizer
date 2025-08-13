<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="onBackdropClick">
    <div class="bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
      <!-- 헤더 -->
      <div class="flex items-center justify-between p-6 border-b border-border">
        <h2 class="text-xl font-semibold text-foreground">항목 편집</h2>
        <button
          @click="$emit('close')"
          class="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 폼 -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- 질문 입력 -->
        <div class="space-y-2">
          <label for="editQuestion" class="block text-sm font-medium text-foreground">
            질문 <span class="text-destructive">*</span>
          </label>
          <textarea
            id="editQuestion"
            v-model="form.question"
            rows="3"
            placeholder="질문을 입력하세요..."
            class="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-foreground placeholder-muted-foreground"
            required
          ></textarea>
        </div>

        <!-- 답변 입력 -->
        <div class="space-y-2">
          <label for="editAnswer" class="block text-sm font-medium text-foreground">
            답변 <span class="text-destructive">*</span>
          </label>
          <textarea
            id="editAnswer"
            v-model="form.answer"
            rows="6"
            placeholder="답변을 입력하세요..."
            class="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-foreground placeholder-muted-foreground"
            required
          ></textarea>
        </div>

        <!-- 태그 입력 -->
        <div class="space-y-2">
          <label for="editTags" class="block text-sm font-medium text-foreground">
            태그 <span class="text-xs text-muted-foreground">(선택사항, 쉼표로 구분)</span>
          </label>
          <input
            id="editTags"
            v-model="form.tags"
            type="text"
            placeholder="예: Vue.js, Firebase, 개발"
            class="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-muted-foreground"
          >
        </div>

        <!-- AI 요약 (있는 경우 표시) -->
        <div v-if="item.aiSummary" class="space-y-2">
          <label class="block text-sm font-medium text-foreground flex items-center">
            <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            AI 요약
          </label>
          <div class="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p class="text-blue-900 text-sm">{{ item.aiSummary }}</p>
            <p class="text-blue-700 text-xs mt-2">* AI 요약은 질문/답변 수정 후 새로 생성됩니다.</p>
          </div>
        </div>

        <!-- AI 재정리 옵션 -->
        <div class="flex items-center space-x-2">
          <input
            id="reprocessAI"
            v-model="form.reprocessAI"
            type="checkbox"
            class="w-4 h-4 text-primary border-border rounded focus:ring-primary"
          >
          <label for="reprocessAI" class="text-sm text-foreground cursor-pointer">
            수정 후 AI로 다시 정리하기
          </label>
          <div class="flex items-center space-x-1 text-xs text-muted-foreground">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>새로운 요약과 카테고리를 제안받습니다</span>
          </div>
        </div>

        <!-- 버튼들 -->
        <div class="flex items-center justify-between pt-4">
          <button
            type="button"
            @click="showDeleteConfirm = true"
            class="px-4 py-2 text-sm font-medium text-destructive hover:text-destructive/80 border border-destructive rounded-md hover:bg-destructive/10 transition-colors"
          >
            항목 삭제
          </button>
          
          <div class="flex space-x-3">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-input rounded-md hover:bg-muted transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              :disabled="!form.question.trim() || !form.answer.trim() || isSubmitting"
              class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <svg v-if="isSubmitting" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <span>{{ isSubmitting ? (form.reprocessAI ? 'AI 처리 중...' : '저장 중...') : '수정 완료' }}</span>
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- 삭제 확인 모달 -->
    <div 
      v-if="showDeleteConfirm" 
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-60"
      @click="showDeleteConfirm = false"
    >
      <div class="bg-card border border-border rounded-lg shadow-lg w-full max-w-sm mx-4" @click.stop>
        <div class="p-6">
          <div class="flex items-center space-x-3 mb-4">
            <div class="flex-shrink-0">
              <svg class="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-medium text-foreground">항목 삭제</h3>
              <p class="text-sm text-muted-foreground mt-1">
                이 항목을 영구적으로 삭제하시겠습니까?
              </p>
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              @click="showDeleteConfirm = false"
              class="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-input rounded-md hover:bg-muted transition-colors"
            >
              취소
            </button>
            <button
              @click="handleDelete"
              class="px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
            >
              삭제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'

export default {
  name: 'EditItemModal',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'update', 'delete'],
  setup(props, { emit }) {
    const isSubmitting = ref(false)
    const showDeleteConfirm = ref(false)
    
    const form = reactive({
      question: props.item.question,
      answer: props.item.answer,
      tags: (props.item.tags || []).join(', '),
      reprocessAI: false
    })

    const onBackdropClick = (event) => {
      if (event.target === event.currentTarget) {
        emit('close')
      }
    }

    const handleSubmit = async () => {
      if (!form.question.trim() || !form.answer.trim()) return

      isSubmitting.value = true

      try {
        const updateData = {
          question: form.question.trim(),
          answer: form.answer.trim(),
          tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          reprocessAI: form.reprocessAI
        }

        emit('update', props.item.id, updateData)
      } catch (error) {
        console.error('수정 중 오류:', error)
      } finally {
        isSubmitting.value = false
      }
    }

    const handleDelete = () => {
      emit('delete', props.item.id)
      showDeleteConfirm.value = false
    }

    return {
      form,
      isSubmitting,
      showDeleteConfirm,
      onBackdropClick,
      handleSubmit,
      handleDelete
    }
  }
}
</script>


