<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="onBackdropClick">
    <div class="bg-card border border-border rounded-lg shadow-lg w-full max-w-md mx-4">
      <!-- 헤더 -->
      <div class="flex items-center justify-between p-6 border-b border-border">
        <h2 class="text-xl font-semibold text-foreground">새 워크스페이스</h2>
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
        <!-- 워크스페이스 이름 -->
        <div class="space-y-2">
          <label for="workspaceName" class="block text-sm font-medium text-foreground">
            워크스페이스 이름 <span class="text-destructive">*</span>
          </label>
          <input
            id="workspaceName"
            v-model="form.name"
            type="text"
            placeholder="예: 프론트엔드 프로젝트"
            class="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-muted-foreground"
            required
          >
        </div>

        <!-- 설명 -->
        <div class="space-y-2">
          <label for="workspaceDesc" class="block text-sm font-medium text-foreground">
            설명 <span class="text-xs text-muted-foreground">(선택사항)</span>
          </label>
          <textarea
            id="workspaceDesc"
            v-model="form.description"
            rows="3"
            placeholder="이 워크스페이스에 대한 간단한 설명..."
            class="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-foreground placeholder-muted-foreground"
          ></textarea>
        </div>

        <!-- 공개 설정 -->
        <div class="space-y-3">
          <label class="block text-sm font-medium text-foreground">공개 설정</label>
          
          <div class="space-y-3">
            <label class="flex items-start space-x-3 cursor-pointer">
              <input
                v-model="form.isPublic"
                :value="false"
                type="radio"
                class="mt-1 w-4 h-4 text-primary border-border focus:ring-primary"
              >
              <div>
                <div class="font-medium text-foreground">비공개</div>
                <div class="text-sm text-muted-foreground">로그인한 사용자만 접근 가능</div>
              </div>
            </label>
            
            <label class="flex items-start space-x-3 cursor-pointer">
              <input
                v-model="form.isPublic"
                :value="true"
                type="radio"
                class="mt-1 w-4 h-4 text-primary border-border focus:ring-primary"
              >
              <div>
                <div class="font-medium text-foreground">공개</div>
                <div class="text-sm text-muted-foreground">링크를 가진 누구나 조회 가능</div>
              </div>
            </label>
          </div>
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
            :disabled="!form.name.trim() || isSubmitting"
            class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <svg v-if="isSubmitting" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span>{{ isSubmitting ? '생성 중...' : '생성하기' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'

export default {
  name: 'CreateWorkspaceModal',
  emits: ['close', 'create'],
  setup(props, { emit }) {
    const isSubmitting = ref(false)
    
    const form = reactive({
      name: '',
      description: '',
      isPublic: false
    })

    const onBackdropClick = (event) => {
      if (event.target === event.currentTarget) {
        emit('close')
      }
    }

    const handleSubmit = async () => {
      console.log('=== 생성하기 버튼 클릭됨! ===')
      console.log('폼 데이터:', form)
      
      if (!form.name.trim()) {
        console.log('이름이 비어있어서 리턴')
        alert('워크스페이스 이름을 입력해주세요!')
        return
      }

      console.log('제출 시작...')
      isSubmitting.value = true

      try {
        const workspaceData = {
          name: form.name.trim(),
          description: form.description.trim(),
          isPublic: form.isPublic,
          itemCount: 0,
          categoryCount: 0
        }

        console.log('생성할 워크스페이스 데이터:', workspaceData)
        console.log('부모 컴포넌트로 create 이벤트 전송...')
        
        emit('create', workspaceData)
        
        console.log('create 이벤트 전송 완료')
        
        // 폼 초기화
        form.name = ''
        form.description = ''
        form.isPublic = false
        
        console.log('폼 초기화 완료')
        
      } catch (error) {
        console.error('워크스페이스 생성 오류:', error)
        alert('워크스페이스 생성 중 오류가 발생했습니다: ' + error.message)
      } finally {
        isSubmitting.value = false
        console.log('제출 프로세스 완료')
      }
    }

    return {
      form,
      isSubmitting,
      onBackdropClick,
      handleSubmit
    }
  }
}
</script>
