<template>
  <div class="min-h-screen bg-background">
    <!-- 헤더 -->
    <header class="border-b border-border bg-card/50 backdrop-blur-sm">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2 sm:space-x-4">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <h1 class="text-lg sm:text-xl font-bold text-foreground">업무 정리 도우미</h1>
          </div>
          
          <!-- 사용자 프로필 드롭다운 -->
          <div class="relative" ref="profileDropdown">
            <button
              @click="toggleProfileMenu"
              class="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-2 rounded-lg hover:bg-accent transition-colors min-h-[44px] sm:min-h-0"
            >
              <img 
                v-if="user?.photoURL" 
                :src="user.photoURL" 
                :alt="user.displayName"
                class="w-8 h-8 rounded-full border border-border"
              >
              <div v-else class="w-8 h-8 bg-muted rounded-full flex items-center justify-center border border-border">
                <svg class="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <span class="text-sm text-foreground hidden sm:block">{{ user?.displayName || user?.email }}</span>
              <svg 
                class="w-4 h-4 text-muted-foreground transition-transform duration-200"
                :class="{ 'rotate-180': showProfileMenu }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- 드롭다운 메뉴 -->
            <div 
              v-show="showProfileMenu"
              class="absolute right-0 mt-2 w-72 bg-card rounded-lg shadow-lg border border-border z-50"
            >
              <!-- 사용자 정보 섹션 -->
              <div class="p-4 border-b border-border">
                <div class="flex items-center space-x-3">
                  <img 
                    v-if="user?.photoURL" 
                    :src="user.photoURL" 
                    :alt="user.displayName"
                    class="w-12 h-12 rounded-full border-2 border-border"
                  >
                  <div v-else class="w-12 h-12 bg-muted rounded-full flex items-center justify-center border-2 border-border">
                    <svg class="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="font-medium text-foreground">{{ user?.displayName || '사용자' }}</p>
                    <p class="text-sm text-muted-foreground">{{ user?.email }}</p>
                  </div>
                </div>
              </div>

              <!-- 메뉴 항목들 -->
              <div class="p-2">
                <button
                  @click="openAccountSettings"
                  class="w-full flex items-center space-x-3 px-3 py-2 text-left text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span>계정 설정</span>
                </button>

                <button
                  @click="handleLogout"
                  class="w-full flex items-center space-x-3 px-3 py-2 text-left text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  <span>로그아웃</span>
                </button>

                <hr class="my-2 border-border">

                <button
                  @click="openDeleteAccountModal"
                  class="w-full flex items-center space-x-3 px-3 py-2 text-left text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  <span>회원 탈퇴</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 메인 콘텐츠 -->
    <main class="container mx-auto px-4 py-6 sm:py-8">
      <!-- 상단 액션 바 -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div class="flex-1">
          <h2 class="text-xl sm:text-2xl font-bold text-foreground">내 워크스페이스</h2>
          <p class="text-sm sm:text-base text-muted-foreground">프로젝트별로 업무를 정리하고 관리하세요</p>
        </div>
        
        <div class="flex-shrink-0">
          <button
            @click="handleCreateButtonClick"
            class="w-full sm:w-auto inline-flex items-center justify-center px-3 sm:px-4 py-3 sm:py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors min-h-[44px] sm:min-h-0"
          >
            <svg class="w-4 h-4 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span class="hidden sm:inline">새로 만들기</span>
          </button>
        </div>
      </div>

      <!-- 로딩 스피너 -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p class="text-muted-foreground">워크스페이스를 불러오는 중...</p>
        </div>
      </div>

      <!-- 워크스페이스 그리드 (로딩 완료 후) -->
      <div v-else-if="workspaces.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div
          v-for="workspace in workspaces"
          :key="workspace.id"
          class="group bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98] sm:active:scale-100"
          @click="openWorkspace(workspace.id)"
        >
          <div class="p-4 sm:p-6">
            <!-- 워크스페이스 헤더 -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1 min-w-0">
                <h3 class="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {{ workspace.name }}
                </h3>
                <p v-if="workspace.description" class="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {{ workspace.description }}
                </p>
              </div>
              
              <!-- 공개/비공개 표시 -->
              <div class="flex items-center space-x-2 ml-3 flex-shrink-0">
                <span 
                  :class="workspace.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                  class="px-2 py-1 text-xs rounded-full"
                >
                  {{ workspace.isPublic ? '공개' : '비공개' }}
                </span>
                
                <!-- 설정 버튼 -->
                <button
                  @click.stop="openWorkspaceSettings(workspace)"
                  class="opacity-0 group-hover:opacity-100 p-2 sm:p-1 text-muted-foreground hover:text-foreground transition-all rounded min-w-[32px] min-h-[32px] sm:min-w-0 sm:min-h-0"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- 통계 정보 -->
            <div class="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
              <div class="text-center p-3 bg-background rounded-md">
                <div class="text-lg font-semibold text-foreground">{{ workspace.itemCount || 0 }}</div>
                <div class="text-xs text-muted-foreground">항목</div>
              </div>
              <div class="text-center p-3 bg-background rounded-md">
                <div class="text-lg font-semibold text-foreground">{{ workspace.categoryCount || 0 }}</div>
                <div class="text-xs text-muted-foreground">카테고리</div>
              </div>
            </div>

            <!-- 최근 수정일 -->
            <div class="flex items-center justify-between text-xs text-muted-foreground">
              <span class="truncate">최근 수정: {{ formatDate(workspace.updatedAt) }}</span>
              <span v-if="workspace.isPublic" class="flex items-center flex-shrink-0 ml-2">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                </svg>
                공유 가능
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 빈 상태 -->
      <div v-else class="text-center py-16">
        <div class="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-foreground mb-2">아직 워크스페이스가 없습니다</h3>
        <p class="text-muted-foreground mb-6">첫 번째 워크스페이스를 만들어 업무 정리를 시작해보세요.</p>
        <button
          @click="handleCreateButtonClick"
          class="inline-flex items-center px-4 sm:px-6 py-3 sm:py-3 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors min-h-[44px]"
        >
          <svg class="w-5 h-5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span class="hidden sm:inline">새로 만들기</span>
        </button>
      </div>
    </main>

    <!-- 워크스페이스 생성 모달 -->
    <CreateWorkspaceModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @create="handleCreateWorkspace"
    />

    <!-- 워크스페이스 설정 모달 -->
    <WorkspaceSettingsModal
      v-if="showSettingsModal && currentWorkspace"
      :workspace="currentWorkspace"
      @close="closeSettingsModal"
      @update="handleUpdateWorkspace"
      @delete="handleDeleteWorkspace"
      @share="handleShareWorkspace"
    />

    <!-- 계정 설정 모달 -->
    <AccountSettingsModal
      v-if="showAccountModal"
      :user="user"
      @close="showAccountModal = false"
    />

    <!-- 회원 탈퇴 확인 모달 -->
    <ConfirmModal
      v-if="showDeleteAccountModal"
      type="danger"
      title="회원 탈퇴"
      message="정말로 회원탈퇴를 하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든 워크스페이스와 데이터가 삭제됩니다."
      confirm-text="탈퇴하기"
      @confirm="handleDeleteAccount"
      @cancel="showDeleteAccountModal = false"
    />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../services/authService.js'
import workspaceService from '../services/workspaceService.js'
import CreateWorkspaceModal from '../components/CreateWorkspaceModal.vue'
import WorkspaceSettingsModal from '../components/WorkspaceSettingsModal.vue'
import AccountSettingsModal from '../components/AccountSettingsModal.vue'
import ConfirmModal from '../components/ConfirmModal.vue'

export default {
  name: 'Dashboard',
  components: {
    CreateWorkspaceModal,
    WorkspaceSettingsModal,
    AccountSettingsModal,
    ConfirmModal
  },
  setup() {
    const router = useRouter()
    const workspaces = ref([])
    const showCreateModal = ref(false)
    const showSettingsModal = ref(false)
    const showProfileMenu = ref(false)
    const showAccountModal = ref(false)
    const showDeleteAccountModal = ref(false)
    const currentWorkspace = ref(null)
    const isLoading = ref(true)
    const profileDropdown = ref(null)

    const user = computed(() => authService.getCurrentUser())

    // 워크스페이스 목록 로드
    const loadWorkspaces = async () => {
      try {
        console.log('=== 워크스페이스 목록 로드 시작 ===')
        isLoading.value = true
        const userId = user.value?.uid
        console.log('사용자 ID:', userId)
        
        if (userId) {
          console.log('워크스페이스 서비스에서 목록 가져오기...')
          const data = await workspaceService.getUserWorkspaces(userId)
          console.log('가져온 워크스페이스 데이터:', data)
          console.log('워크스페이스 개수:', data.length)
          
          // 각 워크스페이스의 실제 아이템/카테고리 개수 계산
          const workspacesWithCounts = await Promise.all(
            data.map(async (workspace) => {
              const [itemCount, categoryCount] = await workspaceService.getWorkspaceCounts(workspace.id)
              return {
                ...workspace,
                itemCount,
                categoryCount
              }
            })
          )
          
          workspaces.value = workspacesWithCounts
          console.log('workspaces.value 업데이트 완료 (개수 포함):', workspaces.value)
        } else {
          console.log('사용자 ID가 없음')
        }
      } catch (error) {
        console.error('워크스페이스 로드 오류:', error)
      } finally {
        isLoading.value = false
        console.log('워크스페이스 로드 완료')
      }
    }

    // 워크스페이스 열기
    const openWorkspace = (workspaceId) => {
      router.push(`/workspace/${workspaceId}`)
    }

    // 새 워크스페이스 버튼 클릭 테스트
    const handleCreateButtonClick = () => {
      console.log('=== 새 워크스페이스 버튼 클릭됨! ===')
      console.log('현재 사용자:', user.value)
      console.log('로그인 상태:', authService.isLoggedIn())
      
      if (!user.value) {
        console.error('사용자가 로그인되어 있지 않습니다!')
        alert('먼저 로그인해주세요!')
        return
      }
      
      console.log('모달 열기 시도...')
      showCreateModal.value = true
      console.log('showCreateModal:', showCreateModal.value)
    }

    // 워크스페이스 설정 열기
    const openWorkspaceSettings = (workspace) => {
      currentWorkspace.value = workspace
      showSettingsModal.value = true
    }

    // 설정 모달 닫기
    const closeSettingsModal = () => {
      showSettingsModal.value = false
      currentWorkspace.value = null
    }

    // 워크스페이스 생성
    const handleCreateWorkspace = async (workspaceData) => {
      try {
        console.log('=== Dashboard에서 create 이벤트 받음! ===')
        console.log('받은 워크스페이스 데이터:', workspaceData)
        
        const userId = user.value?.uid
        console.log('현재 사용자 ID:', userId)
        
        if (!userId) {
          console.error('사용자가 로그인되어 있지 않습니다.')
          alert('로그인이 필요합니다.')
          return
        }
        
        // 새 워크스페이스 생성
        console.log('워크스페이스 서비스 호출 시작...')
        const newWorkspaceId = await workspaceService.createWorkspace(userId, workspaceData)
        console.log('워크스페이스 생성 완료:', newWorkspaceId)
        
        // 즉시 목록에 추가 (서비스에서 가져오지 말고 직접 추가)
        const newWorkspace = {
          id: newWorkspaceId,
          name: workspaceData.name,
          description: workspaceData.description,
          isPublic: workspaceData.isPublic,
          userId: userId,
          itemCount: 0,
          categoryCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        console.log('새 워크스페이스를 목록에 직접 추가:', newWorkspace)
        workspaces.value.unshift(newWorkspace) // 맨 앞에 추가
        
        console.log('현재 워크스페이스 목록:', workspaces.value)
        console.log('워크스페이스 개수:', workspaces.value.length)
        
        console.log('모달 닫기...')
        showCreateModal.value = false
        
        console.log('전체 프로세스 완료!')
        alert('워크스페이스가 성공적으로 생성되었습니다!')
      } catch (error) {
        console.error('워크스페이스 생성 오류:', error)
        alert('워크스페이스 생성 중 오류가 발생했습니다: ' + error.message)
      }
    }

    // 워크스페이스 업데이트
    const handleUpdateWorkspace = async (workspaceId, updates) => {
      try {
        console.log('=== 워크스페이스 업데이트 시작 ===')
        console.log('워크스페이스 ID:', workspaceId)
        console.log('업데이트 데이터:', updates)
        
        await workspaceService.updateWorkspace(workspaceId, updates)
        console.log('워크스페이스 업데이트 완료')
        
        closeSettingsModal()
        console.log('모달 닫기 완료')
        
        await loadWorkspaces()
        console.log('워크스페이스 목록 새로고침 완료')
        
        alert('워크스페이스가 성공적으로 수정되었습니다!')
      } catch (error) {
        console.error('워크스페이스 업데이트 오류:', error)
        alert('워크스페이스 수정 중 오류가 발생했습니다: ' + error.message)
      }
    }

    // 워크스페이스 삭제
    const handleDeleteWorkspace = async (workspaceId) => {
      try {
        await workspaceService.deleteWorkspace(workspaceId)
        closeSettingsModal()
        await loadWorkspaces()
      } catch (error) {
        console.error('워크스페이스 삭제 오류:', error)
      }
    }

    // 워크스페이스 공유
    const handleShareWorkspace = (workspaceId) => {
      const shareLink = workspaceService.generateShareLink(workspaceId)
      navigator.clipboard.writeText(shareLink)
      alert('공유 링크가 클립보드에 복사되었습니다!')
    }

    // 프로필 메뉴 토글
    const toggleProfileMenu = () => {
      showProfileMenu.value = !showProfileMenu.value
    }

    // 계정 설정 모달 열기
    const openAccountSettings = () => {
      showProfileMenu.value = false
      showAccountModal.value = true
    }

    // 회원 탈퇴 모달 열기
    const openDeleteAccountModal = () => {
      showProfileMenu.value = false
      showDeleteAccountModal.value = true
    }

    // 회원 탈퇴 처리
    const handleDeleteAccount = async () => {
      try {
        // 데모 모드에서는 로그아웃만 처리
        await authService.signOut()
        router.push('/')
        console.log('계정 삭제 처리')
      } catch (error) {
        console.error('계정 삭제 오류:', error)
      }
    }

    // 로그아웃
    const handleLogout = async () => {
      try {
        showProfileMenu.value = false
        await authService.signOut()
        router.push('/')
      } catch (error) {
        console.error('로그아웃 오류:', error)
      }
    }

    // 날짜 포맷
    const formatDate = (date) => {
      return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date)
    }

    // 외부 클릭 시 프로필 메뉴 닫기
    const handleClickOutside = (event) => {
      if (profileDropdown.value && !profileDropdown.value.contains(event.target)) {
        showProfileMenu.value = false
      }
    }

    onMounted(async () => {
      console.log('=== Dashboard 마운트됨 ===')
      console.log('현재 사용자:', user.value)
      console.log('인증 서비스 상태:', authService.isLoggedIn())
      
      // 로그인되지 않은 사용자는 메인 화면으로 리다이렉트
      if (!user.value) {
        console.log('사용자가 로그인되지 않음, 메인 화면으로 리다이렉트')
        router.push('/')
        return
      }
      
      // 워크스페이스 로드
      loadWorkspaces()
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      user,
      workspaces,
      showCreateModal,
      showSettingsModal,
      showProfileMenu,
      showAccountModal,
      showDeleteAccountModal,
      currentWorkspace,
      isLoading,
      profileDropdown,
      openWorkspace,
      openWorkspaceSettings,
      closeSettingsModal,
      toggleProfileMenu,
      openAccountSettings,
      openDeleteAccountModal,
      handleCreateButtonClick,
      handleCreateWorkspace,
      handleUpdateWorkspace,
      handleDeleteWorkspace,
      handleDeleteAccount,
      handleShareWorkspace,
      handleLogout,
      formatDate
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
