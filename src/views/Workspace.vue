<template>
  <div class="min-h-screen bg-background">
    <!-- 헤더 -->
    <header class="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <router-link 
              to="/dashboard"
              class="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              대시보드
            </router-link>
            <div class="w-px h-6 bg-border"></div>
            <h1 class="text-2xl font-bold text-foreground">{{ workspaceName || '업무 정리 도우미' }}</h1>
            <div class="hidden md:flex items-center space-x-2">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span class="text-sm text-muted-foreground">AI 연결됨</span>
            </div>
          </div>
          
          <!-- 검색바 -->
          <div class="flex items-center space-x-4">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="검색..."
                class="w-64 px-4 py-2 pl-10 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            
            <!-- 새 질문/답변 버튼 -->
            <button
              @click="showQAModal = true"
              class="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors shadow-sm"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              새 질문/답변
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

      <!-- 실제 콘텐츠 (로딩 완료 후 표시) -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <!-- 대기 영역 -->
        <div class="lg:col-span-1">
          <div class="bg-card border border-border rounded-lg shadow-sm">
            <div class="p-4 border-b border-border">
              <h2 class="text-lg font-semibold text-foreground flex items-center">
                <svg class="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                대기 중
                <span class="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  {{ filteredPendingItems.length }}
                </span>
              </h2>
            </div>
            <div 
              class="p-4 space-y-3 min-h-[400px]" 
              ref="pendingArea"
              @drop="onDropToPending"
              @dragover.prevent
              @dragenter.prevent
            >
              <div
                v-for="item in filteredPendingItems"
                :key="item.id"
                class="p-3 bg-background border border-dashed border-border rounded-md hover:shadow-md transition-all relative group"
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
                <div class="pr-8">
                  <h3 class="font-medium text-sm text-foreground mb-1">{{ item.question }}</h3>
                  <p class="text-xs text-muted-foreground line-clamp-2">{{ item.aiSummary || item.answer }}</p>
                  
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

                  <div class="flex items-center justify-between mt-2">
                    <span class="text-xs text-muted-foreground">{{ formatDate(item.createdAt) }}</span>
                    <div class="flex space-x-1">
                      <button 
                        @click.stop="editItem(item)"
                        class="text-xs text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-1"
                      >
                        편집
                      </button>
                      <button 
                        @click.stop="deleteItem(item.id)"
                        class="text-xs text-destructive hover:underline focus:outline-none focus:ring-2 focus:ring-destructive/20 rounded px-1"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
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
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-foreground">카테고리</h2>
            <button
              @click="showCategoryModal = true"
              class="inline-flex items-center px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              카테고리 추가
            </button>
          </div>

          <!-- 카테고리 그리드 -->
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div
              v-for="category in filteredCategories"
              :key="category.id"
              class="bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-all"
              :class="{ 'ring-2 ring-primary/50 bg-primary/5': dragOverCategory === category.id }"
              @drop="onDrop($event, category)"
              @dragover.prevent="onDragOver(category)"
              @dragenter.prevent="onDragEnter(category)"
              @dragleave="onDragLeave"
            >
              <div class="p-4 border-b border-border">
                <div class="flex items-center justify-between">
                  <h3 class="font-semibold text-foreground flex items-center">
                    <div 
                      class="w-3 h-3 rounded-full mr-2"
                      :style="{ backgroundColor: category.color }"
                    ></div>
                    {{ category.name }}
                  </h3>
                  <div class="flex items-center space-x-2">
                    <span class="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                      {{ category.items.length }}
                    </span>
                    <button
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
              </div>
              
              <div class="p-4 space-y-3 min-h-[300px]">
                <div
                  v-for="item in category.items"
                  :key="item.id"
                  class="p-3 bg-background border border-border rounded-md hover:shadow-sm transition-all relative group"
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
                  <div class="pr-8">
                    <h4 class="font-medium text-sm text-foreground mb-1">{{ item.question }}</h4>
                    <p class="text-xs text-muted-foreground line-clamp-3">{{ item.aiSummary || item.answer }}</p>
                    <div class="flex items-center justify-between mt-2">
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

    // 샘플 데이터
    const pendingItems = ref([
      {
        id: 1,
        question: "Vue.js에서 반응형 데이터는 어떻게 작동하나요?",
        answer: "Vue.js의 반응형 시스템은 Proxy를 사용하여 데이터 변경을 감지하고 자동으로 UI를 업데이트합니다.",
        createdAt: new Date()
      },
      {
        id: 2,
        question: "Firebase와 Vue.js 연동 방법",
        answer: "Firebase SDK를 설치하고 초기화한 후, Vue 컴포넌트에서 Firestore나 Authentication 서비스를 사용할 수 있습니다.",
        createdAt: new Date()
      }
    ])

    const categories = ref([
      {
        id: 1,
        name: 'Vue.js 개발',
        color: '#10b981',
        description: 'Vue.js 프론트엔드 개발 관련 정보',
        items: [
          {
            id: 101,
            question: "Vue 3의 Composition API 사용법",
            answer: "setup() 함수를 사용하여 반응형 데이터와 함수를 정의합니다.",
            aiSummary: "Vue 3 Composition API: setup() 함수로 반응형 데이터 관리, 코드 재사용성 향상",
            createdAt: new Date()
          }
        ]
      },
      {
        id: 2,
        name: 'Firebase 백엔드',
        color: '#f59e0b',
        description: 'Firebase 백엔드 서비스 관련 정보',
        items: []
      },
      {
        id: 3,
        name: 'UI/UX 디자인',
        color: '#8b5cf6',
        description: '사용자 인터페이스 및 경험 디자인',
        items: []
      }
    ])

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
        
        const newItem = {
          question: qaData.question,
          answer: qaData.answer,
          tags: qaData.tags || [],
          workspaceId: props.id, // 워크스페이스 ID 추가
          status: 'pending', // 대기 상태
          createdAt: new Date(),
          updatedAt: new Date()
        }

        // AI 결과가 있다면 추가
        if (qaData.aiResult) {
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
        
        // Firestore 오류 시 기본 데모 데이터 사용
        console.log('Firestore 실패, 기본 데모 데이터 사용')
        pendingItems.value = [
          {
            id: 'demo-1',
            question: "Vue.js에서 반응형 데이터는 어떻게 작동하나요?",
            answer: "Vue.js의 반응형 시스템은 Proxy를 사용하여 데이터 변경을 감지하고 자동으로 UI를 업데이트합니다.",
            createdAt: new Date(),
            status: 'pending'
          },
          {
            id: 'demo-2',
            question: "Firebase와 Vue.js 연동 방법",
            answer: "Firebase SDK를 설치하고 초기화한 후, Vue 컴포넌트에서 Firestore나 Authentication 서비스를 사용할 수 있습니다.",
            createdAt: new Date(),
            status: 'pending'
          }
        ]
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
        
        console.log('✅ 카테고리 로드 완료:', loadedCategories.length, '개')
        console.log('로드된 카테고리:', loadedCategories)
        
        // 기존 데모 카테고리 제거하고 로드된 카테고리로 교체
        categories.value = loadedCategories
        
      } catch (error) {
        console.error('카테고리 로드 오류:', error)
        
        // Firestore 오류 시 기본 데모 카테고리 사용
        console.log('Firestore 실패, 기본 데모 카테고리 사용')
        categories.value = [
          {
            id: 'demo-1',
            name: 'Vue.js 개발',
            color: '#10b981',
            description: 'Vue.js 프론트엔드 개발 관련 정보',
            items: []
          },
          {
            id: 'demo-2',
            name: 'Firebase 백엔드',
            color: '#f59e0b',
            description: 'Firebase 백엔드 서비스 관련 정보',
            items: []
          },
          {
            id: 'demo-3',
            name: 'UI/UX 디자인',
            color: '#8b5cf6',
            description: '사용자 인터페이스 및 경험 디자인',
            items: []
          }
        ]
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
        } else {
          workspaceName.value = '워크스페이스'
        }
      } catch (error) {
        console.error('워크스페이스 정보 로드 실패:', error)
        workspaceName.value = '워크스페이스'
      }
    }

    onMounted(async () => {
      console.log('워크스페이스 ID:', props.id)
      try {
        isLoading.value = true
        await loadWorkspaceMeta() // 제목 등 메타 먼저 로드
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
