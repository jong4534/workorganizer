<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="onBackdropClick">
    <div class="bg-card border border-border rounded-lg shadow-lg w-full max-w-md mx-4">
      <!-- 헤더 -->
      <div class="flex items-center justify-between p-6 border-b border-border">
        <h2 class="text-xl font-semibold text-foreground">워크스페이스 설정</h2>
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
          <label for="editWorkspaceName" class="block text-sm font-medium text-foreground">
            워크스페이스 이름 <span class="text-destructive">*</span>
          </label>
          <input
            id="editWorkspaceName"
            v-model="form.name"
            type="text"
            placeholder="예: 프론트엔드 프로젝트"
            class="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-muted-foreground"
            required
          >
        </div>

        <!-- 설명 -->
        <div class="space-y-2">
          <label for="editWorkspaceDesc" class="block text-sm font-medium text-foreground">
            설명 <span class="text-xs text-muted-foreground">(선택사항)</span>
          </label>
          <textarea
            id="editWorkspaceDesc"
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

        <!-- 공유 링크 (공개일 때만) -->
        <div v-if="form.isPublic" class="space-y-2">
          <label class="block text-sm font-medium text-foreground">공유 링크</label>
          <div class="flex items-center space-x-2">
            <input
              :value="shareLink"
              readonly
              class="flex-1 px-3 py-2 bg-muted border border-input rounded-md text-sm text-muted-foreground"
            >
            <button
              type="button"
              @click="copyShareLink"
              class="px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
            >
              복사
            </button>
          </div>
        </div>

        <!-- 통계 정보 -->
        <div class="bg-muted rounded-md p-4">
          <h4 class="font-medium text-foreground mb-3">워크스페이스 통계</h4>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="text-center">
              <div class="text-lg font-semibold text-foreground">{{ workspace.itemCount || 0 }}</div>
              <div class="text-muted-foreground">총 항목</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-semibold text-foreground">{{ workspace.categoryCount || 0 }}</div>
              <div class="text-muted-foreground">카테고리</div>
            </div>
          </div>
        </div>

        <!-- 버튼들 -->
        <div class="flex items-center justify-between pt-4">
          <button
            type="button"
            @click="showDeleteConfirm = true"
            class="px-4 py-2 text-sm font-medium text-destructive hover:text-destructive/80 border border-destructive rounded-md hover:bg-destructive/10 transition-colors"
          >
            워크스페이스 삭제
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
              :disabled="!form.name.trim() || isSubmitting"
              class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ isSubmitting ? '저장 중...' : '저장' }}
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
              <h3 class="text-lg font-medium text-foreground">워크스페이스 삭제</h3>
              <p class="text-sm text-muted-foreground mt-1">
                "{{ workspace.name }}" 워크스페이스를 삭제하시겠습니까?
              </p>
            </div>
          </div>
          
          <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-sm text-red-800">
              <strong>주의:</strong> 이 작업은 되돌릴 수 없습니다. 
              워크스페이스와 모든 데이터가 영구적으로 삭제됩니다.
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
import { reactive, ref, computed } from 'vue'

export default {
  name: 'WorkspaceSettingsModal',
  props: {
    workspace: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'update', 'delete', 'share'],
  setup(props, { emit }) {
    const isSubmitting = ref(false)
    const showDeleteConfirm = ref(false)
    
    const form = reactive({
      name: props.workspace.name,
      description: props.workspace.description || '',
      isPublic: props.workspace.isPublic || false
    })

    const shareLink = computed(() => {
      return `${window.location.origin}/workspace/${props.workspace.id}`
    })

    const onBackdropClick = (event) => {
      if (event.target === event.currentTarget) {
        emit('close')
      }
    }

    const handleSubmit = async () => {
      if (!form.name.trim()) return

      isSubmitting.value = true

      try {
        const updateData = {
          name: form.name.trim(),
          description: form.description.trim(),
          isPublic: form.isPublic
        }

        emit('update', props.workspace.id, updateData)
        
      } catch (error) {
        console.error('워크스페이스 업데이트 오류:', error)
      } finally {
        isSubmitting.value = false
      }
    }

    const handleDelete = () => {
      emit('delete', props.workspace.id)
      showDeleteConfirm.value = false
    }

    const copyShareLink = async () => {
      try {
        await navigator.clipboard.writeText(shareLink.value)
        alert('공유 링크가 클립보드에 복사되었습니다!')
      } catch (error) {
        console.error('클립보드 복사 오류:', error)
        // 폴백: 텍스트 선택
        const input = document.createElement('input')
        input.value = shareLink.value
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
        alert('공유 링크가 복사되었습니다!')
      }
    }

    return {
      form,
      isSubmitting,
      showDeleteConfirm,
      shareLink,
      onBackdropClick,
      handleSubmit,
      handleDelete,
      copyShareLink
    }
  }
}
</script>




