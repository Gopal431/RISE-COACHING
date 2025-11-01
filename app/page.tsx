"use client"

import { useState, useEffect } from "react"
import { checkFirebaseAuthConfigured } from "@/lib/firebase-helpers"
import AdminLoginPage from "@/components/admin-login-page"
import AdminDashboard from "@/components/admin-dashboard"
import MainLandingPage from "@/components/main-landing-page"
import StudentLandingPage from "@/components/student-landing-page"
import StudentExamPage from "@/components/student-exam-page"
import ResultsPage from "@/components/results-page"
import FirebaseSetupRequired from "@/components/firebase-setup-required"

type AdminSession = {
  email: string
  teacherName: string
  uid: string
}

type StudentSession = {
  name: string
  rollNo: string
  examCode: string
  examId: string
  teacherId: string
}

type ExamState = "complete" | "taking"

export default function Home() {
  const [userType, setUserType] = useState<"admin" | "student" | "none">("none")
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null)
  const [studentSession, setStudentSession] = useState<StudentSession | null>(null)
  const [examState, setExamState] = useState<ExamState | null>(null)
  const [studentResults, setStudentResults] = useState<any>(null)
  const [currentScreen, setCurrentScreen] = useState<"main" | "admin-login" | "student-landing" | "exam" | "results">(
    "main",
  )
  const [loading, setLoading] = useState(true)
  const [firebaseConfigured, setFirebaseConfigured] = useState(true)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        if (!checkFirebaseAuthConfigured()) {
          setFirebaseConfigured(false)
          setLoading(false)
          return
        }
        setLoading(false)
      } catch (error) {
        console.error("[v0] Error initializing app:", error)
        setLoading(false)
      }
    }

    initializeApp()
  }, [])

  const handleAdminLogin = (email: string, teacherName: string, uid: string) => {
    const session = { email, teacherName, uid }
    setAdminSession(session)
    setUserType("admin")
    setCurrentScreen("admin")
  }

  const handleAdminLogout = async () => {
    setAdminSession(null)
    setUserType("none")
    setCurrentScreen("main")
  }

  const handleStudentExamAccess = (
    name: string,
    rollNo: string,
    examCode: string,
    examId: string,
    teacherId: string,
  ) => {
    setStudentSession({ name, rollNo, examCode, examId, teacherId })
    setUserType("student")
    setExamState("taking")
    setCurrentScreen("exam")
  }

  const handleExamSubmit = (results: any) => {
    setStudentResults(results)
    setExamState("complete")
    setCurrentScreen("results")
  }

  const handleStudentReset = () => {
    setStudentSession(null)
    setExamState(null)
    setStudentResults(null)
    setUserType("none")
    setCurrentScreen("main")
  }

  if (!firebaseConfigured) {
    return <FirebaseSetupRequired />
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      {currentScreen === "main" && (
        <MainLandingPage
          onStudentClick={() => setCurrentScreen("student-landing")}
          onTeacherClick={() => setCurrentScreen("admin-login")}
        />
      )}

      {currentScreen === "student-landing" && (
        <StudentLandingPage onStudentAccess={handleStudentExamAccess} onBack={() => setCurrentScreen("main")} />
      )}

      {currentScreen === "admin-login" && (
        <AdminLoginPage onLogin={handleAdminLogin} onBack={() => setCurrentScreen("main")} />
      )}

      {userType === "admin" && adminSession && currentScreen === "admin" && (
        <AdminDashboard session={adminSession} onLogout={handleAdminLogout} />
      )}

      {currentScreen === "exam" && userType === "student" && studentSession && (
        <StudentExamPage student={studentSession} onSubmit={handleExamSubmit} onLogout={handleStudentReset} />
      )}

      {currentScreen === "results" && userType === "student" && studentResults && (
        <ResultsPage results={studentResults} onRetry={handleStudentReset} />
      )}
    </main>
  )
}
