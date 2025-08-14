import { ref, computed } from 'vue'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../firebase.js'

// 전역 상태 관리
const qaItems = ref([])
const categories = ref([])
const isLoading = ref(false)
const error = ref(null)

export function useFirestore() {
  
  // 질문/답변 아이템 실시간 감시
  const subscribeToQAItems = () => {
    const q = query(collection(db, 'qaItems'), orderBy('createdAt', 'desc'))
    
    return onSnapshot(q, (snapshot) => {
      qaItems.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }))
    }, (err) => {
      console.error('QA Items 구독 오류:', err)
      error.value = err.message
    })
  }

  // 카테고리 실시간 감시
  const subscribeToCategories = () => {
    const q = query(collection(db, 'categories'), orderBy('name'))
    
    return onSnapshot(q, (snapshot) => {
      categories.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        items: [] // 아이템은 별도로 로드
      }))
    }, (err) => {
      console.error('Categories 구독 오류:', err)
      error.value = err.message
    })
  }

  // 질문/답변 추가
  const addQAItem = async (qaData) => {
    try {
      isLoading.value = true
      error.value = null

      const docRef = await addDoc(collection(db, 'qaItems'), {
        ...qaData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'pending' // pending, categorized, archived
      })

      console.log('QA Item 추가됨:', docRef.id)
      return docRef.id
    } catch (err) {
      console.error('QA Item 추가 오류:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 질문/답변 업데이트 (카테고리 배치 등)
  const updateQAItem = async (id, updates) => {
    try {
      isLoading.value = true
      error.value = null

      await updateDoc(doc(db, 'qaItems', id), {
        ...updates,
        updatedAt: serverTimestamp()
      })

      console.log('QA Item 업데이트됨:', id)
    } catch (err) {
      console.error('QA Item 업데이트 오류:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 질문/답변 삭제
  const deleteQAItem = async (id) => {
    try {
      isLoading.value = true
      error.value = null

      await deleteDoc(doc(db, 'qaItems', id))
      console.log('QA Item 삭제됨:', id)
    } catch (err) {
      console.error('QA Item 삭제 오류:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 카테고리 추가
  const addCategory = async (categoryData) => {
    try {
      isLoading.value = true
      error.value = null

      const docRef = await addDoc(collection(db, 'categories'), {
        ...categoryData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      console.log('Category 추가됨:', docRef.id)
      return docRef.id
    } catch (err) {
      console.error('Category 추가 오류:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 카테고리 업데이트
  const updateCategory = async (id, updates) => {
    try {
      isLoading.value = true
      error.value = null

      await updateDoc(doc(db, 'categories', id), {
        ...updates,
        updatedAt: serverTimestamp()
      })

      console.log('Category 업데이트됨:', id)
    } catch (err) {
      console.error('Category 업데이트 오류:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 카테고리 삭제
  const deleteCategory = async (id) => {
    try {
      isLoading.value = true
      error.value = null

      await deleteDoc(doc(db, 'categories', id))
      console.log('Category 삭제됨:', id)
    } catch (err) {
      console.error('Category 삭제 오류:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 아이템을 카테고리로 이동
  const moveItemToCategory = async (itemId, categoryId) => {
    await updateQAItem(itemId, {
      categoryId: categoryId,
      status: 'categorized'
    })
  }

  // 아이템을 대기 상태로 이동
  const moveItemToPending = async (itemId) => {
    await updateQAItem(itemId, {
      categoryId: null,
      status: 'pending'
    })
  }

  // Computed 속성들
  const pendingItems = computed(() => 
    qaItems.value.filter(item => item.status === 'pending' || !item.categoryId)
  )

  const categorizedItems = computed(() => 
    qaItems.value.filter(item => item.status === 'categorized' && item.categoryId)
  )

  const categoriesWithItems = computed(() => 
    categories.value.map(category => ({
      ...category,
      items: categorizedItems.value.filter(item => item.categoryId === category.id)
    }))
  )

  return {
    // 상태
    qaItems,
    categories,
    categoriesWithItems,
    pendingItems,
    categorizedItems,
    isLoading,
    error,

    // 구독 함수
    subscribeToQAItems,
    subscribeToCategories,

    // QA Item 함수
    addQAItem,
    updateQAItem,
    deleteQAItem,

    // Category 함수
    addCategory,
    updateCategory,
    deleteCategory,

    // 유틸리티 함수
    moveItemToCategory,
    moveItemToPending
  }
}




