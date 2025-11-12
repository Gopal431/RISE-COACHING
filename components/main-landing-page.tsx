"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogIn } from "lucide-react"

interface MainLandingPageProps {
  onStudentClick: () => void
  onTeacherClick: () => void
}

export default function MainLandingPage({ onStudentClick, onTeacherClick }: MainLandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-blue-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">📚</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Competitive Arena</h1>
              <p className="text-xs text-gray-500">Online Exam Platform</p>
            </div>
          </div>
          <Button onClick={onTeacherClick} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
            <LogIn size={18} />
            <span className="hidden sm:inline">Teacher Login</span>
            <span className="sm:hidden">Login</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Welcome toRISE COACHING</h2>
            <p className="text-lg text-gray-600 mb-2">Prepare for your dream exam</p>
            <p className="text-sm text-gray-500">STRIVE FOR EXCELLENCE</p>
          </div>

          {/* Student Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Login Card */}
            <Card
              className="border-2 hover:border-orange-500 hover:shadow-lg transition-all cursor-pointer"
              onClick={onStudentClick}
            >
              <CardHeader className="bg-gradient-to-br from-orange-600 to-orange-500 text-white rounded-t-lg">
                <CardTitle className="text-white text-xl">Student Login</CardTitle>
                <CardDescription className="text-orange-100">Access your exams</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="text-5xl text-center">👤</div>
                  <p className="text-gray-600 text-sm text-center">
                    Login with your approved account to take exams and view your results.
                  </p>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">Student Login</Button>
                </div>
              </CardContent>
            </Card>

            {/* Signup Card */}
            <Card
              className="border-2 hover:border-green-500 hover:shadow-lg transition-all cursor-pointer"
              onClick={onStudentClick}
            >
              <CardHeader className="bg-gradient-to-br from-green-600 to-green-500 text-white rounded-t-lg">
                <CardTitle className="text-white text-xl">New Student</CardTitle>
                <CardDescription className="text-green-100">Register here</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="text-5xl text-center">✍️</div>
                  <p className="text-gray-600 text-sm text-center">
                    Create a new account. Submit for approval and start taking exams.
                  </p>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Sign Up</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Box */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm">
            <p className="text-gray-600 text-sm">
              Are you a teacher? Use the <strong>Teacher Login</strong> button above to manage exams and view student
              performance.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
