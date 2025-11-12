"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { loginStudent, getStudentProfile } from "@/lib/firebase-helpers"
import { AlertCircle } from "lucide-react"

interface StudentLandingPageProps {
  onStudentSignup: () => void
  onStudentLogin: (studentId: string, studentEmail: string) => void
  onBack: () => void
}

export default function StudentLandingPage({ onStudentSignup, onStudentLogin, onBack }: StudentLandingPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!email || !password) {
      setError("Please enter email and password")
      setLoading(false)
      return
    }

    try {
      const user = await loginStudent(email, password)
      const profile = await getStudentProfile(user.uid)

      if (!profile) {
        setError("Student profile not found. Please contact admin.")
        setLoading(false)
        return
      }

      onStudentLogin(user.uid, email)
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.")
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
              <span className="text-orange-600 font-bold text-lg">👤</span>
            </div>
            <div>
              <CardTitle className="text-white">Student Login</CardTitle>
              <CardDescription className="text-orange-100">Access your exam portal</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={onStudentSignup}
              className="w-full bg-transparent"
              disabled={loading}
            >
              Create New Account
            </Button>

            <Button type="button" variant="ghost" onClick={onBack} className="w-full" disabled={loading}>
              Back to Home
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
