"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { registerStudentWithSignup } from "@/lib/firebase-helpers"
import { AlertCircle, CheckCircle } from "lucide-react"

interface StudentSignupPageProps {
  onSignupSuccess: () => void
  onBack: () => void
}

const EXAM_OPTIONS = ["WB Police", "SSC", "Railway", "WBSCS", "GATE", "CAT", "UPSC", "Banking", "Other"]

export default function StudentSignupPage({ onSignupSuccess, onBack }: StudentSignupPageProps) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [selectedExams, setSelectedExams] = useState<string[]>([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const toggleExam = (exam: string) => {
    setSelectedExams((prev) => (prev.includes(exam) ? prev.filter((e) => e !== exam) : [...prev, exam]))
  }

  const validateForm = () => {
    if (!fullName.trim()) return "Full name is required"
    if (!email.trim()) return "Email is required"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Valid email is required"
    if (selectedExams.length === 0) return "Select at least one exam preparation"
    return ""
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    try {
      await registerStudentWithSignup(fullName, "", email, selectedExams)
      setSuccess("Signup successful! Please wait for admin approval to login.")
      setTimeout(() => onSignupSuccess(), 2000)
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-orange-50 to-blue-50">
      <Card className="w-full max-w-md">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-t-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold text-lg">📝</span>
            </div>
            <div>
              <CardTitle className="text-white">Student Registration</CardTitle>
              <CardDescription className="text-orange-100">JoinRISE COACHING</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <Input
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Exam Preparation (Multi-select)</label>
              <div className="grid grid-cols-2 gap-2">
                {EXAM_OPTIONS.map((exam) => (
                  <button
                    key={exam}
                    type="button"
                    onClick={() => toggleExam(exam)}
                    disabled={loading}
                    className={`p-2 rounded text-xs font-medium transition-colors ${
                      selectedExams.includes(exam)
                        ? "bg-orange-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {exam}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
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
