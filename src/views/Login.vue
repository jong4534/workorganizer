<template>
  <div class="min-h-screen bg-background flex items-start justify-center px-4 pt-20">
    <div class="w-full max-w-md">
      <!-- 로고 및 제목 -->
      <div class="flex flex-col items-center text-center space-y-4 mb-8">
        <div class="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
          <svg class="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
        <h1 class="text-3xl font-bold tracking-tight text-foreground">로그인</h1>
        <p class="text-lg text-muted-foreground">업무 정리 도우미에 로그인하세요</p>
      </div>

      <!-- 로그인 카드 -->
      <div class="bg-card border border-border rounded-xl p-6 space-y-6">
        <!-- 구글 로그인 버튼 -->
        <button
          @click="handleGoogleLogin"
          :disabled="isLoading"
          class="w-full inline-flex items-center justify-center rounded-lg text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6 py-3"
        >
          <svg v-if="!isLoading" class="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <svg v-else class="w-5 h-5 mr-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          {{ isLoading ? '로그인 중...' : 'Google로 로그인' }}
        </button>

        <!-- 로그인 안내 -->
        <div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p class="text-sm text-blue-600">Google 계정으로 로그인해 시작하세요.</p>
        </div>

        <!-- 오류 메시지 -->
        <div v-if="errorMessage" class="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
          <p class="text-sm text-destructive">{{ errorMessage }}</p>
        </div>
      </div>

      <!-- 홈으로 돌아가기 -->
      <div class="mt-6 text-center">
        <router-link 
          to="/"
          class="text-base text-muted-foreground hover:text-foreground transition-colors inline-flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          홈으로 돌아가기
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../services/authService.js'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const isLoading = ref(false)
    const errorMessage = ref('')

    const handleGoogleLogin = async () => {
      try {
        isLoading.value = true
        errorMessage.value = ''
        
        const user = await authService.signInWithGoogle()
        console.log('로그인 성공:', user)
        
        // 대시보드로 리다이렉트
        router.push('/dashboard')
        
      } catch (error) {
        console.error('로그인 오류:', error)
        errorMessage.value = '로그인 중 오류가 발생했습니다. 다시 시도해주세요.'
      } finally {
        isLoading.value = false
      }
    }

    return {
      isLoading,
      errorMessage,
      handleGoogleLogin
    }
  }
}
</script>
