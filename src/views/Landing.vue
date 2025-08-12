<template>
  <div class="min-h-screen bg-background">
    <!-- 헤더 -->
    <header class="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <svg class="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          <h1 class="text-lg font-gmarket font-medium text-foreground">업무 정리 도우미</h1>
        </div>
        
        <router-link 
          to="/login"
          class="inline-flex items-center justify-center rounded-md text-sm font-gmarket font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          로그인
        </router-link>
      </div>
    </header>

    <!-- 메인 콘텐츠 -->
    <main class="container mx-auto px-4 py-16">
      <!-- 히어로 섹션 -->
      <section class="flex flex-col items-center text-center space-y-8 py-16">
        <div class="space-y-6">
          <h1 class="text-3xl font-gmarket font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            깔끔하게 정리하자!
            <br />
            <span class="text-primary">업무 정리 도우미</span>
          </h1>
          <p class="mx-auto max-w-[600px] text-muted-foreground text-lg font-gmarket font-light leading-relaxed">
            질문과 답변을 입력하면 AI가 자동으로 정리해드립니다. 
            <br />
            드래그 앤 드롭으로 간편하게 카테고리를 관리하고, 
            <br />
            언제든 빠르게 검색해보세요.
          </p>
        </div>
        
        <router-link 
          to="/login"
          class="inline-flex items-center justify-center rounded-md font-gmarket font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-base"
        >
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google로 시작하기
        </router-link>
      </section>
    </main>

    <!-- 푸터 -->
    <footer class="border-t border-border py-8">
      <div class="container mx-auto px-4 text-center text-muted-foreground">
        <p class="font-gmarket font-light">&copy; 2025. 업무 정리 도우미 ❤️ 검은가방</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Landing'
}
</script>
