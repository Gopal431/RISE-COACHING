"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { loginTeacher } from "@/lib/firebase-helpers"

interface AdminLoginPageProps {
  onLogin: (email: string, teacherName: string, uid: string) => void
  onBack: () => void
}

export default function AdminLoginPage({ onLogin, onBack }: AdminLoginPageProps) {
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
      const user = await loginTeacher(email, password)
      // Assume teacher name is stored in Firebase (using email for now)
      onLogin(email, email.split("@")[0], user.uid)
    } catch (err: any) {
      setError(err.message || "Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">👨‍🏫</span>
            </div>
            <div>
              <CardTitle className="text-white">Competitive Arena</CardTitle>
              <CardDescription className="text-blue-100">Teacher Admin Login</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                type="email"
                placeholder="teacher@example.com"
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
              {loading ? "Logging in..." : "Login as Teacher"}
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

          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-600 mb-2">
              <strong>Demo Credentials:</strong>
            </p>
            <p className="text-xs text-gray-600">Email: demo@example.com</p>
            <p className="text-xs text-gray-600">Password: demo123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
