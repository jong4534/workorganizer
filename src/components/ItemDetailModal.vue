<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="onBackdropClick">
    <div class="bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
      <!-- 헤더 -->
      <div class="flex items-center justify-between p-6 border-b border-border">
        <h2 class="text-xl font-semibold text-foreground">항목 상세</h2>
        <button
          @click="$emit('close')"
          class="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 내용 -->
      <div class="p-6 space-y-6">
        <!-- 질문 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-foreground">질문</label>
          <div class="p-4 bg-background border border-border rounded-md">
            <p class="text-foreground">{{ item.question }}</p>
          </div>
        </div>

        <!-- 답변 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-foreground">답변</label>
          <div class="p-4 bg-background border border-border rounded-md">
            <p class="text-foreground whitespace-pre-wrap">{{ item.answer }}</p>
          </div>
        </div>

        <!-- AI 요약 -->
        <div v-if="item.aiSummary" class="space-y-2">
          <label class="block text-sm font-medium text-foreground flex items-center">
            <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            AI 요약
          </label>
          <div class="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p class="text-blue-900">{{ item.aiSummary }}</p>
          </div>
        </div>

        <!-- 태그들 -->
        <div v-if="(item.tags && item.tags.length > 0) || (item.aiTags && item.aiTags.length > 0)" class="space-y-2">
          <label class="block text-sm font-medium text-foreground">태그</label>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="tag in [...(item.tags || []), ...(item.aiTags || [])]" 
              :key="tag"
              class="inline-block px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
            >
              #{{ tag }}
            </span>
          </div>
        </div>

        <!-- 메타 정보 -->
        <div class="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div>
            <label class="block text-sm font-medium text-muted-foreground">생성일</label>
            <p class="text-foreground">{{ formatDate(item.createdAt) }}</p>
          </div>
          <div v-if="item.suggestedCategory">
            <label class="block text-sm font-medium text-muted-foreground">AI 제안 카테고리</label>
            <p class="text-foreground">{{ item.suggestedCategory }}</p>
          </div>
        </div>

        <!-- 액션 버튼들 -->
        <div class="flex justify-end space-x-3 pt-4 border-t border-border">
          <button
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-input rounded-md hover:bg-muted transition-colors"
          >
            닫기
          </button>
          <button
            v-if="!viewOnly"
            @click="$emit('edit', item)"
            class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            편집하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ItemDetailModal',
  props: {
    item: {
      type: Object,
      required: true
    },
    viewOnly: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'edit'],
  setup(props, { emit }) {
    const onBackdropClick = (event) => {
      if (event.target === event.currentTarget) {
        emit('close')
      }
    }

    const formatDate = (date) => {
      return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    }

    return {
      onBackdropClick,
      formatDate,
      viewOnly: props.viewOnly
    }
  }
}
</script>


