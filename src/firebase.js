import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyA3pLxu1PgFJep2fycfKfk_j6HybK0i810",
  authDomain: "workorganizer.firebaseapp.com",
  projectId: "workorganizer",
  storageBucket: "workorganizer.firebasestorage.app",
  messagingSenderId: "517581506153",
  appId: "1:517581506153:web:b3fdcff398744a4f9f84f8",
  databaseURL: "https://workorganizer-default-rtdb.asia-southeast1.firebasedatabase.app",
  measurementId: "G-KYFEH845KB"
}

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig)

// Firebase 서비스 내보내기
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app
