import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getAuth, type Auth } from "firebase/auth"
import { getAnalytics, type Analytics, isSupported } from "firebase/analytics"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCVglTaeq_BgCCbWp47jNZffq6y0GuphdM",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "foodreciepe-7a6ba.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "foodreciepe-7a6ba",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "foodreciepe-7a6ba.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1070340958580",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1070340958580:web:8d9db238516ffacd84a421",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-FMT46Z657E",
}

let app: FirebaseApp | undefined
let db: Firestore | undefined
let auth: Auth | undefined
let analytics: Analytics | undefined

if (typeof window !== "undefined") {
  // Initialize Firebase only on client side
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }
  db = getFirestore(app)
  auth = getAuth(app)
  
  // Initialize Analytics if supported
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app)
    }
  })
}

export { app, db, auth, analytics }

