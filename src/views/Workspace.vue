<template>
  <div class="min-h-screen bg-background">
    <!-- 헤더 -->
    <header class="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div class="container mx-auto px-4 py-3">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div class="flex items-center justify-between md:justify-start md:space-x-4">
            <div class="flex items-center">
              <router-link 
                v-if="isLoggedIn()"
                to="/dashboard"
                class="flex items-center text-muted-foreground hover:text-foreground transition-colors mr-3 md:mr-4"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                <span class="hidden md:inline">대시보드</span>
              </router-link>
              <div class="hidden md:block w-px h-6 bg-border mr-4"></div>
              <!-- 공개 워크스페이스에서 메인으로 이동하는 홈 아이콘 -->
              <router-link
                v-if="isPublicWorkspace"
                to="/"
                class="mr-2 md:mr-3"
                title="메인으로"
                aria-label="메인으로"
              >
                <div class="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </div>
              </router-link>
              <h1 class="text-xl md:text-2xl font-bold text-foreground whitespace-nowrap break-keep">{{ workspaceName || '업무 정리 도우미' }}</h1>
              <!-- 공개 워크스페이스 공유 버튼 (보기 전용일 때만) -->
              <button
                v-if="isPublicWorkspace"
                @click="copyShareLink"
                class="ml-2 md:ml-3 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
                title="링크 복사"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16h8M8 12h8M8 8h8M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H9l-4 4v10a2 2 0 002 2z"/></svg>
              </button>
              <div class="ml-2 hidden md:flex items-center space-x-2">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-sm text-muted-foreground">AI 연결됨</span>
              </div>
            </div>
          </div>

          <!-- 검색바 / 액션 -->
          <div class="flex items-center gap-2 md:gap-3">
            <div class="relative flex-1 md:flex-none">
              <input
                ref="searchInputRef"
                v-model="searchQuery"
                type="text"
                placeholder="검색..."
                class="w-full md:w-64 pr-10 md:pr-12 py-2 pl-12 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
              <div class="absolute top-1/2 -translate-y-1/2 left-3 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <button
                v-if="searchQuery"
                @click="clearSearch"
                type="button"
                aria-label="검색어 지우기"
                class="absolute top-1/2 -translate-y-1/2 right-3 rounded p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <button
              @click="applySearch"
              class="inline-flex items-center justify-center px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors whitespace-nowrap"
              aria-label="검색"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <span class="hidden sm:inline ml-2">검색</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 메인 컨텐츠 -->
    <main class="container mx-auto px-4 py-8">
      <!-- 로딩 스피너 -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p class="text-muted-foreground">데이터를 불러오는 중...</p>
        </div>
      </div>

      <!-- 접근 거부 (비공개 + 비회원) -->
      <div v-else-if="accessDenied" class="text-center py-20">
        <p class="text-muted-foreground">비공개 워크스페이스입니다. 열람하려면 로그인하세요.</p>
      </div>

      <!-- 실제 콘텐츠 (로딩 완료 후 표시) -->
      <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
        
        <!-- 대기 영역 -->
        <div class="lg:col-span-1">
          <div class="bg-card border border-border rounded-lg shadow-sm">
            <button
              class="w-full text-left p-4 border-b border-border flex items-center justify-between hover:bg-muted/30"
              @click="togglePending()"
            >
              <h2 class="text-lg font-semibold text-foreground flex items-center">
                <svg class="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                대기 중
                <span class="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  {{ filteredPendingItems.length }}
                </span>
              </h2>
              <svg :class="[shouldShowPending ? 'rotate-180' : 'rotate-0', 'w-4 h-4 text-muted-foreground transition-transform']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </button>
              <div 
              v-show="shouldShowPending"
              class="p-5 space-y-4" 
              ref="pendingArea"
              @drop="onDropToPending"
              @dragover.prevent
              @dragenter.prevent
            >
                 <div
                   v-for="item in filteredPendingItems"
                   :key="item.id"
                   class="p-5 md:p-6 bg-background border border-dashed border-border rounded-xl hover:shadow-md transition-all relative group"
                 >
                <!-- 드래그 핸들 영역 -->
                <div 
                  class="absolute top-2 right-2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
                  draggable="true"
                  @dragstart="dragStart(item, 'pending')"
                  @dragend="dragEnd"
                  title="드래그하여 카테고리로 이동"
                >
                  <svg class="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                  </svg>
                </div>

                <!-- 콘텐츠 영역 -->
                   <div class="pr-6">
                     <h3 class="font-semibold text-[14px] md:text-[15px] text-foreground mb-1 tracking-tight">{{ item.question }}</h3>
                     <p class="text-[12px] md:text-[13px] leading-6 text-muted-foreground line-clamp-6">{{ item.aiSummary || item.answer }}</p>
                  
                  <!-- AI 제안 카테고리 -->
                  <div v-if="item.suggestedCategory" class="mt-2 flex items-center space-x-2">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                      제안: {{ item.suggestedCategory }}
                    </span>
                    
                    <button 
                      v-if="item.needsCategoryCreation"
                      @click.stop="createSuggestedCategory(item)"
                      class="text-xs text-green-600 hover:text-green-800 font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 rounded px-1"
                    >
                      카테고리 생성
                    </button>
                  </div>

                  <!-- 태그들 -->
                  <div v-if="item.aiTags && item.aiTags.length > 0" class="mt-1 flex flex-wrap gap-1">
                    <span 
                      v-for="tag in item.aiTags" 
                      :key="tag"
                      class="inline-block px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
                    >
                      #{{ tag }}
                    </span>
                  </div>

                   <div class="flex items-center justify-between mt-3">
                     <span class="text-xs text-muted-foreground">{{ formatDate(item.createdAt) }}</span>
                     <button 
                       @click.stop="showItemDetail(item)"
                       class="text-xs text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-1"
                     >
                       자세히
                     </button>
                   </div>
                </div>
              </div>
              <!-- 카테고리 닫기 버튼 (대기 중 전용, 내용 외부) -->
              <div v-if="shouldShowPending" class="px-3 md:px-4 pb-1">
                <button type="button" @click.stop="togglePending()" class="ml-auto block text-[11px] md:text-xs text-muted-foreground hover:text-foreground hover:underline px-1 py-0.5 rounded">
                  카테고리 닫기
                </button>
              </div>
              
              <div v-if="filteredPendingItems.length === 0" class="text-center py-8">
                <svg class="w-12 h-12 mx-auto text-muted-foreground mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-3m-13 0h3m-3 0V9a2 2 0 012-2h4a2 2 0 012 2v4"></path>
                </svg>
                <p class="text-muted-foreground text-sm">대기 중인 항목이 없습니다</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 카테고리 영역 -->
        <div class="lg:col-span-3">
          <div class="flex items-center justify-between mb-4 md:mb-6">
            <h2 class="text-lg md:text-xl font-semibold text-foreground">카테고리</h2>
            <div class="flex items-center gap-2">
              <button
                v-if="!viewOnly"
                @click="showQAModal = true"
                class="inline-flex items-center px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span class="hidden md:inline">내용 추가</span>
                <span class="md:hidden">내용</span>
              </button>
              <button
                v-if="!viewOnly"
                @click="showCategoryModal = true"
                class="inline-flex items-center px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span class="hidden sm:inline">카테고리 추가</span>
                <span class="sm:hidden">카테고리</span>
              </button>
            </div>
          </div>

          <!-- 카테고리 그리드 (masonry 컬럼 레이아웃) -->
          <div class="columns-1 md:columns-2 xl:columns-3 gap-4">
            <div
              v-for="category in filteredCategories"
              :key="category.id"
              class="bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-all break-inside-avoid mb-4"
              :class="[
                { 'ring-2 ring-primary/50 bg-primary/5': dragOverCategory === category.id },
                { 'ring-2 ring-primary/40': categoryDragOverId === category.id }
              ]"
              @drop="onDrop($event, category)"
              @dragover.prevent="onDragOver(category)"
              @dragenter.prevent="onDragEnter(category)"
              @dragleave="onDragLeave"
            >
              <button class="w-full text-left p-3 md:p-4 border-b border-border hover:bg-muted/30"
                @click="toggleCategory(category.id)"
                draggable="true"
                @dragstart="onCategoryDragStart(category)"
                @dragover.prevent="onCategoryCardDragOver(category)"
                @dragleave="onCategoryCardDragLeave"
                @drop.prevent="onCategoryDrop(category)"
                @dragend="onCategoryDragEnd"
              >
                <div class="flex items-center justify-between">
                  <h3 class="font-semibold text-foreground flex items-center">
                    <div 
                      class="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full mr-2"
                      :style="{ backgroundColor: category.color }"
                    ></div>
                    <span class="text-sm md:text-base">{{ category.name }}</span>
                  </h3>
                  <div class="flex items-center space-x-2">
                    <span class="px-1.5 py-0.5 md:px-2 md:py-1 bg-muted text-muted-foreground text-xs rounded-full">
                      {{ category.items.length }}
                    </span>
                    <svg :class="[isCategoryExpanded(category.id) ? 'rotate-180' : 'rotate-0', 'w-4 h-4 text-muted-foreground transition-transform']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    <button
                      v-if="!viewOnly"
                      @click.stop="openEditCategoryModal(category)"
                      class="p-1 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
                      title="카테고리 편집"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </button>
              
              <div v-show="shouldShowCategory(category)" class="p-4 md:p-5 space-y-4">
                 <div
                   v-for="item in category.items"
                   :key="item.id"
                  class="p-4 bg-background border border-border rounded-lg hover:shadow-sm transition-all relative group"
                 >
                  <!-- 드래그 핸들 영역 -->
                  <div 
                    class="absolute top-2 right-2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
                    draggable="true"
                    @dragstart="dragStart(item, 'category', category)"
                    @dragend="dragEnd"
                    title="드래그하여 이동"
                  >
                    <svg class="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                    </svg>
                  </div>
                  
                  <!-- 콘텐츠 영역 -->
                  <div class="pr-6">
                    <h4 class="font-medium text-[14px] md:text-[15px] text-foreground mb-2">{{ item.question }}</h4>
                    <p class="text-[12px] md:text-[13px] leading-7 text-muted-foreground line-clamp-5">{{ item.aiSummary || item.answer }}</p>
                    <div class="flex items-center justify-between mt-3">
                       <span class="text-xs text-muted-foreground">{{ formatDate(item.createdAt) }}</span>
                       <button 
                         @click.stop="showItemDetail(item)"
                         class="text-xs text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-1"
                       >
                         자세히
                       </button>
                     </div>
                  </div>
                </div>
                
                <div v-if="category.items.length === 0" class="text-center py-8">
                  <svg class="w-8 h-8 mx-auto text-muted-foreground mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                  <p class="text-muted-foreground text-xs">여기에 항목을 드래그하세요</p>
                </div>
              </div>
              <!-- 카테고리 닫기 버튼 (내용 영역 밖, 하단) -->
              <div v-if="isCategoryExpanded(category.id)" class="px-3 md:px-4 pb-1">
                <button
                  type="button"
                  @click.stop="toggleCategory(category.id)"
                  class="ml-auto block text-[11px] md:text-xs text-muted-foreground hover:text-foreground hover:underline px-1 py-0.5 rounded"
                >
                  카테고리 닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 질문/답변 모달 -->
    <QAModal 
      v-if="showQAModal" 
      @close="showQAModal = false"
      @submit="handleQASubmit"
    />

    <!-- 카테고리 생성 모달 -->
    <CategoryModal
      v-if="showCategoryModal"
      @close="showCategoryModal = false"
      @submit="handleCategorySubmit"
    />

    <!-- 카테고리 편집 모달 -->
    <EditCategoryModal
      v-if="showEditCategoryModal && editingCategory"
      :category="editingCategory"
      @close="closeEditCategoryModal"
      @update="handleCategoryUpdate"
      @delete="handleCategoryDelete"
    />

    <!-- 아이템 상세 모달 -->
    <ItemDetailModal
      v-if="showItemDetailModal && currentItem"
      :item="currentItem"
      :viewOnly="viewOnly"
      @close="closeItemDetailModal"
      @edit="editFromDetail"
    />

    <!-- 아이템 편집 모달 -->
    <EditItemModal
      v-if="showEditItemModal && currentItem"
      :item="currentItem"
      @close="closeEditItemModal"
      @update="handleItemUpdate"
      @delete="deleteItem"
    />

    <!-- 확인 모달 -->
    <ConfirmModal
      v-if="showConfirmModal"
      :title="confirmModalData.title"
      :message="confirmModalData.message"
      :type="confirmModalData.type"
      :confirm-text="confirmModalData.confirmText"
      @confirm="confirmModalData.onConfirm"
      @cancel="closeConfirmModal"
    />
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, query, where, orderBy, getDoc } from 'firebase/firestore'
import { db } from '../firebase.js'
import authService from '../services/authService.js'
import QAModal from '../components/QAModal.vue'
import CategoryModal from '../components/CategoryModal.vue'
import EditCategoryModal from '../components/EditCategoryModal.vue'
import ItemDetailModal from '../components/ItemDetailModal.vue'
import EditItemModal from '../components/EditItemModal.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import aiService from '../services/aiService.js'

export default {
  name: 'Workspace',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  components: {
    QAModal,
    CategoryModal,
    EditCategoryModal,
    ItemDetailModal,
    EditItemModal,
    ConfirmModal
  },
  setup(props) {
    const searchQuery = ref('')
    const searchInputRef = ref(null)
    const applySearch = () => {
      // 입력된 검색어로 필터 반영 (반응형 계산 속성 사용 중이라 별도 로직은 필요 없음)
      // 모바일에서 키보드 내리기 혹은 추가 액션이 필요한 경우를 대비해 함수로 구분
    }
    const clearSearch = () => {
      searchQuery.value = ''
      if (searchInputRef.value) searchInputRef.value.focus()
    }
    const showQAModal = ref(false)
    const showCategoryModal = ref(false)
    const showEditCategoryModal = ref(false)
    const showItemDetailModal = ref(false)
    const showEditItemModal = ref(false)
    const showConfirmModal = ref(false)
    const editingCategory = ref(null)
    const currentItem = ref(null)
    const confirmModalData = ref({})
    const pendingArea = ref(null)
    const dragOverCategory = ref(null)
    const isDragging = ref(false)
    const workspaceName = ref('')
    const isLoading = ref(true)
    const isPublicWorkspace = ref(false)
    const viewOnly = ref(false)
    const accessDenied = ref(false)
    const isLoggedIn = () => authService.isLoggedIn()
    const expandedCategoryIds = ref(new Set())
    const pendingExpanded = ref(true)
    const categoryDragSourceId = ref(null)
    const categoryDragOverId = ref(null)

    // 초기값은 빈 배열로 시작 (데모 데이터 폴백 금지)
    const pendingItems = ref([])
    const categories = ref([])

    let draggedItem = null
    let dragSource = null
    let sourceCategory = null

    const dragStart = (item, source, category = null) => {
      draggedItem = item
      dragSource = source
      sourceCategory = category
      isDragging.value = true
      
      // 드래그 이펙트 설정
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', '')
    }

    const dragEnd = () => {
      isDragging.value = false
      dragOverCategory.value = null
    }

    const onDragEnter = (category) => {
      dragOverCategory.value = category.id
    }

    const onDragOver = (category) => {
      if (draggedItem) {
        dragOverCategory.value = category.id
      }
    }

    const onDragLeave = (event) => {
      // 요소를 완전히 벗어났는지 확인
      if (!event.relatedTarget || !event.currentTarget.contains(event.relatedTarget)) {
        dragOverCategory.value = null
      }
    }

    const onDrop = async (event, category) => {
      event.preventDefault()
      dragOverCategory.value = null

      if (draggedItem && dragSource) {
        // 같은 카테고리에 드롭하는 경우 무시
        if (dragSource === 'category' && sourceCategory && sourceCategory.id === category.id) {
          return
        }

        try {
          console.log('=== 카테고리로 아이템 이동 시작 ===')
          console.log('아이템 ID:', draggedItem.id)
          console.log('타겟 카테고리:', category.name)
          console.log('원본:', dragSource)

          // Firestore에서 아이템 상태 업데이트
          await updateDoc(doc(db, 'qaItems', draggedItem.id), {
            status: 'categorized',
            categoryId: category.id,
            categoryName: category.name,
            updatedAt: new Date()
          })
          console.log('✅ Firestore 아이템 상태 업데이트 완료')

          // 로컬 상태 업데이트 (즉시 UI 반영)
          // 원본에서 제거
          if (dragSource === 'pending') {
            const index = pendingItems.value.findIndex(item => item.id === draggedItem.id)
            if (index > -1) {
              pendingItems.value.splice(index, 1)
              console.log('로컬 대기 목록에서 제거')
            }
          } else if (dragSource === 'category' && sourceCategory) {
            const index = sourceCategory.items.findIndex(item => item.id === draggedItem.id)
            if (index > -1) {
              sourceCategory.items.splice(index, 1)
              console.log(`로컬 카테고리 "${sourceCategory.name}"에서 제거`)
            }
          }

          // 대상 카테고리에 추가
          category.items.push({
            ...draggedItem,
            status: 'categorized',
            categoryId: category.id,
            categoryName: category.name,
            aiSummary: draggedItem.aiSummary || `AI 요약: ${draggedItem.answer.substring(0, 50)}...`
          })
          console.log(`로컬 카테고리 "${category.name}"에 추가`)

          console.log('카테고리 이동 완료!')

        } catch (error) {
          console.error('카테고리 이동 오류:', error)
          alert('아이템 이동 중 오류가 발생했습니다: ' + error.message)
        }

        // 초기화
        draggedItem = null
        dragSource = null
        sourceCategory = null
      }
    }

    const onDropToPending = async (event) => {
      event.preventDefault()
      dragOverCategory.value = null

      if (draggedItem && dragSource === 'category' && sourceCategory) {
        try {
          console.log('=== 대기 목록으로 아이템 이동 시작 ===')
          console.log('아이템 ID:', draggedItem.id)
          console.log('원본 카테고리:', sourceCategory.name)

          // Firestore에서 아이템 상태를 pending으로 되돌리기
          await updateDoc(doc(db, 'qaItems', draggedItem.id), {
            status: 'pending',
            categoryId: null,
            categoryName: null,
            updatedAt: new Date()
          })
          console.log('✅ Firestore 아이템 상태 업데이트 완료 (pending)')

          // 로컬 상태 업데이트
          // 카테고리에서 제거
          const index = sourceCategory.items.findIndex(item => item.id === draggedItem.id)
          if (index > -1) {
            sourceCategory.items.splice(index, 1)
            console.log(`로컬 카테고리 "${sourceCategory.name}"에서 제거`)
          }

          // 대기 목록에 추가
          pendingItems.value.push({
            ...draggedItem,
            status: 'pending',
            categoryId: null,
            categoryName: null,
            // AI 요약 제거
            aiSummary: undefined
          })
          console.log('로컬 대기 목록에 추가')

          console.log('대기 목록 이동 완료!')

        } catch (error) {
          console.error('대기 목록 이동 오류:', error)
          alert('아이템 이동 중 오류가 발생했습니다: ' + error.message)
        }

        // 초기화
        draggedItem = null
        dragSource = null
        sourceCategory = null
      }
    }

    const handleQASubmit = async (qaData) => {
      try {
        console.log('=== QA 데이터 Firestore 저장 시작 ===')
        console.log('워크스페이스 ID:', props.id)
        console.log('QA 데이터:', qaData)
        
        // 입력 형식 정규화 (신규 모달/기존 문자열 대응)
        const questionText = typeof qaData === 'string'
          ? (qaData.length > 30 ? qaData.substring(0, 30) + '...' : qaData)
          : (qaData.title?.trim() || '제목없음')
        const answerText = typeof qaData === 'string' ? qaData : (qaData.content || '')

        const newItem = {
          question: questionText,
          answer: answerText,
          tags: qaData.tags || [],
          workspaceId: props.id, // 워크스페이스 ID 추가
          status: 'pending', // 대기 상태
          createdAt: new Date(),
          updatedAt: new Date()
        }

        // AI 결과가 있다면 추가
        if (qaData.aiResult || qaData.reprocessAI) {
          newItem.aiSummary = qaData.aiResult.summary
          newItem.suggestedCategory = qaData.aiResult.suggestedCategory
          newItem.aiTags = qaData.aiResult.tags || []
          
          // 제안된 카테고리가 있고 존재하지 않는다면 자동 생성할지 물어보기
          const existingCategory = categories.value.find(cat => 
            cat.name.toLowerCase() === qaData.aiResult.suggestedCategory.toLowerCase()
          )
          
          if (!existingCategory && qaData.aiResult.suggestedCategory !== '미분류') {
            newItem.needsCategoryCreation = true
          }
        }

        // Firestore에 저장
        const docRef = await addDoc(collection(db, 'qaItems'), newItem)
        console.log('✅ QA 아이템 Firestore 저장 완료:', docRef.id)
        
        // 로컬 상태에도 추가 (즉시 UI 업데이트)
        const localItem = {
          id: docRef.id, // Firestore 문서 ID 사용
          ...newItem
        }
        
        pendingItems.value.push(localItem)
        showQAModal.value = false
        
        console.log('로컬 상태 업데이트 완료')
        
      } catch (error) {
        console.error('QA 데이터 저장 오류:', error)
        alert('질문/답변 저장 중 오류가 발생했습니다: ' + error.message)
      }
    }

    const handleCategorySubmit = async (categoryData) => {
      try {
        console.log('=== 카테고리 생성 시작 ===')
        console.log('카테고리 데이터:', categoryData)
        console.log('워크스페이스 ID:', props.id)
        
        const newCategory = {
          name: categoryData.name,
          color: categoryData.color,
          description: categoryData.description,
          workspaceId: props.id,
          order: categories.value.length,
          createdAt: new Date(),
          updatedAt: new Date()
        }

        // Firestore에 카테고리 저장
        const docRef = await addDoc(collection(db, 'categories'), newCategory)
        console.log('✅ Firestore에 카테고리 저장 완료:', docRef.id)
        
        // 로컬 상태에 추가 (즉시 UI 업데이트)
        const localCategory = {
          id: docRef.id,
          ...newCategory,
          items: []
        }
        
        categories.value.push(localCategory)
        showCategoryModal.value = false
        
        console.log('카테고리 생성 완료!')
        
      } catch (error) {
        console.error('카테고리 생성 오류:', error)
        alert('카테고리 생성 중 오류가 발생했습니다: ' + error.message)
      }
    }

    const createSuggestedCategory = (item) => {
      const newCategory = {
        id: Date.now(),
        name: item.suggestedCategory,
        color: '#10b981',
        description: `AI가 제안한 "${item.suggestedCategory}" 카테고리`,
        items: []
      }
      
      categories.value.push(newCategory)
      
      // 해당 아이템의 카테고리 생성 필요 플래그 제거
      item.needsCategoryCreation = false
      
      // 알림 표시 (실제로는 toast 라이브러리 사용 권장)
      console.log(`"${item.suggestedCategory}" 카테고리가 생성되었습니다.`)
    }

    // 카테고리 편집 모달 열기
    const openEditCategoryModal = (category) => {
      console.log('편집 모달 열기:', category)
      editingCategory.value = category
      showEditCategoryModal.value = true
    }

    // 카테고리 편집 모달 닫기
    const closeEditCategoryModal = () => {
      showEditCategoryModal.value = false
      editingCategory.value = null
    }

    // 카테고리 업데이트
    const handleCategoryUpdate = async (categoryId, updateData) => {
      try {
        console.log('=== 카테고리 업데이트 시작 ===')
        console.log('카테고리 ID:', categoryId)
        console.log('업데이트 데이터:', updateData)
        
        // Firestore에서 카테고리 업데이트
        await updateDoc(doc(db, 'categories', categoryId), {
          ...updateData,
          updatedAt: new Date()
        })
        console.log('✅ Firestore 카테고리 업데이트 완료')
        
        // 로컬 상태 업데이트 (즉시 UI 반영)
        const categoryIndex = categories.value.findIndex(cat => cat.id === categoryId)
        if (categoryIndex > -1) {
          categories.value[categoryIndex] = {
            ...categories.value[categoryIndex],
            ...updateData,
            updatedAt: new Date()
          }
          console.log(`로컬 카테고리 "${updateData.name}" 업데이트 완료`)
        }
        
        closeEditCategoryModal()
        console.log('카테고리 업데이트 전체 완료!')
        
      } catch (error) {
        console.error('카테고리 업데이트 오류:', error)
        alert('카테고리 수정 중 오류가 발생했습니다: ' + error.message)
      }
    }

    // 카테고리 삭제
    const handleCategoryDelete = async (categoryId) => {
      try {
        console.log('=== 카테고리 삭제 시작 ===')
        console.log('카테고리 ID:', categoryId)
        
        const categoryIndex = categories.value.findIndex(cat => cat.id === categoryId)
        if (categoryIndex > -1) {
          const category = categories.value[categoryIndex]
          console.log('삭제할 카테고리:', category.name)
          
          // 1. 카테고리의 모든 아이템들을 pending 상태로 변경
          if (category.items && category.items.length > 0) {
            console.log('카테고리 내 아이템들을 대기 목록으로 이동:', category.items.length, '개')
            
            for (const item of category.items) {
              try {
                // Firestore에서 아이템 상태 업데이트
                await updateDoc(doc(db, 'qaItems', item.id), {
                  status: 'pending',
                  categoryId: null,
                  categoryName: null,
                  updatedAt: new Date()
                })
                console.log('아이템을 대기 상태로 변경:', item.question)
              } catch (itemError) {
                console.error('아이템 상태 변경 오류:', itemError)
              }
            }
            
            // 로컬에서 대기 목록으로 이동
            category.items.forEach(item => {
              pendingItems.value.push({
                ...item,
                status: 'pending',
                categoryId: null,
                categoryName: null,
                aiSummary: undefined
              })
            })
          }
          
          // 2. Firestore에서 카테고리 삭제
          await deleteDoc(doc(db, 'categories', categoryId))
          console.log('✅ Firestore에서 카테고리 삭제 완료')
          
          // 3. 로컬 상태에서 카테고리 제거
          categories.value.splice(categoryIndex, 1)
          console.log(`로컬에서 카테고리 "${category.name}" 삭제 완료`)
        }
        
        closeEditCategoryModal()
        console.log('카테고리 삭제 전체 완료!')
        
      } catch (error) {
        console.error('카테고리 삭제 오류:', error)
        alert('카테고리 삭제 중 오류가 발생했습니다: ' + error.message)
      }
    }

    // 아이템 상세 보기
    const showItemDetail = (item) => {
      console.log('아이템 상세:', item)
      currentItem.value = item
      showItemDetailModal.value = true
    }

    // 아이템 편집
    const editItem = (item) => {
      console.log('아이템 편집:', item)
      currentItem.value = item
      showEditItemModal.value = true
    }

    // 아이템 삭제
    const deleteItem = (itemId) => {
      console.log('아이템 삭제:', itemId)
      confirmModalData.value = {
        title: '항목 삭제',
        message: '이 항목을 영구적으로 삭제하시겠습니까?',
        type: 'danger',
        confirmText: '삭제하기',
        onConfirm: () => performDeleteItem(itemId)
      }
      showConfirmModal.value = true
    }

    // 실제 아이템 삭제 실행 (Firestore + 로컬)
    const performDeleteItem = async (itemId) => {
      try {
        console.log('=== 아이템 삭제 시작 ===')
        console.log('삭제할 아이템 ID:', itemId)
        
        // Firestore에서 문서 삭제
        await deleteDoc(doc(db, 'qaItems', itemId))
        console.log('✅ Firestore에서 아이템 삭제 완료')
        
        // 로컬 상태에서도 삭제 (즉시 UI 업데이트)
        // 대기 목록에서 삭제
        const pendingIndex = pendingItems.value.findIndex(item => item.id === itemId)
        if (pendingIndex > -1) {
          pendingItems.value.splice(pendingIndex, 1)
          console.log('로컬 대기 목록에서 삭제됨')
        }
        
        // 카테고리에서 삭제
        categories.value.forEach(category => {
          const itemIndex = category.items.findIndex(item => item.id === itemId)
          if (itemIndex > -1) {
            category.items.splice(itemIndex, 1)
            console.log(`로컬 카테고리 "${category.name}"에서 삭제됨`)
          }
        })
        
        showConfirmModal.value = false
        console.log('아이템 삭제 완료!')
        
      } catch (error) {
        console.error('아이템 삭제 오류:', error)
        alert('아이템 삭제 중 오류가 발생했습니다: ' + error.message)
      }
    }

    // 아이템 업데이트
    const handleItemUpdate = async (itemId, updateData) => {
      console.log('아이템 업데이트:', itemId, updateData)
      
      let aiResult = null
      if (updateData.reprocessAI) {
        try {
          aiResult = await aiService.summarizeQA(updateData.question, updateData.answer)
        } catch (error) {
          console.error('AI 처리 오류:', error)
        }
      }

      const updatedItem = {
        question: updateData.question,
        answer: updateData.answer,
        tags: updateData.tags,
        updatedAt: new Date()
      }

      if (aiResult) {
        updatedItem.aiSummary = aiResult.summary
        updatedItem.suggestedCategory = aiResult.suggestedCategory
        updatedItem.aiTags = aiResult.tags || []
      }

      // 1) Firestore에 먼저 반영
      try {
        await updateDoc(doc(db, 'qaItems', itemId), updatedItem)
        console.log('✅ Firestore 업데이트 완료')
      } catch (e) {
        console.error('Firestore 업데이트 실패:', e)
      }

      // 2) 로컬 상태 업데이트
      // 대기 목록에서 업데이트
      const pendingIndex = pendingItems.value.findIndex(item => item.id === itemId)
      if (pendingIndex > -1) {
        pendingItems.value[pendingIndex] = {
          ...pendingItems.value[pendingIndex],
          ...updatedItem
        }
        showEditItemModal.value = false
        return
      }
      
      // 카테고리에서 업데이트
      categories.value.forEach(category => {
        const itemIndex = category.items.findIndex(item => item.id === itemId)
        if (itemIndex > -1) {
          category.items[itemIndex] = {
            ...category.items[itemIndex],
            ...updatedItem
          }
        }
      })
      showEditItemModal.value = false
    }

    // 모달 닫기 함수들
    const closeItemDetailModal = () => {
      showItemDetailModal.value = false
      currentItem.value = null
    }

    const closeEditItemModal = () => {
      showEditItemModal.value = false
      currentItem.value = null
    }

    const closeConfirmModal = () => {
      showConfirmModal.value = false
      confirmModalData.value = {}
    }

    // 상세보기에서 편집으로 이동
    const editFromDetail = (item) => {
      closeItemDetailModal()
      editItem(item)
    }

    const formatDate = (date) => {
      return new Intl.DateTimeFormat('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    }

    // 검색 기능
    const filteredPendingItems = computed(() => {
      if (!searchQuery.value.trim()) return pendingItems.value
      
      const query = searchQuery.value.toLowerCase()
      return pendingItems.value.filter(item => 
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query)
      )
    })

    const filteredCategories = computed(() => {
      if (!searchQuery.value.trim()) return categories.value
      
      const query = searchQuery.value.toLowerCase()
      return categories.value.map(category => ({
        ...category,
        items: category.items.filter(item =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query) ||
          (item.aiSummary && item.aiSummary.toLowerCase().includes(query))
        )
      })).filter(category => 
        category.name.toLowerCase().includes(query) || category.items.length > 0
      )
    })

    // Drawer helper
    const isMobile = () => window.matchMedia('(max-width: 767px)').matches
    const shouldShowPending = computed(() => pendingExpanded.value)
    const togglePending = () => {
      pendingExpanded.value = !pendingExpanded.value
    }
    const isCategoryExpanded = (id) => expandedCategoryIds.value.has(id)
    const shouldShowCategory = (category) => {
      // 검색 중이면 결과를 보여주기 위해 강제로 열기
      if (searchQuery.value.trim()) return true
      return expandedCategoryIds.value.has(category.id)
    }
    const toggleCategory = (id) => {
      if (expandedCategoryIds.value.has(id)) {
        expandedCategoryIds.value.delete(id)
      } else {
        expandedCategoryIds.value.add(id)
      }
      // 재활성화를 위해 새 Set으로 할당 (Vue 반응성)
      expandedCategoryIds.value = new Set(expandedCategoryIds.value)
    }

    // 모바일 초기 상태: 대기중 닫힘
    if (isMobile()) {
      pendingExpanded.value = false
    }

    // 카테고리 드래그/드롭 (순서 재배치)
    const onCategoryDragStart = (category) => {
      categoryDragSourceId.value = category.id
    }
    const onCategoryCardDragOver = (category) => {
      if (category.id !== categoryDragSourceId.value) {
        categoryDragOverId.value = category.id
      }
    }
    const onCategoryCardDragLeave = () => {
      categoryDragOverId.value = null
    }
    const onCategoryDrop = async (targetCategory) => {
      if (categoryDragSourceId.value == null || targetCategory.id === categoryDragSourceId.value) return
      const fromIndex = categories.value.findIndex(c => c.id === categoryDragSourceId.value)
      const toIndex = categories.value.findIndex(c => c.id === targetCategory.id)
      if (fromIndex === -1 || toIndex === -1) return
      const moved = categories.value.splice(fromIndex, 1)[0]
      categories.value.splice(toIndex, 0, moved)
      categoryDragOverId.value = null
      categoryDragSourceId.value = null
      try {
        await Promise.all(
          categories.value.map((cat, index) => updateDoc(doc(db, 'categories', cat.id), { order: index, updatedAt: new Date() }))
        )
        console.log('✅ 카테고리 순서 저장 완료')
      } catch (e) {
        console.warn('카테고리 순서 저장 실패:', e.message)
      }
    }
    const onCategoryDragEnd = () => {
      categoryDragOverId.value = null
      categoryDragSourceId.value = null
    }

    // QA 데이터 로드 함수 (모든 아이템 로드 + 카테고리별 분배)
    const loadQAItems = async () => {
      try {
        console.log('=== QA 데이터 로드 시작 ===')
        console.log('워크스페이스 ID:', props.id)
        
        const q = query(
          collection(db, 'qaItems'),
          where('workspaceId', '==', props.id),
          orderBy('createdAt', 'desc')
        )
        
        const snapshot = await getDocs(q)
        const loadedItems = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        }))
        
        console.log('✅ 전체 QA 데이터 로드 완료:', loadedItems.length, '개')
        console.log('로드된 전체 데이터:', loadedItems)
        
        // 카테고리 아이템 배열 초기화 (중복 방지)
        categories.value.forEach(category => {
          category.items = []
        })
        console.log('카테고리 아이템 배열 초기화 완료')
        
        // 상태별로 아이템 분류
        const pending = loadedItems.filter(item => item.status === 'pending')
        const categorized = loadedItems.filter(item => item.status === 'categorized')
        
        // 대기 아이템 설정
        pendingItems.value = pending
        console.log('대기 중인 아이템:', pending.length, '개')
        
        // 카테고리별 아이템 분배
        categorized.forEach(item => {
          if (item.categoryId) {
            const category = categories.value.find(cat => cat.id === item.categoryId)
            if (category) {
              // 중복 방지
              const exists = category.items.find(existing => existing.id === item.id)
              if (!exists) {
                category.items.push(item)
                console.log(`카테고리 "${category.name}"에 아이템 추가:`, item.question)
              }
            } else {
              console.warn('카테고리를 찾을 수 없음:', item.categoryId, '아이템:', item.question)
              // 카테고리가 없으면 대기 목록으로 이동
              pendingItems.value.push({
                ...item,
                status: 'pending',
                categoryId: null,
                categoryName: null
              })
            }
          }
        })
        
        console.log('카테고리별 아이템 분배 완료')
        categories.value.forEach(cat => {
          console.log(`카테고리 "${cat.name}": ${cat.items.length}개`)
        })
        
      } catch (error) {
        console.error('QA 데이터 로드 오류:', error)
        // 권한 거부 시 접근 불가 표시
        if (error?.code === 'permission-denied') {
          accessDenied.value = true
        }
        // 데모 폴백 금지: 비워두기만 함
        pendingItems.value = []
      }
    }

    // 카테고리 로드 함수
    const loadCategories = async () => {
      try {
        console.log('=== 카테고리 로드 시작 ===')
        console.log('워크스페이스 ID:', props.id)
        
        const q = query(
          collection(db, 'categories'),
          where('workspaceId', '==', props.id),
          orderBy('createdAt', 'asc')
        )
        
        const snapshot = await getDocs(q)
        const loadedCategories = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          items: [] // 아이템은 별도로 로드
        }))
        // order 기준 정렬 (없으면 큰 값)
        loadedCategories.sort((a, b) => {
          const ao = (a.order ?? Number.MAX_SAFE_INTEGER)
          const bo = (b.order ?? Number.MAX_SAFE_INTEGER)
          if (ao !== bo) return ao - bo
          return a.createdAt - b.createdAt
        })

        console.log('✅ 카테고리 로드 완료:', loadedCategories.length, '개')
        console.log('로드된 카테고리:', loadedCategories)
        
        // 기존 데모 카테고리 제거하고 로드된 카테고리로 교체
        categories.value = loadedCategories
        
      } catch (error) {
        console.error('카테고리 로드 오류:', error)
        if (error?.code === 'permission-denied') {
          accessDenied.value = true
        }
        // 폴백으로 데모 카테고리를 채우지 않음
        categories.value = []
      }
    }

    // 워크스페이스 메타데이터 로드 (제목 등)
    const loadWorkspaceMeta = async () => {
      try {
        const wsRef = doc(db, 'workspaces', props.id)
        const snap = await getDoc(wsRef)
        if (snap.exists()) {
          const data = snap.data()
          workspaceName.value = data?.name || '워크스페이스'
          isPublicWorkspace.value = !!data?.isPublic
          viewOnly.value = !authService.isLoggedIn() && isPublicWorkspace.value
          accessDenied.value = !isPublicWorkspace.value && !authService.isLoggedIn()
        } else {
          workspaceName.value = '워크스페이스'
          accessDenied.value = !authService.isLoggedIn()
        }
      } catch (error) {
        console.error('워크스페이스 정보 로드 실패:', error)
        // 비공개 워크스페이스는 메타도 읽기 금지일 수 있음 → 권한 없음 안내
        if (error?.code === 'permission-denied') {
          accessDenied.value = true
        }
        workspaceName.value = '워크스페이스'
      }
    }

    onMounted(async () => {
      console.log('워크스페이스 ID:', props.id)
      try {
        isLoading.value = true
        await loadWorkspaceMeta() // 제목 등 메타 먼저 로드
        // 비공개 + 비회원이면 이후 데이터 로드를 하지 않고 접근 거부 화면 표시
        if (accessDenied.value) {
          pendingItems.value = []
          categories.value = []
          return
        }
        await loadCategories()    // 카테고리 먼저 로드
        await loadQAItems()       // 그 다음 QA 아이템 로드 (카테고리별 분배를 위해)
      } catch (error) {
        console.error('데이터 로드 오류:', error)
      } finally {
        isLoading.value = false
      }
    })

    return {
      searchQuery,
      searchInputRef,
      showQAModal,
      showCategoryModal,
      showEditCategoryModal,
      showItemDetailModal,
      showEditItemModal,
      showConfirmModal,
      editingCategory,
      currentItem,
      confirmModalData,
      workspaceName,
      pendingItems,
      categories,
      filteredPendingItems,
      filteredCategories,
      clearSearch,
      shouldShowPending,
      togglePending,
      isCategoryExpanded,
      shouldShowCategory,
      toggleCategory,
      categoryDragOverId,
      onCategoryDragStart,
      onCategoryCardDragOver,
      onCategoryCardDragLeave,
      onCategoryDrop,
      onCategoryDragEnd,
      pendingArea,
      isLoading,
      dragOverCategory,
      isDragging,
      dragStart,
      dragEnd,
      onDragEnter,
      onDragOver,
      onDragLeave,
      onDrop,
      onDropToPending,
      handleQASubmit,
      handleCategorySubmit,
      createSuggestedCategory,
      openEditCategoryModal,
      closeEditCategoryModal,
      handleCategoryUpdate,
      handleCategoryDelete,
      showItemDetail,
      editItem,
      deleteItem,
      handleItemUpdate,
      closeItemDetailModal,
      closeEditItemModal,
      closeConfirmModal,
      editFromDetail,
      formatDate,
      isPublicWorkspace,
      viewOnly,
      accessDenied,
      isLoggedIn,
      async copyShareLink() {
        const url = window.location.href
        try {
          await navigator.clipboard.writeText(url)
          alert('링크가 복사되었습니다.')
        } catch (e) {
          const temp = document.createElement('input')
          temp.value = url
          document.body.appendChild(temp)
          temp.select()
          document.execCommand('copy')
          document.body.removeChild(temp)
          alert('링크가 복사되었습니다.')
        }
      }
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
