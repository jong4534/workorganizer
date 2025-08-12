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
import authService from './authService.js'

class WorkspaceService {
  constructor() {
    // 데모용 워크스페이스 데이터 (localStorage에서 로드)
    this.demoWorkspaces = this.loadDemoWorkspacesFromStorage()
  }

  // localStorage에서 데모 워크스페이스 로드
  loadDemoWorkspacesFromStorage() {
    try {
      const stored = localStorage.getItem('demo-workspaces')
      if (stored) {
        const workspaces = JSON.parse(stored)
        // Date 객체로 변환
        return workspaces.map(ws => ({
          ...ws,
          createdAt: new Date(ws.createdAt),
          updatedAt: new Date(ws.updatedAt)
        }))
      }
    } catch (error) {
      console.error('localStorage에서 데모 워크스페이스 로드 실패:', error)
    }
    
    // 기본 샘플 데이터 반환
    return [
      {
        id: 'demo-workspace-1',
        name: '프론트엔드 프로젝트',
        description: 'Vue.js와 React 프로젝트 정리',
        isPublic: false,
        userId: 'demo-user-123',
        itemCount: 15,
        categoryCount: 4,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: 'demo-workspace-2',
        name: '백엔드 개발',
        description: 'Node.js와 Firebase 학습 내용',
        isPublic: true,
        userId: 'demo-user-123',
        itemCount: 8,
        categoryCount: 2,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-18')
      }
    ]
  }

  // localStorage에 데모 워크스페이스 저장
  saveDemoWorkspacesToStorage() {
    try {
      localStorage.setItem('demo-workspaces', JSON.stringify(this.demoWorkspaces))
      console.log('데모 워크스페이스를 localStorage에 저장:', this.demoWorkspaces.length, '개')
    } catch (error) {
      console.error('localStorage에 데모 워크스페이스 저장 실패:', error)
    }
  }
  
  // 사용자의 워크스페이스 목록 가져오기 (Firestore + 데모 모드)
  async getUserWorkspaces(userId) {
    try {
      // 데모 사용자인지 확인
      const isDemoUser = userId.startsWith('demo-user')
      
      if (isDemoUser) {
        // 데모 모드: 로컬 배열에서 해당 사용자의 워크스페이스 반환
        console.log('데모 모드에서 워크스페이스 목록 조회:', userId)
        console.log('전체 데모 워크스페이스:', this.demoWorkspaces)
        console.log('데모 워크스페이스 개수:', this.demoWorkspaces.length)
        
        const userWorkspaces = this.demoWorkspaces.filter(ws => {
          console.log('워크스페이스 체크:', ws.id, 'userId:', ws.userId, '대상 userId:', userId, '일치여부:', ws.userId === userId)
          return ws.userId === userId
        })
        
        console.log('필터링된 사용자 워크스페이스:', userWorkspaces)
        console.log('사용자 워크스페이스 개수:', userWorkspaces.length)
        
        return userWorkspaces.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      } else {
        // 실제 Firestore 모드
        const q = query(
          collection(db, 'workspaces'),
          where('userId', '==', userId),
          orderBy('updatedAt', 'desc')
        )
        
        const snapshot = await getDocs(q)
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        }))
      }
    } catch (error) {
      console.error('워크스페이스 목록 조회 오류:', error)
      
      // Firestore 오류 시 데모 모드로 대체
      console.log('Firestore 실패, 데모 모드로 전환하여 워크스페이스 목록 반환')
      const userWorkspaces = this.demoWorkspaces.filter(ws => ws.userId === userId)
      return userWorkspaces.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    }
  }

  // 공개 워크스페이스 가져오기 (링크로 접근)
  async getPublicWorkspace(workspaceId) {
    try {
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
    } catch (error) {
      console.error('공개 워크스페이스 조회 오류:', error)
      return null
    }
  }

  // 새 워크스페이스 생성 (Firestore + 데모 모드)
  async createWorkspace(userId, workspaceData) {
    try {
      // 데모 사용자인지 확인
      const isDemoUser = userId.startsWith('demo-user')
      
      if (isDemoUser) {
        // 데모 모드: 로컬 배열에 추가
        console.log('데모 모드에서 워크스페이스 생성:', workspaceData)
        
        const newWorkspace = {
          id: 'demo-workspace-' + Date.now(),
          ...workspaceData,
          userId,
          itemCount: 0,
          categoryCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          isPublic: workspaceData.isPublic || false
        }
        
                      this.demoWorkspaces.push(newWorkspace)
              
              // localStorage에 저장
              this.saveDemoWorkspacesToStorage()
              
              console.log('데모 워크스페이스 생성 완료:', newWorkspace.id)
              console.log('현재 데모 워크스페이스 목록:', this.demoWorkspaces.length, '개')
              
              return newWorkspace.id
      } else {
        // 실제 Firestore 모드
        const docRef = await addDoc(collection(db, 'workspaces'), {
          ...workspaceData,
          userId,
          itemCount: 0,
          categoryCount: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          isPublic: workspaceData.isPublic || false
        })

        console.log('Firestore 워크스페이스 생성됨:', docRef.id)
        return docRef.id
      }
    } catch (error) {
      console.error('워크스페이스 생성 오류:', error)
      
      // Firestore 오류 시 데모 모드로 대체
      console.log('Firestore 실패, 데모 모드로 전환')
      const newWorkspace = {
        id: 'demo-workspace-' + Date.now(),
        ...workspaceData,
        userId,
        itemCount: 0,
        categoryCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: workspaceData.isPublic || false
      }
      
                  this.demoWorkspaces.push(newWorkspace)
            
            // localStorage에 저장
            this.saveDemoWorkspacesToStorage()
            
            console.log('데모 모드 대체 생성 완료:', newWorkspace.id)
            
            return newWorkspace.id
    }
  }

  // 워크스페이스 업데이트 (Firestore + 데모 모드)
  async updateWorkspace(workspaceId, updates) {
    try {
      console.log('워크스페이스 업데이트 시도:', workspaceId, updates)
      
      // 현재 사용자 확인
      const currentUser = authService.getCurrentUser()
      const isDemoUser = currentUser?.uid?.startsWith('demo-user')
      
      if (isDemoUser) {
        // 데모 모드: localStorage 업데이트
        console.log('데모 모드에서 워크스페이스 업데이트')
        const index = this.demoWorkspaces.findIndex(ws => ws.id === workspaceId)
        if (index > -1) {
          this.demoWorkspaces[index] = {
            ...this.demoWorkspaces[index],
            ...updates,
            updatedAt: new Date()
          }
          this.saveDemoWorkspacesToStorage()
          console.log('데모 워크스페이스 업데이트 완료')
        }
      } else {
        // 실제 Firestore 업데이트
        console.log('Firestore에서 워크스페이스 업데이트 시작')
        const docRef = doc(db, 'workspaces', workspaceId)
        await updateDoc(docRef, {
          ...updates,
          updatedAt: serverTimestamp()
        })
        console.log('✅ Firestore 워크스페이스 업데이트 완료')
      }
    } catch (error) {
      console.error('워크스페이스 업데이트 오류:', error)
      
      // Firestore 실패 시 데모 모드로 대체
      console.log('Firestore 실패, 데모 모드로 대체 업데이트')
      const index = this.demoWorkspaces.findIndex(ws => ws.id === workspaceId)
      if (index > -1) {
        this.demoWorkspaces[index] = {
          ...this.demoWorkspaces[index],
          ...updates,
          updatedAt: new Date()
        }
        this.saveDemoWorkspacesToStorage()
      }
      throw error
    }
  }

  // 워크스페이스 삭제 (Firestore + 데모 모드)
  async deleteWorkspace(workspaceId) {
    try {
      console.log('워크스페이스 삭제 시도:', workspaceId)
      
      // 현재 사용자 확인
      const currentUser = authService.getCurrentUser()
      const isDemoUser = currentUser?.uid?.startsWith('demo-user')
      
      if (isDemoUser) {
        // 데모 모드: localStorage에서 삭제
        console.log('데모 모드에서 워크스페이스 삭제')
        const index = this.demoWorkspaces.findIndex(ws => ws.id === workspaceId)
        if (index > -1) {
          this.demoWorkspaces.splice(index, 1)
          this.saveDemoWorkspacesToStorage()
          console.log('데모 워크스페이스 삭제 완료')
        }
      } else {
        // 실제 Firestore 삭제
        console.log('Firestore에서 워크스페이스 삭제 시작')
        await deleteDoc(doc(db, 'workspaces', workspaceId))
        console.log('✅ Firestore 워크스페이스 삭제 완료')
      }
    } catch (error) {
      console.error('워크스페이스 삭제 오류:', error)
      
      // Firestore 실패 시 데모 모드로 대체
      console.log('Firestore 실패, 데모 모드로 대체 삭제')
      const index = this.demoWorkspaces.findIndex(ws => ws.id === workspaceId)
      if (index > -1) {
        this.demoWorkspaces.splice(index, 1)
        this.saveDemoWorkspacesToStorage()
      }
      throw error
    }
  }

  // 워크스페이스 공개 상태 토글
  async toggleWorkspaceVisibility(workspaceId, isPublic) {
    try {
      const docRef = doc(db, 'workspaces', workspaceId)
      await updateDoc(docRef, {
        isPublic: isPublic,
        updatedAt: serverTimestamp()
      })

      console.log(`워크스페이스 ${isPublic ? '공개' : '비공개'}로 변경됨:`, workspaceId)
    } catch (error) {
      console.error('워크스페이스 공개 상태 변경 오류:', error)
      throw error
    }
  }

  // 워크스페이스 공유 링크 생성
  generateShareLink(workspaceId) {
    return `${window.location.origin}/workspace/${workspaceId}`
  }

  // 워크스페이스의 실제 아이템/카테고리 개수 계산
  async getWorkspaceCounts(workspaceId) {
    try {
      console.log('워크스페이스 개수 계산 시작:', workspaceId)
      
      // 현재 사용자 확인
      const currentUser = authService.getCurrentUser()
      const isDemoUser = currentUser?.uid?.startsWith('demo-user')
      
      if (isDemoUser) {
        // 데모 모드: localStorage에서 계산
        console.log('데모 모드에서 개수 계산')
        
        // 데모 데이터에서 카운트 (실제로는 localStorage나 고정값 사용)
        const demoItemCount = Math.floor(Math.random() * 20) + 1 // 1-20개 랜덤
        const demoCategoryCount = Math.floor(Math.random() * 5) + 1 // 1-5개 랜덤
        
        console.log(`데모 워크스페이스 ${workspaceId} - 아이템: ${demoItemCount}, 카테고리: ${demoCategoryCount}`)
        return [demoItemCount, demoCategoryCount]
      } else {
        // 실제 Firestore에서 계산
        console.log('Firestore에서 실제 개수 계산')
        
        // Q&A 아이템 개수 계산
        const qaQuery = query(
          collection(db, 'qaItems'), 
          where('workspaceId', '==', workspaceId)
        )
        const qaSnapshot = await getDocs(qaQuery)
        const itemCount = qaSnapshot.size
        
        // 카테고리 개수 계산
        const categoryQuery = query(
          collection(db, 'categories'), 
          where('workspaceId', '==', workspaceId)
        )
        const categorySnapshot = await getDocs(categoryQuery)
        const categoryCount = categorySnapshot.size
        
        console.log(`워크스페이스 ${workspaceId} - 아이템: ${itemCount}, 카테고리: ${categoryCount}`)
        return [itemCount, categoryCount]
      }
    } catch (error) {
      console.error('워크스페이스 개수 계산 오류:', error)
      
      // 오류 발생 시 기본값 반환
      console.log('오류 발생으로 기본값 반환: [0, 0]')
      return [0, 0]
    }
  }
}

export default new WorkspaceService()
