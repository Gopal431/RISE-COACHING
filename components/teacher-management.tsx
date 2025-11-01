"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, Copy } from "lucide-react"
import { registerTeacher, getAllTeachers, deleteTeacherAccount } from "@/lib/firebase-helpers"

interface Teacher {
  id: string
  name: string
  email: string
  uid: string
  createdAt: string
}

export default function TeacherManagement() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [formData, setFormData] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadTeachers()
  }, [])

  const loadTeachers = async () => {
    try {
      const teachersList = await getAllTeachers()
      setTeachers(teachersList)
    } catch (err) {
      console.error("Error loading teachers:", err)
    }
  }

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      const user = await registerTeacher(formData.email, formData.password, formData.name)

      const newTeacher: Teacher = {
        id: user.uid,
        name: formData.name,
        email: formData.email,
        uid: user.uid,
        createdAt: new Date().toISOString(),
      }

      setTeachers([...teachers, newTeacher])
      setFormData({ name: "", email: "", password: "" })
      setSuccess("Teacher added successfully! They can now login with their email and password.")
    } catch (err: any) {
      setError(err.message || "Error adding teacher")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTeacher = async (id: string) => {
    if (confirm("Are you sure you want to delete this teacher?")) {
      try {
        await deleteTeacherAccount(id)
        setTeachers(teachers.filter((t) => t.id !== id))
        setSuccess("Teacher deleted successfully")
      } catch (err) {
        setError("Error deleting teacher")
      }
    }
  }

  const copyCredentials = (email: string) => {
    navigator.clipboard.writeText(email)
    setSuccess("Email copied to clipboard")
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg md:text-xl">Add New Teacher</CardTitle>
          <CardDescription className="text-sm">Create teacher accounts for exam management</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTeacher} className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800 text-sm">{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800 text-sm">{success}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teacher Name</label>
                <Input
                  placeholder="Enter teacher name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={loading}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input
                  type="email"
                  placeholder="teacher@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={loading}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={loading}
                  className="text-sm"
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-sm" disabled={loading}>
              {loading ? "Adding..." : "Add Teacher"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg md:text-xl">Teachers List</CardTitle>
          <CardDescription className="text-sm">Manage teacher accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {teachers.length === 0 ? (
              <p className="text-gray-500 text-center py-8 text-sm">No teachers added yet</p>
            ) : (
              <div className="overflow-x-auto">
                {teachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200 mb-3 gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm md:text-base truncate">{teacher.name}</p>
                      <p className="text-xs md:text-sm text-gray-600 truncate">{teacher.email}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyCredentials(teacher.email)}
                        className="text-xs"
                      >
                        <Copy size={14} className="mr-1" />
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteTeacher(teacher.id)}
                        className="text-xs"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
