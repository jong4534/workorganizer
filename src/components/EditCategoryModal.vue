<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="onBackdropClick">
    <div class="bg-card border border-border rounded-lg shadow-lg w-full max-w-md mx-4">
      <!-- 헤더 -->
      <div class="flex items-center justify-between p-6 border-b border-border">
        <h2 class="text-xl font-semibold text-foreground">카테고리 편집</h2>
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

        <!-- 통계 정보 -->
        <div class="bg-muted rounded-md p-3">
          <div class="flex items-center justify-between text-sm">
            <span class="text-muted-foreground">포함된 항목</span>
            <span class="font-medium text-foreground">{{ category.items?.length || 0 }}개</span>
          </div>
        </div>

        <!-- 버튼들 -->
        <div class="flex items-center justify-between pt-4">
          <button
            type="button"
            @click="showDeleteConfirm = true"
            class="px-4 py-2 text-sm font-medium text-destructive hover:text-destructive/80 border border-destructive rounded-md hover:bg-destructive/10 transition-colors"
          >
            카테고리 삭제
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
              :disabled="!form.name.trim()"
              class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              수정 완료
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
              <h3 class="text-lg font-medium text-foreground">카테고리 삭제</h3>
              <p class="text-sm text-muted-foreground mt-1">
                "{{ category.name }}" 카테고리를 삭제하시겠습니까?
              </p>
            </div>
          </div>
          
          <div v-if="(category.items && category.items.length > 0)" class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p class="text-sm text-yellow-800">
              <strong>주의:</strong> 이 카테고리에는 {{ category.items?.length || 0 }}개의 항목이 있습니다. 
              삭제 시 모든 항목이 대기 목록으로 이동됩니다.
            </p>
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
  name: 'EditCategoryModal',
  props: {
    category: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'update', 'delete'],
  setup(props, { emit }) {
    const showDeleteConfirm = ref(false)
    
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
      name: props.category.name,
      color: props.category.color,
      description: props.category.description || ''
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

      emit('update', props.category.id, categoryData)
    }

    const handleDelete = () => {
      emit('delete', props.category.id)
      showDeleteConfirm.value = false
    }

    return {
      form,
      colorOptions,
      showDeleteConfirm,
      onBackdropClick,
      handleSubmit,
      handleDelete
    }
  }
}
</script>
