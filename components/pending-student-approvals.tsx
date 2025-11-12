"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getPendingStudents, approveStudent, rejectStudent } from "@/lib/firebase-helpers"
import { AlertCircle, CheckCircle, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function PendingStudentApprovals() {
  const [pendingStudents, setPendingStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [approving, setApproving] = useState<string | null>(null)
  const [rejecting, setRejecting] = useState<string | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    loadPendingStudents()
  }, [])

  const loadPendingStudents = async () => {
    setLoading(true)
    try {
      const students = await getPendingStudents()
      setPendingStudents(students.filter((s: any) => s.status === "pending" && s.verified))
    } catch (err) {
      console.error("Error loading students:", err)
      setError("Failed to load pending students")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (studentId: string) => {
    if (!password) {
      setError("Please enter a password")
      return
    }

    setApproving(studentId)
    try {
      await approveStudent(studentId, password)
      setSuccess("Student approved successfully!")
      setPassword("")
      setSelectedStudent(null)
      await loadPendingStudents()
    } catch (err: any) {
      setError(err.message || "Failed to approve student")
      console.error(err)
    } finally {
      setApproving(null)
    }
  }

  const handleReject = async (studentId: string) => {
    if (!window.confirm("Are you sure you want to reject this student?")) return

    setRejecting(studentId)
    try {
      await rejectStudent(studentId)
      setSuccess("Student rejected successfully!")
      await loadPendingStudents()
    } catch (err: any) {
      setError(err.message || "Failed to reject student")
      console.error(err)
    } finally {
      setRejecting(null)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-64">Loading...</div>
  }

  if (pendingStudents.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">No pending student approvals</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
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

      {selectedStudent && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle>Approve Student: {selectedStudent.fullName}</CardTitle>
            <CardDescription>Set a password for this student account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Email:</strong> {selectedStudent.email}
              </p>
              <p className="text-sm">
                <strong>Phone:</strong> {selectedStudent.phoneNumber}
              </p>
              <p className="text-sm">
                <strong>Exams:</strong> {selectedStudent.examPreparation.join(", ")}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Set Password</label>
              <Input
                type="password"
                placeholder="Enter password for student"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={approving === selectedStudent.id}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleApprove(selectedStudent.id)}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={approving === selectedStudent.id}
              >
                {approving === selectedStudent.id ? "Approving..." : "Approve"}
              </Button>
              <Button
                onClick={() => setSelectedStudent(null)}
                variant="outline"
                className="flex-1"
                disabled={approving === selectedStudent.id}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {pendingStudents.map((student) => (
          <Card key={student.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{student.fullName}</h3>
                  <p className="text-sm text-gray-600">{student.email}</p>
                  <p className="text-sm text-gray-600">Phone: {student.phoneNumber}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {student.examPreparation.map((exam: string) => (
                      <span key={exam} className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                        {exam}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button
                    onClick={() => setSelectedStudent(student)}
                    className="flex-1 md:flex-none bg-green-600 hover:bg-green-700"
                    disabled={selectedStudent?.id === student.id}
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(student.id)}
                    variant="destructive"
                    className="flex-1 md:flex-none"
                    disabled={rejecting === student.id}
                  >
                    <Trash2 size={16} className="mr-1" />
                    {rejecting === student.id ? "Rejecting..." : "Reject"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
