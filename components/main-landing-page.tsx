"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface MainLandingPageProps {
  onStudentClick: () => void
  onTeacherClick: () => void
}

export default function MainLandingPage({ onStudentClick, onTeacherClick }: MainLandingPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">📚</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">RISE  COACHING</h1>
          <p className="text-xl text-gray-600">Online Examination Platform</p>
          <p className="text-sm text-gray-500 mt-2">STRIVE FOR EXCELLENCE</p>
        </div>

        {/* Choice Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Student Card */}
          <Card
            className="border-2 hover:border-orange-500 hover:shadow-lg transition-all cursor-pointer"
            onClick={onStudentClick}
          >
            <CardHeader className="bg-gradient-to-br from-orange-600 to-orange-500 text-white rounded-t-lg">
              <CardTitle className="text-white text-xl">Student Login</CardTitle>
              <CardDescription className="text-orange-100">Take an exam using exam code</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="text-5xl text-center mb-4">👤</div>
                <p className="text-gray-600 text-sm">
                  Enter your name, roll number, and exam code to start your examination.
                </p>
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white" onClick={onStudentClick}>
                  Start Exam
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Teacher Card */}
          <Card
            className="border-2 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer"
            onClick={onTeacherClick}
          >
            <CardHeader className="bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-t-lg">
              <CardTitle className="text-white text-xl">Teacher Login</CardTitle>
              <CardDescription className="text-blue-100">Create and manage exams</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="text-5xl text-center mb-4">👨‍🏫</div>
                <p className="text-gray-600 text-sm">
                  Login to your admin panel to create exams, manage questions, and view student rankings.
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={onTeacherClick}>
                  Teacher Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Info */}
        {/* <div className="mt-12 text-center p-6 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm mb-3">
            For the first time, use the demo credentials to access the teacher panel:
          </p>
          <div className="inline-block text-left">
            <p className="text-sm text-gray-700">
              <strong>Email:</strong> demo@example.com
            </p>
            <p className="text-sm text-gray-700">
              <strong>Password:</strong> demo123
            </p>
          </div>
        </div> */}
      </div>
    </div>
  )
}
