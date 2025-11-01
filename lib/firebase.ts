import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBp--7Pg9CO4VgA5Odp3bNn001mqsaPnak",
  authDomain: "cbt-project-1997b.firebaseapp.com",
  projectId: "cbt-project-1997b",
  storageBucket: "cbt-project-1997b.firebasestorage.app",
  messagingSenderId: "908548862869",
  appId: "1:908548862869:web:a871273ef0d689a6dabc9c",
  measurementId: "G-H7DT4WED12",
}

let app
let auth
let db

try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
} catch (error) {
  console.error("[v0] Firebase initialization error:", error)
}

export { auth, db, app }
