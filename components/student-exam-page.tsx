"use client"

import { useState, useEffect } from "react"
import Timer from "@/components/timer"
import QuestionDisplay from "@/components/question-display"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Menu, X } from "lucide-react"
import { getDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { submitExamResult } from "@/lib/firebase-helpers"

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: string
}

interface StudentExamPageProps {
  student: {
    name: string
    rollNo: string
    examCode: string
    examId: string
    teacherId: string
  }
  onSubmit: (results: any) => void
  onLogout: () => void
}

export default function StudentExamPage({ student, onSubmit, onLogout }: StudentExamPageProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [examInfo, setExamInfo] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadExam()
  }, [])

  const loadExam = async () => {
    try {
      const examRef = doc(db, "teachers", student.teacherId, "exams", student.examId)
      const examSnap = await getDoc(examRef)
      if (examSnap.exists()) {
        const data = examSnap.data()
        setExamInfo(data)
        setQuestions(data.questions || [])
        setTimeLeft((data.duration || 60) * 60)
      } else {
        console.error("Exam not found")
      }
    } catch (error) {
      console.error("Error loading exam:", error)
    }
  }

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || !examInfo) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          handleSubmitExam()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, examInfo])

  const handleSelectAnswer = (answer: string) => {
    const questionId = questions[currentQuestionIndex].id
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleGoToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
    setMobileMenuOpen(false)
  }

  const handleSubmitExam = async () => {
    setSubmitting(true)
    try {
      let correctCount = 0
      questions.forEach((question) => {
        if (answers[question.id] === question.correctAnswer) {
          correctCount++
        }
      })

      const results = {
        studentName: student.name,
        rollNo: student.rollNo,
        examCode: student.examCode,
        examName: examInfo.name,
        score: correctCount,
        totalMarks: questions.length,
        percentage: (correctCount / questions.length) * 100,
        answers,
        questions,
        timestamp: new Date().toISOString(),
      }

      // Save to Firebase
      await submitExamResult(
        student.teacherId,
        student.examId,
        student.name,
        student.rollNo,
        correctCount,
        questions.length,
        answers,
      )

      onSubmit(results)
    } catch (error) {
      console.error("Error submitting exam:", error)
      alert("Error submitting exam. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (!examInfo || timeLeft === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exam...</p>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const answeredCount = Object.keys(answers).length
  const unansweredCount = questions.length - answeredCount

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <div className="flex-1">
              <h1 className="text-xl font-bold">{examInfo.name}</h1>
              <p className="text-sm text-orange-100">
                {student.name} (Roll: {student.rollNo})
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Timer timeLeft={timeLeft} />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="bg-white text-orange-600 hover:bg-orange-50">
                    Submit Exam
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You have answered {answeredCount} out of {questions.length} questions. This action cannot be undone.
                  </AlertDialogDescription>
                  <div className="flex gap-2">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmitExam} className="bg-orange-600" disabled={submitting}>
                      {submitting ? "Submitting..." : "Submit"}
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>

              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <Card>
              <CardContent className="pt-6">
                <QuestionDisplay
                  question={currentQuestion}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={questions.length}
                  selectedAnswer={answers[currentQuestion.id] || ""}
                  onSelectAnswer={handleSelectAnswer}
                />

                <div className="flex flex-col md:flex-row gap-3 mt-8">
                  <Button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    variant="outline"
                    className="flex-1 bg-transparent"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            {mobileMenuOpen && (
              <div className="md:hidden mb-4">
                <Card>
                  <CardContent className="pt-4">
                    <QuestionNavigator
                      questions={questions}
                      currentIndex={currentQuestionIndex}
                      answers={answers}
                      onSelectQuestion={handleGoToQuestion}
                    />
                  </CardContent>
                </Card>
              </div>
            )}
            <div className="hidden md:block">
              <Card>
                <CardContent className="pt-4">
                  <QuestionNavigator
                    questions={questions}
                    currentIndex={currentQuestionIndex}
                    answers={answers}
                    onSelectQuestion={handleGoToQuestion}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function QuestionNavigator({
  questions,
  currentIndex,
  answers,
  onSelectQuestion,
}: {
  questions: Question[]
  currentIndex: number
  answers: Record<string, string>
  onSelectQuestion: (index: number) => void
}) {
  return (
    <div>
      <p className="font-semibold text-gray-800 mb-3">Questions</p>
      <div className="grid grid-cols-5 md:grid-cols-4 gap-2">
        {questions.map((question, index) => (
          <button
            key={question.id}
            onClick={() => onSelectQuestion(index)}
            className={`w-10 h-10 rounded font-semibold text-sm transition ${
              currentIndex === index
                ? "bg-orange-600 text-white"
                : answers[question.id]
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-600 rounded"></div>
          <span>Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <span>Not Answered</span>
        </div>
      </div>
    </div>
  )
}
