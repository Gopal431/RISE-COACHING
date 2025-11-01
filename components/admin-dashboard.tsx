"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TeacherManagement from "@/components/teacher-management"
import ExamBuilder from "@/components/exam-builder"
import Leaderboard from "@/components/leaderboard"
import { Menu, X, LogOut } from "lucide-react"
import { logoutTeacher } from "@/lib/firebase-helpers"

interface AdminDashboardProps {
  session: { email: string; teacherName: string; uid: string }
  onLogout: () => void
}

export default function AdminDashboard({ session, onLogout }: AdminDashboardProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <div>
              <h1 className="text-xl font-bold">RISE  COACHING</h1>
              <p className="text-sm text-blue-100">Welcome, {session.teacherName}</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm text-blue-100">{session.email}</span>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-white text-blue-600 hover:bg-blue-50"
              disabled={loggingOut}
            >
              <LogOut size={16} className="mr-2" />
              {loggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-blue-400 bg-blue-500">
            <div className="px-4 py-3 space-y-2">
              <p className="text-sm text-blue-100">{session.email}</p>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full bg-white text-blue-600"
                disabled={loggingOut}
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="exams" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 md:grid-cols-3 gap-2">
            <TabsTrigger value="exams" className="text-xs md:text-sm">
              Exams
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="text-xs md:text-sm">
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="teachers" className="text-xs md:text-sm">
              Teachers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="exams" className="space-y-4">
            <ExamBuilder teacherId={session.uid} />
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            <Leaderboard teacherId={session.uid} />
          </TabsContent>

          <TabsContent value="teachers" className="space-y-4">
            <TeacherManagement teacherId={session.uid} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
