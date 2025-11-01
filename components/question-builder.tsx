"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, Plus, ArrowLeft, Edit2 } from "lucide-react"
import { updateExamQuestion, deleteExamQuestion } from "@/lib/firebase-helpers"

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: string
}

interface ExamType {
  id: string
  name: string
  duration: number
  examCode: string
  questions: Question[]
}

interface QuestionBuilderProps {
  exam: ExamType
  teacherId: string
  onBack: () => void
}

export default function QuestionBuilder({ exam, teacherId, onBack }: QuestionBuilderProps) {
  const [questions, setQuestions] = useState<Question[]>(exam.questions || [])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    text: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctAnswer: "A",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAddOrUpdateQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!formData.text || !formData.option1 || !formData.option2 || !formData.option3 || !formData.option4) {
      setError("All fields are required")
      return
    }

    setLoading(true)
    try {
      if (editingId) {
        // Update existing question
        const editIndex = questions.findIndex((q) => q.id === editingId)
        const updatedQuestion: Question = {
          id: editingId,
          text: formData.text,
          options: [formData.option1, formData.option2, formData.option3, formData.option4],
          correctAnswer: formData.correctAnswer,
        }
        const updated = [...questions]
        updated[editIndex] = updatedQuestion
        setQuestions(updated)
        await updateExamQuestion(teacherId, exam.id, editIndex, updatedQuestion)
        setSuccess("Question updated successfully")
        setEditingId(null)
      } else {
        // Add new question
        const newQuestion: Question = {
          id: Date.now().toString(),
          text: formData.text,
          options: [formData.option1, formData.option2, formData.option3, formData.option4],
          correctAnswer: formData.correctAnswer,
        }
        const updated = [...questions, newQuestion]
        setQuestions(updated)
        await updateExamQuestion(teacherId, exam.id, questions.length, newQuestion)
        setSuccess("Question added successfully")
      }
      setFormData({ text: "", option1: "", option2: "", option3: "", option4: "", correctAnswer: "A" })
    } catch (err) {
      setError("Failed to save question")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleEditQuestion = (question: Question) => {
    const optIdx = questions.findIndex((q) => q.id === question.id)
    setEditingId(question.id)
    setFormData({
      text: question.text,
      option1: question.options[0],
      option2: question.options[1],
      option3: question.options[2],
      option4: question.options[3],
      correctAnswer: question.correctAnswer,
    })
  }

  const handleDeleteQuestion = async (id: string) => {
    try {
      const index = questions.findIndex((q) => q.id === id)
      if (index >= 0) {
        await deleteExamQuestion(teacherId, exam.id, index)
        const updated = questions.filter((q) => q.id !== id)
        setQuestions(updated)
      }
    } catch (err) {
      setError("Failed to delete question")
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setFormData({ text: "", option1: "", option2: "", option3: "", option4: "", correctAnswer: "A" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{exam.name}</h2>
          <p className="text-sm text-gray-600">Add or edit questions (Code: {exam.examCode})</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Question" : "Add Question"}</CardTitle>
          <CardDescription>Create or modify multiple choice questions</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddOrUpdateQuestion} className="space-y-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question Text *</label>
              <Input
                placeholder="Enter question"
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Options *</label>
              {["option1", "option2", "option3", "option4"].map((key, idx) => (
                <div key={key} className="flex gap-2">
                  <span className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-700 font-bold rounded">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <Input
                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                    value={formData[key as keyof typeof formData] || ""}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    disabled={loading}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer *</label>
              <div className="flex gap-2">
                {["A", "B", "C", "D"].map((option) => (
                  <Button
                    key={option}
                    type="button"
                    onClick={() => setFormData({ ...formData, correctAnswer: option })}
                    disabled={loading}
                    className={`w-12 h-12 ${
                      formData.correctAnswer === option ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={loading}>
                <Plus size={18} className="mr-2" />
                {loading ? "Saving..." : editingId ? "Update Question" : "Add Question"}
              </Button>
              {editingId && (
                <Button type="button" onClick={handleCancelEdit} variant="outline" disabled={loading}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Questions ({questions.length})</CardTitle>
          <CardDescription>Manage exam questions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {questions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No questions added yet</p>
            ) : (
              questions.map((question, idx) => (
                <div key={question.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        Q{idx + 1}: {question.text}
                      </p>
                      <div className="mt-2 space-y-1 text-sm">
                        {question.options.map((option, optIdx) => (
                          <p
                            key={optIdx}
                            className={`ml-4 ${
                              String.fromCharCode(65 + optIdx) === question.correctAnswer
                                ? "font-bold text-green-600"
                                : "text-gray-600"
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}: {option}
                            {String.fromCharCode(65 + optIdx) === question.correctAnswer && " ✓"}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleEditQuestion(question)} variant="outline" size="sm">
                        <Edit2 size={16} />
                      </Button>
                      <Button onClick={() => handleDeleteQuestion(question.id)} variant="destructive" size="sm">
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
    </div>
  )
}
