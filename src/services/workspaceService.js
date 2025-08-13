import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  query, 
  where, 
  orderBy, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../firebase.js'

class WorkspaceService {
  // 사용자의 워크스페이스 목록 가져오기 (Firestore 전용)
  async getUserWorkspaces(userId) {
    const q = query(
      collection(db, 'workspaces'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate() || new Date(),
      updatedAt: docSnap.data().updatedAt?.toDate() || new Date()
    }))
  }

  // 공개 워크스페이스 가져오기 (링크로 접근)
  async getPublicWorkspace(workspaceId) {
    const docRef = doc(db, 'workspaces', workspaceId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const data = docSnap.data()
      if (data.isPublic) {
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        }
      }
    }
    return null
  }

  // 새 워크스페이스 생성 (Firestore 전용)
  async createWorkspace(userId, workspaceData) {
    const docRef = await addDoc(collection(db, 'workspaces'), {
      ...workspaceData,
      userId,
      itemCount: 0,
      categoryCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isPublic: workspaceData.isPublic || false
    })
    return docRef.id
  }

  // 워크스페이스 업데이트 (Firestore 전용)
  async updateWorkspace(workspaceId, updates) {
    const docRef = doc(db, 'workspaces', workspaceId)
    await updateDoc(docRef, { ...updates, updatedAt: serverTimestamp() })
  }

  // 워크스페이스 삭제 (Firestore 전용)
  async deleteWorkspace(workspaceId) {
    await deleteDoc(doc(db, 'workspaces', workspaceId))
  }

  // 워크스페이스 공개 상태 토글
  async toggleWorkspaceVisibility(workspaceId, isPublic) {
    const docRef = doc(db, 'workspaces', workspaceId)
    await updateDoc(docRef, { isPublic, updatedAt: serverTimestamp() })
  }

  // 워크스페이스 공유 링크 생성
  generateShareLink(workspaceId) {
    return `${window.location.origin}/workspace/${workspaceId}`
  }

  // 워크스페이스의 실제 아이템/카테고리 개수 계산 (Firestore 전용)
  async getWorkspaceCounts(workspaceId) {
    try {
      const qaQuery = query(collection(db, 'qaItems'), where('workspaceId', '==', workspaceId))
      const qaSnapshot = await getDocs(qaQuery)
      const itemCount = qaSnapshot.size

      const categoryQuery = query(collection(db, 'categories'), where('workspaceId', '==', workspaceId))
      const categorySnapshot = await getDocs(categoryQuery)
      const categoryCount = categorySnapshot.size

      return [itemCount, categoryCount]
    } catch (error) {
      console.error('워크스페이스 개수 계산 오류:', error)
      return [0, 0]
    }
  }
}

export default new WorkspaceService()
