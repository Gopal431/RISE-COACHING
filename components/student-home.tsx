"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, User, BookOpen } from "lucide-react"
import StudentProfile from "./student-profile"
import { getStudentProfile, logoutTeacher } from "@/lib/firebase-helpers"

interface StudentHomeProps {
  studentId: string
  studentEmail: string
  onLogout: () => void
  onTakeExam: () => void
  onShowAdminLogin: () => void
}

export default function StudentHome({
  studentId,
  studentEmail,
  onLogout,
  onTakeExam,
  onShowAdminLogin,
}: StudentHomeProps) {
  const [showProfile, setShowProfile] = useState(false)
  const [studentProfile, setStudentProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getStudentProfile(studentId)
        setStudentProfile(profile)
      } catch (err) {
        console.error("Error loading profile:", err)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [studentId])

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logoutTeacher()
      onLogout()
    } catch (err) {
      console.error("Logout error:", err)
      onLogout()
    }
  }

  if (showProfile) {
    return <StudentProfile studentId={studentId} onBack={() => setShowProfile(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <header className="bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <div>
              <h1 className="text-xl font-bold">Competitive Arena</h1>
              <p className="text-sm text-orange-100">Welcome, {studentProfile?.fullName}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onShowAdminLogin}
              variant="outline"
              className="text-xs md:text-sm bg-white text-orange-600 hover:bg-orange-50"
            >
              Admin Login
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-xs md:text-sm bg-white text-orange-600 hover:bg-orange-50"
              disabled={loggingOut}
            >
              <LogOut size={16} className="mr-1" />
              {loggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-t-lg">
              <CardTitle className="text-white">My Profile</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="text-center">
                {studentProfile?.profileImage ? (
                  <img
                    src={studentProfile.profileImage || "/placeholder.svg"}
                    alt="Profile"
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center">
                    <User size={48} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Name:</strong> {studentProfile?.fullName}
                </p>
                <p className="text-sm">
                  <strong>Email:</strong> {studentEmail}
                </p>
                <p className="text-sm">
                  <strong>Phone:</strong> {studentProfile?.phoneNumber}
                </p>
                <p className="text-sm">
                  <strong>Address:</strong> {studentProfile?.address || "Not set"}
                </p>
              </div>
              <Button onClick={() => setShowProfile(true)} className="w-full bg-orange-600 hover:bg-orange-700">
                <User size={16} className="mr-2" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Main Actions */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-lg">
                <CardTitle className="text-white">Take Exam</CardTitle>
                <CardDescription className="text-blue-100">Enter exam code to start a new examination</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Button onClick={onTakeExam} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <BookOpen size={18} className="mr-2" />
                  Start New Exam
                </Button>
              </CardContent>
            </Card>

            {/* Exam Preparation Info */}
            {studentProfile?.examPreparation && (
              <Card>
                <CardHeader>
                  <CardTitle>Exam Preparation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {studentProfile.examPreparation.map((exam: string) => (
                      <span key={exam} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                        {exam}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
