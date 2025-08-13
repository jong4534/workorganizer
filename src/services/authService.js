import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth'
import { auth } from '../firebase'

class AuthService {
  constructor() {
    this.user = null
    this.isAuthenticated = false
    this._initialized = false
    this._initPromise = new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          if (user.email === 'demo@example.com') {
            console.log('🚫 데모 사용자 감지, 강제 로그아웃')
            this.forceLogout()
            this._initialized = true
            resolve(true)
            return
          }
          this.user = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          }
          this.isAuthenticated = true
          console.log('🔄 Firebase 인증 상태 복원:', this.user)
        } else {
          this.user = null
          this.isAuthenticated = false
          console.log('🔄 Firebase 인증 상태: 로그아웃됨')
        }
        this._initialized = true
        resolve(true)
      })
    })
  }

  async waitForInit() {
    if (this._initialized) return true
    return this._initPromise
  }

  async forceLogout() {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.warn('강제 로그아웃 실패:', error.message)
    }
    this.user = null
    this.isAuthenticated = false
    console.log('강제 로그아웃 완료')
  }

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      if (result.user.email === 'demo@example.com') {
        console.log('🚫 데모 사용자 로그인 시도 차단')
        await this.forceLogout()
        throw new Error('데모 사용자는 로그인할 수 없습니다.')
      }
      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL
      }
      this.user = userData
      this.isAuthenticated = true
      console.log('✅ Google 로그인 성공:', userData)
      return userData
    } catch (error) {
      console.error('❌ Google 로그인 실패:', error.message)
      throw error
    }
  }

  async signOut() {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.warn('Firebase 로그아웃 실패:', error.message)
    }
    this.user = null
    this.isAuthenticated = false
    console.log('로그아웃 완료')
  }

  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'demo@example.com') {
        console.log('🚫 데모 사용자 감지, 강제 로그아웃')
        this.forceLogout()
        callback(null)
        return
      }
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
      callback(this.user)
    })
  }

  getCurrentUser() {
    return this.user
  }

  isLoggedIn() {
    const currentUser = auth.currentUser
    if (currentUser && currentUser.email === 'demo@example.com') {
      console.log('🚫 데모 사용자 로그인 상태 차단')
      return false
    }
    return !!currentUser
  }
}

export default new AuthService()
