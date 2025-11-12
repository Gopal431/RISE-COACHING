"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { collection, getDocs, updateDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { AlertCircle, CheckCircle, Lock, Unlock } from "lucide-react"

export default function UserManagement() {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [toggling, setToggling] = useState<string | null>(null)

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    setLoading(true)
    setError("")
    try {
      const studentsRef = collection(db, "students")
      const snapshot = await getDocs(studentsRef)
      const studentsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setStudents(studentsData)
    } catch (err: any) {
      console.error("Error loading students:", err)
      setError("Failed to load students")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleBlock = async (studentId: string, isBlocked: boolean) => {
    setToggling(studentId)
    try {
      const studentRef = doc(db, "students", studentId)
      await updateDoc(studentRef, { isBlocked: !isBlocked })
      setSuccess(isBlocked ? "Student unblocked!" : "Student blocked!")
      await loadStudents()
    } catch (err: any) {
      setError(err.message || "Failed to update student status")
    } finally {
      setToggling(null)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (students.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No students registered yet</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">User Management</h2>
        <p className="text-gray-600">View and manage student accounts</p>
      </div>

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

      <div className="grid gap-4">
        {students.map((student) => {
          const examCount = student.examHistory?.length || 0
          const isBlocked = student.isBlocked || false

          return (
            <Card key={student.id} className={isBlocked ? "border-red-200 bg-red-50" : ""}>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg text-gray-900">{student.fullName}</h3>
                      {isBlocked && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">BLOCKED</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 break-all">{student.email}</p>
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">Exams Taken</p>
                        <p className="font-semibold text-lg text-blue-600">{examCount}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Exam Prep</p>
                        <p className="font-medium text-gray-900">{student.examPreparation?.join(", ") || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Joined</p>
                        <p className="font-medium text-gray-900">{new Date(student.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Status</p>
                        <p className={`font-medium ${isBlocked ? "text-red-600" : "text-green-600"}`}>
                          {isBlocked ? "Blocked" : "Active"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleToggleBlock(student.id, isBlocked)}
                    disabled={toggling === student.id}
                    className={isBlocked ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                  >
                    {toggling === student.id ? (
                      "Processing..."
                    ) : (
                      <>
                        {isBlocked ? (
                          <>
                            <Unlock size={16} className="mr-2" />
                            Unblock
                          </>
                        ) : (
                          <>
                            <Lock size={16} className="mr-2" />
                            Block
                          </>
                        )}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
