"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Trash2, Plus, Edit2 } from "lucide-react"
import QuestionBuilder from "@/components/question-builder"
import { createExam, getTeacherExams, deleteExam } from "@/lib/firebase-helpers"

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: string
}

interface Exam {
  id: string
  name: string
  duration: number
  examCode: string
  questions: Question[]
  createdAt: string
}

interface ExamBuilderProps {
  teacherId: string
}

export default function ExamBuilder({ teacherId }: ExamBuilderProps) {
  const [exams, setExams] = useState<Exam[]>([])
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    duration: 60,
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadExams()
  }, [teacherId])

  const loadExams = async () => {
    try {
      const data = await getTeacherExams(teacherId)
      setExams(data)
    } catch (err) {
      console.error("Error loading exams:", err)
    }
  }

  const generateExamCode = (): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    if (!formData.name || formData.duration < 1) {
      setError("Please fill all required fields")
      setLoading(false)
      return
    }

    try {
      await createExam(teacherId, formData.name, formData.duration, generateExamCode(), [])
      await loadExams()
      setFormData({ name: "", duration: 60 })
      setSuccess("Exam created successfully")
    } catch (err) {
      setError("Failed to create exam")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteExam = async (id: string) => {
    try {
      await deleteExam(teacherId, id)
      await loadExams()
      setSelectedExamId(null)
    } catch (err) {
      setError("Failed to delete exam")
    }
  }

  const copyExamCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setSuccess("Exam code copied to clipboard")
  }

  const selectedExam = exams.find((e) => e.id === selectedExamId)

  return (
    <div className="space-y-6">
      {!selectedExamId ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Create New Exam</CardTitle>
              <CardDescription>Set up a new exam with questions</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateExam} className="space-y-4">
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name *</label>
                    <Input
                      placeholder="e.g., Physics Final Exam"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes) *</label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) })}
                      disabled={loading}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                  <Plus size={18} className="mr-2" />
                  {loading ? "Creating..." : "Create Exam"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Exams</CardTitle>
              <CardDescription>Manage and configure your exams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {exams.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No exams created yet</p>
                ) : (
                  exams.map((exam) => (
                    <div
                      key={exam.id}
                      className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800">{exam.name}</h3>
                          <div className="flex flex-col sm:flex-row gap-4 mt-3 text-sm text-gray-600">
                            <span>⏱️ {exam.duration} minutes</span>
                            <span>❓ {exam.questions?.length || 0} questions</span>
                          </div>
                          <div className="mt-3 p-2 bg-white rounded border border-gray-300">
                            <p className="text-xs text-gray-600 mb-1">Exam Code:</p>
                            <p className="font-mono font-bold text-lg text-blue-600">{exam.examCode}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 w-full md:w-auto">
                          <Button
                            onClick={() => setSelectedExamId(exam.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            size="sm"
                          >
                            <Edit2 size={16} className="mr-1" />
                            Edit
                          </Button>
                          <Button onClick={() => copyExamCode(exam.examCode)} variant="outline" size="sm">
                            <Copy size={16} />
                          </Button>
                          <Button onClick={() => handleDeleteExam(exam.id)} variant="destructive" size="sm">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <QuestionBuilder
          exam={selectedExam!}
          teacherId={teacherId}
          onBack={() => {
            setSelectedExamId(null)
            loadExams()
          }}
        />
      )}
    </div>
  )
}
