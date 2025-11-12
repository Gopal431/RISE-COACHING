"use client"

import { useState, useEffect } from "react"
import { checkFirebaseAuthConfigured } from "@/lib/firebase-helpers"
import AdminLoginPage from "@/components/admin-login-page"
import AdminDashboard from "@/components/admin-dashboard"
import MainLandingPage from "@/components/main-landing-page"
import StudentLandingPage from "@/components/student-landing-page"
import StudentSignupPage from "@/components/student-signup-page"
import StudentExamPage from "@/components/student-exam-page"
import StudentHome from "@/components/student-home"
import ResultsPage from "@/components/results-page"
import FirebaseSetupRequired from "@/components/firebase-setup-required"

type AdminSession = {
  email: string
  teacherName: string
  uid: string
}

type ExamState = "complete" | "taking"

export default function Home() {
  const [userType, setUserType] = useState<"admin" | "student" | "none">("none")
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null)
  const [studentSession, setStudentSession] = useState<any>(null)
  const [examState, setExamState] = useState<ExamState | null>(null)
  const [studentResults, setStudentResults] = useState<any>(null)
  const [currentScreen, setCurrentScreen] = useState<string>("main")
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

  const handleStudentSignupSuccess = () => {
    alert("Your profile has been submitted for admin approval. Please wait for approval before login.")
    setCurrentScreen("student-landing")
  }

  const handleStudentLogin = (studentId: string, studentEmail: string) => {
    setStudentSession({ id: studentId, email: studentEmail })
    setUserType("student")
    setCurrentScreen("student-home")
  }

  const handleStudentExamAccess = (examCode: string, examId: string, teacherId: string) => {
    setStudentSession((prev: any) => ({
      ...prev,
      examCode,
      examId,
      teacherId,
    }))
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
        <StudentLandingPage
          onStudentSignup={() => setCurrentScreen("student-signup")}
          onStudentLogin={handleStudentLogin}
          onBack={() => setCurrentScreen("main")}
          onAdminClick={() => setCurrentScreen("admin-login")}
        />
      )}

      {currentScreen === "student-signup" && (
        <StudentSignupPage onSignupSuccess={handleStudentSignupSuccess} onBack={() => setCurrentScreen("main")} />
      )}

      {currentScreen === "admin-login" && (
        <AdminLoginPage onLogin={handleAdminLogin} onBack={() => setCurrentScreen("main")} />
      )}

      {userType === "admin" && adminSession && currentScreen === "admin" && (
        <AdminDashboard session={adminSession} onLogout={handleAdminLogout} />
      )}

      {currentScreen === "student-home" && studentSession && (
        <StudentHome
          studentId={studentSession.id}
          studentEmail={studentSession.email}
          onLogout={handleStudentReset}
          onTakeExam={() => setCurrentScreen("exam-access")}
          onShowAdminLogin={() => setCurrentScreen("admin-login")}
        />
      )}

      {currentScreen === "exam" && studentSession && (
        <StudentExamPage student={studentSession} onSubmit={handleExamSubmit} onLogout={handleStudentReset} />
      )}

      {currentScreen === "results" && studentResults && (
        <ResultsPage results={studentResults} onRetry={handleStudentReset} />
      )}
    </main>
  )
}
