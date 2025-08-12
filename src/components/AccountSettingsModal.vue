<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-card rounded-lg shadow-xl w-full max-w-md mx-4">
      <!-- 헤더 -->
      <div class="flex items-center justify-between p-6 border-b border-border">
        <h2 class="text-xl font-semibold text-foreground">계정 설정</h2>
        <button
          @click="$emit('close')"
          class="text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 콘텐츠 -->
      <div class="p-6">
        <!-- 프로필 사진 -->
        <div class="flex flex-col items-center mb-6">
          <div class="relative">
            <img 
              v-if="localUser.photoURL" 
              :src="localUser.photoURL" 
              :alt="localUser.displayName"
              class="w-24 h-24 rounded-full border-4 border-border object-cover"
            >
            <div v-else class="w-24 h-24 bg-muted rounded-full flex items-center justify-center border-4 border-border">
              <svg class="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <button 
              v-if="!isDemo"
              class="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- 사용자 정보 폼 -->
        <form @submit.prevent="handleSave" class="space-y-4">
          <!-- 이름 -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              이름
            </label>
            <input
              v-model="localUser.displayName"
              type="text"
              class="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              :disabled="isDemo"
              :placeholder="isDemo ? '데모 모드에서는 편집할 수 없습니다' : '이름을 입력하세요'"
            >
          </div>

          <!-- 이메일 -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              이메일
            </label>
            <input
              v-model="localUser.email"
              type="email"
              class="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              disabled
              :placeholder="localUser.email"
            >
            <p class="text-xs text-muted-foreground mt-1">
              이메일은 변경할 수 없습니다
            </p>
          </div>

          <!-- 데모 모드 안내 -->
          <div v-if="isDemo" class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <p class="text-sm font-medium text-blue-800">데모 모드</p>
                <p class="text-sm text-blue-700">
                  실제 Firebase 연결 시 프로필 정보 편집이 가능합니다.
                </p>
              </div>
            </div>
          </div>

          <!-- 버튼들 -->
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 text-sm font-medium text-muted-foreground bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
            >
              취소
            </button>
            <button
              v-if="!isDemo"
              type="submit"
              :disabled="!isFormValid"
              class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'AccountSettingsModal',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'update'],
  setup(props, { emit }) {
    // 로컬 사용자 정보 (편집 가능)
    const localUser = ref({
      displayName: props.user?.displayName || '',
      email: props.user?.email || '',
      photoURL: props.user?.photoURL || ''
    })

    // 데모 모드 체크
    const isDemo = computed(() => {
      return props.user?.uid === 'demo-user-123'
    })

    // 폼 유효성 검사
    const isFormValid = computed(() => {
      return localUser.value.displayName && 
             localUser.value.displayName.trim().length > 0
    })

    // 프로퍼티 변경 감지
    watch(() => props.user, (newUser) => {
      if (newUser) {
        localUser.value = {
          displayName: newUser.displayName || '',
          email: newUser.email || '',
          photoURL: newUser.photoURL || ''
        }
      }
    }, { deep: true })

    // 저장 처리
    const handleSave = () => {
      if (!isFormValid.value) return

      // 변경된 정보를 부모에게 전달
      emit('update', {
        displayName: localUser.value.displayName.trim(),
        photoURL: localUser.value.photoURL
      })
      
      emit('close')
    }

    return {
      localUser,
      isDemo,
      isFormValid,
      handleSave
    }
  }
}
</script>

