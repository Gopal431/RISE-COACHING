"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { verifyStudentOTP } from "@/lib/firebase-helpers"
import { AlertCircle, CheckCircle } from "lucide-react"

interface StudentOTPVerificationProps {
  studentId: string
  phoneNumber: string
  onVerificationSuccess: () => void
  onBack: () => void
}

export default function StudentOTPVerification({
  studentId,
  phoneNumber,
  onVerificationSuccess,
  onBack,
}: StudentOTPVerificationProps) {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!otp.trim()) {
      setError("Please enter OTP")
      return
    }

    setLoading(true)
    try {
      await verifyStudentOTP(studentId, otp.toUpperCase())
      setSuccess("OTP verified successfully! Your profile is pending admin approval.")
      setTimeout(() => onVerificationSuccess(), 2000)
    } catch (err: any) {
      setError(err.message || "Verification failed. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-orange-50 to-blue-50">
      <Card className="w-full max-w-md">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-lg">
          <CardTitle className="text-white">Verify Phone Number</CardTitle>
          <CardDescription className="text-blue-100">Enter the OTP sent to {phoneNumber}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleVerify} className="space-y-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
              <Input
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.toUpperCase())}
                className="w-full text-center text-2xl tracking-widest"
                disabled={loading}
                maxLength={6}
              />
              <p className="text-xs text-gray-500 mt-2">Check your registered phone number for OTP</p>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="w-full bg-transparent"
              disabled={loading}
            >
              Back
            </Button>
          </form>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-600">
              <strong>Note:</strong> After verification, your account will be reviewed by admin. You'll be able to login
              once approved.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
