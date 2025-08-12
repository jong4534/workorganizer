import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth'
import { auth } from '../firebase.js'

class AuthService {
  constructor() {
    this.user = null
    this.isAuthenticated = false
    
    // Firebase 인증 상태 변화 감지
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // 실제 Firebase 사용자가 로그인된 상태
        this.user = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }
        this.isAuthenticated = true
        console.log('🔄 Firebase 인증 상태 복원:', this.user)
      } else {
        // 로그아웃된 상태
        this.user = null
        this.isAuthenticated = false
        console.log('🔄 Firebase 인증 상태: 로그아웃됨')
      }
    })
  }

  // 구글 로그인 (실제 Firebase 우선, 실패 시 데모 모드)
  async signInWithGoogle() {
    try {
      console.log('Google 로그인 시도 시작...')
      
      const provider = new GoogleAuthProvider()
      provider.addScope('email')
      provider.addScope('profile')
      
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }

      this.user = userData
      this.isAuthenticated = true
      
      console.log('✅ 실제 Google 로그인 성공:', userData)
      return userData
      
    } catch (firebaseError) {
      // Firebase 로그인 실패 시에만 데모 계정으로 대체
      console.warn('❌ Firebase 로그인 실패, 데모 모드로 전환:', firebaseError.message)
      console.warn('오류 코드:', firebaseError.code)
      
      const demoUser = {
        uid: 'demo-user-' + Date.now(),
        email: 'demo@example.com',
        displayName: '데모 사용자 (실제 로그인 실패)',
        photoURL: null
      }

      this.user = demoUser
      this.isAuthenticated = true
      
      console.log('⚠️ 데모 로그인으로 대체:', demoUser)
      return demoUser
    }
  }

  // 로그아웃 (실제 Firebase)
  async signOut() {
    try {
      await firebaseSignOut(auth)
      this.user = null
      this.isAuthenticated = false
      console.log('로그아웃 성공')
    } catch (error) {
      console.error('로그아웃 오류:', error)
      throw error
    }
  }

  // 인증 상태 감시 (실제 Firebase)
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }
        this.isAuthenticated = true
      } else {
        this.user = null
        this.isAuthenticated = false
      }
      callback(user)
    })
  }

  // 현재 사용자 정보 (Firebase 우선)
  getCurrentUser() {
    // Firebase 인증 상태를 우선 확인
    const firebaseUser = auth.currentUser
    if (firebaseUser) {
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL
      }
    }
    
    // Firebase 사용자가 없으면 내부 상태 반환
    return this.user
  }

  // 로그인 상태 확인 (Firebase 우선)
  isLoggedIn() {
    return !!auth.currentUser || this.isAuthenticated
  }
}

export default new AuthService()
