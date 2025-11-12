"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import TeacherManagement from "@/components/teacher-management"
import ExamBuilder from "@/components/exam-builder"
import Leaderboard from "@/components/leaderboard"
import PendingStudentApprovals from "@/components/pending-student-approvals"
import UserManagement from "@/components/user-management"
import { Menu, X, LogOut, BookOpen, Users, Trophy, BarChart3, ShieldCheck } from "lucide-react"
import { logoutTeacher } from "@/lib/firebase-helpers"

interface AdminDashboardProps {
  session: { email: string; teacherName: string; uid: string }
  onLogout: () => void
}

export default function AdminDashboard({ session, onLogout }: AdminDashboardProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("exams")
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

  const menuItems = [
    { id: "exams", label: "Exams", icon: BookOpen },
    { id: "approvals", label: "Approvals", icon: ShieldCheck },
    { id: "users", label: "User Management", icon: Users },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "teachers", label: "Teachers", icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg md:hidden sticky top-0 z-50">
        <div className="px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <h1 className="text-lg font-bold">Competitive Arena</h1>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`bg-gradient-to-b from-blue-700 to-blue-600 text-white w-full md:w-64 md:min-h-screen ${
          mobileMenuOpen ? "block" : "hidden md:block"
        } md:sticky md:top-0`}
      >
        <div className="p-6 border-b border-blue-500 hidden md:block">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📚</span>
            <div>
              <h2 className="font-bold text-lg">Competitive Arena</h2>
              <p className="text-sm text-blue-100">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setMobileMenuOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id ? "bg-white text-blue-600" : "text-blue-100 hover:bg-blue-500"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-500 md:relative md:mt-auto">
          <div className="bg-blue-500 rounded-lg p-4 mb-4 hidden md:block">
            <p className="text-sm text-blue-100 mb-2">Logged in as:</p>
            <p className="font-medium text-white break-words">{session.teacherName}</p>
            <p className="text-xs text-blue-100 mt-1 break-words">{session.email}</p>
          </div>
          <Button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            disabled={loggingOut}
          >
            <LogOut size={16} className="mr-2" />
            {loggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header - Desktop Only */}
          <div className="hidden md:flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage exams, students, and teachers</p>
            </div>
          </div>

          {/* Content */}
          {activeTab === "exams" && <ExamBuilder teacherId={session.uid} />}
          {activeTab === "approvals" && <PendingStudentApprovals />}
          {activeTab === "users" && <UserManagement />}
          {activeTab === "leaderboard" && <Leaderboard teacherId={session.uid} />}
          {activeTab === "teachers" && <TeacherManagement teacherId={session.uid} />}
        </div>
      </main>
    </div>
  )
}
