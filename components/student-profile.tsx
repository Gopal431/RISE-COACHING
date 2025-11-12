"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getStudentProfile, updateStudentProfile } from "@/lib/firebase-helpers"
import { ArrowLeft, CheckCircle } from "lucide-react"

interface StudentProfileProps {
  studentId: string
  onBack: () => void
}

export default function StudentProfile({ studentId, onBack }: StudentProfileProps) {
  const [address, setAddress] = useState("")
  const [profileImage, setProfileImage] = useState("")
  const [studentProfile, setStudentProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getStudentProfile(studentId)
        setStudentProfile(profile)
        setAddress(profile?.address || "")
        setProfileImage(profile?.profileImage || "")
      } catch (err) {
        console.error("Error loading profile:", err)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [studentId])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setError("")
    setSuccess("")
    setSaving(true)

    try {
      await updateStudentProfile(studentId, {
        address,
        profileImage,
      })
      setSuccess("Profile updated successfully!")
      setTimeout(() => onBack(), 2000)
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 px-4 py-8">
      <div className="container mx-auto max-w-2xl">
        <Button onClick={onBack} variant="outline" className="mb-6 bg-white">
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-t-lg">
            <CardTitle className="text-white">Edit Profile</CardTitle>
            <CardDescription className="text-orange-100">Update your profile information</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            {/* Profile Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Profile Image</label>
              <div className="flex gap-4 items-start">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  {profileImage ? (
                    <img
                      src={profileImage || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>
                <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={saving} />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                placeholder="Enter your full address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                rows={4}
                disabled={saving}
              />
            </div>

            {/* Info */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600">
                <strong>Name:</strong> {studentProfile?.fullName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {studentProfile?.email}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Phone:</strong> {studentProfile?.phoneNumber}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button onClick={handleSave} className="flex-1 bg-orange-600 hover:bg-orange-700" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button onClick={onBack} variant="outline" className="flex-1 bg-transparent" disabled={saving}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
