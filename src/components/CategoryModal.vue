<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="onBackdropClick">
    <div class="bg-card border border-border rounded-lg shadow-lg w-full max-w-md mx-4">
      <!-- 헤더 -->
      <div class="flex items-center justify-between p-6 border-b border-border">
        <h2 class="text-xl font-semibold text-foreground">새 카테고리 추가</h2>
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
        <!-- 카테고리 이름 -->
        <div class="space-y-2">
          <label for="categoryName" class="block text-sm font-medium text-foreground">
            카테고리 이름 <span class="text-destructive">*</span>
          </label>
          <input
            id="categoryName"
            v-model="form.name"
            type="text"
            placeholder="예: 프론트엔드 개발"
            class="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-muted-foreground"
            required
          >
        </div>

        <!-- 색상 선택 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-foreground">
            색상 테마
          </label>
          <div class="grid grid-cols-6 gap-3">
            <button
              v-for="color in colorOptions"
              :key="color.value"
              type="button"
              @click="form.color = color.value"
              :class="[
                'w-10 h-10 rounded-lg border-2 transition-all hover:scale-110',
                form.color === color.value ? 'border-foreground shadow-md' : 'border-transparent'
              ]"
              :style="{ backgroundColor: color.value }"
              :title="color.name"
            >
              <svg 
                v-if="form.color === color.value" 
                class="w-5 h-5 mx-auto text-white drop-shadow-sm" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- 설명 (선택사항) -->
        <div class="space-y-2">
          <label for="categoryDesc" class="block text-sm font-medium text-foreground">
            설명 <span class="text-xs text-muted-foreground">(선택사항)</span>
          </label>
          <textarea
            id="categoryDesc"
            v-model="form.description"
            rows="3"
            placeholder="이 카테고리에 대한 간단한 설명..."
            class="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-foreground placeholder-muted-foreground"
          ></textarea>
        </div>

        <!-- 버튼들 -->
        <div class="flex items-center justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-input rounded-md hover:bg-muted transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            :disabled="!form.name.trim()"
            class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            추가하기
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'

export default {
  name: 'CategoryModal',
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const colorOptions = [
      { name: '에메랄드', value: '#10b981' },
      { name: '블루', value: '#3b82f6' },
      { name: '인디고', value: '#6366f1' },
      { name: '퍼플', value: '#8b5cf6' },
      { name: '핑크', value: '#ec4899' },
      { name: '로즈', value: '#f43f5e' },
      { name: '오렌지', value: '#f97316' },
      { name: '앰버', value: '#f59e0b' },
      { name: '라임', value: '#84cc16' },
      { name: '틸', value: '#14b8a6' },
      { name: '사이안', value: '#06b6d4' },
      { name: '슬레이트', value: '#64748b' }
    ]
    
    const form = reactive({
      name: '',
      color: '#10b981',
      description: ''
    })

    const onBackdropClick = (event) => {
      if (event.target === event.currentTarget) {
        emit('close')
      }
    }

    const handleSubmit = () => {
      if (!form.name.trim()) return

      const categoryData = {
        name: form.name.trim(),
        color: form.color,
        description: form.description.trim()
      }

      emit('submit', categoryData)
      
      // 폼 초기화
      form.name = ''
      form.color = '#10b981'
      form.description = ''
    }

    return {
      form,
      colorOptions,
      onBackdropClick,
      handleSubmit
    }
  }
}
</script>

