"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getExamByCode } from "@/lib/firebase-helpers"

interface StudentLandingPageProps {
  onStudentAccess: (name: string, rollNo: string, examCode: string, examId: string, teacherId: string) => void
  onBack: () => void
}

export default function StudentLandingPage({ onStudentAccess, onBack }: StudentLandingPageProps) {
  const [name, setName] = useState("")
  const [rollNo, setRollNo] = useState("")
  const [examCode, setExamCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!name || !rollNo || !examCode) {
      setError("Please fill all fields")
      setLoading(false)
      return
    }

    try {
      const exam = await getExamByCode(examCode)
      if (!exam) {
        setError("Invalid exam code")
        setLoading(false)
        return
      }

      onStudentAccess(name, rollNo, examCode, exam.id, exam.teacherId)
    } catch (err) {
      setError("Failed to access exam. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-t-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold text-lg">📚</span>
            </div>
            <div>
              <CardTitle className="text-white">RISE  COACHING</CardTitle>
              <CardDescription className="text-orange-100">Student Exam Access</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleStudentLogin} className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
              <Input
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
              <Input
                placeholder="Enter your roll number"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="w-full"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Code</label>
              <Input
                placeholder="Enter exam code (provided by teacher)"
                value={examCode}
                onChange={(e) => setExamCode(e.target.value.toUpperCase())}
                className="w-full"
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white" disabled={loading}>
              {loading ? "Verifying..." : "Start Exam"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="w-full bg-transparent"
              disabled={loading}
            >
              Back to Home
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
