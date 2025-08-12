<template>
  <div id="app" class="min-h-screen">
    <!-- 로딩 상태 -->
    <div v-if="isInitializing" class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
        <p class="text-gray-600">업무 정리 도우미 로드 중...</p>
      </div>
    </div>

    <!-- 메인 앱 -->
    <router-view v-else />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import authService from './services/authService.js'

export default {
  name: 'App',
  setup() {
    const router = useRouter()
    const isInitializing = ref(true)

    onMounted(() => {
      // 인증 상태 감시 시작
      authService.onAuthStateChange((user) => {
        console.log('인증 상태 변경:', user ? '로그인됨' : '로그아웃됨')
        
        // 초기화 완료
        if (isInitializing.value) {
          isInitializing.value = false
          
          // 로그인된 상태에서 게스트 페이지에 있다면 대시보드로 리다이렉트
          if (user && (router.currentRoute.value.name === 'landing' || router.currentRoute.value.name === 'login')) {
            router.push('/dashboard')
          }
          // 로그아웃된 상태에서 보호된 페이지에 있다면 랜딩으로 리다이렉트
          else if (!user && router.currentRoute.value.meta?.requiresAuth) {
            router.push('/')
          }
        }
      })
    })

    return {
      isInitializing
    }
  }
}
</script>
