"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Award, TrendingUp } from "lucide-react"

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: string
}

interface ResultsPageProps {
  results: {
    studentName: string
    rollNo: string
    examName: string
    score: number
    totalMarks: number
    percentage: number
    answers: Record<string, string>
    questions: Question[]
  }
  onRetry: () => void
}

export default function ResultsPage({ results, onRetry }: ResultsPageProps) {
  const { studentName, rollNo, examName, score, totalMarks, percentage, answers, questions } = results

  const getMedalIcon = () => {
    if (percentage >= 80) return <Trophy className="w-12 h-12 text-yellow-500" />
    if (percentage >= 60) return <Award className="w-12 h-12 text-blue-500" />
    return <TrendingUp className="w-12 h-12 text-orange-500" />
  }

  const getPassStatus = () => {
    if (percentage >= 80) return { label: "Excellent", color: "text-yellow-600" }
    if (percentage >= 60) return { label: "Good", color: "text-blue-600" }
    if (percentage >= 40) return { label: "Fair", color: "text-orange-600" }
    return { label: "Need Improvement", color: "text-red-600" }
  }

  const passStatus = getPassStatus()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg mb-6 border-t-4 border-orange-500">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-500 text-white">
            <CardTitle className="text-2xl md:text-3xl text-center">Exam Completed!</CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            {/* Student Info */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{studentName}</h2>
              <p className="text-gray-600 mb-2">Roll No: {rollNo}</p>
              <p className="text-sm text-gray-500">{examName}</p>
            </div>

            {/* Score Display */}
            <div className="flex flex-col items-center justify-center mb-8 py-6 bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg">
              <div className="flex justify-center mb-4">{getMedalIcon()}</div>
              <p className={`text-4xl font-bold ${passStatus.color} mb-2`}>{percentage.toFixed(2)}%</p>
              <p className={`text-lg font-semibold ${passStatus.color}`}>{passStatus.label}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="bg-blue-50 border-2 border-blue-200">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-600 text-sm font-medium mb-2">Correct Answers</p>
                  <p className="text-3xl md:text-4xl font-bold text-blue-900">{score}</p>
                  <p className="text-xs text-gray-500 mt-1">out of {totalMarks}</p>
                </CardContent>
              </Card>
              <Card className="bg-orange-50 border-2 border-orange-200">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-600 text-sm font-medium mb-2">Wrong Answers</p>
                  <p className="text-3xl md:text-4xl font-bold text-orange-900">{totalMarks - score}</p>
                  <p className="text-xs text-gray-500 mt-1">Questions</p>
                </CardContent>
              </Card>
              <Card className="bg-green-50 border-2 border-green-200">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-600 text-sm font-medium mb-2">Percentage</p>
                  <p className="text-3xl md:text-4xl font-bold text-green-900">{percentage.toFixed(1)}%</p>
                  <p className="text-xs text-gray-500 mt-1">Score</p>
                </CardContent>
              </Card>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Answer Review</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {questions.map((question, index) => {
                  const userAnswer = answers[question.id]
                  const isCorrect = userAnswer === question.correctAnswer

                  return (
                    <Card key={question.id} className={isCorrect ? "border-green-200" : "border-red-200"}>
                      <CardContent className="p-4">
                        <div className="flex gap-3 mb-2">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                              isCorrect ? "bg-green-500" : "bg-red-500"
                            }`}
                          >
                            {isCorrect ? "✓" : "✗"}
                          </div>
                          <p className="font-semibold text-gray-900">Question {index + 1}</p>
                        </div>
                        <p className="text-gray-700 mb-3 ml-9 text-sm md:text-base">{question.text}</p>
                        <div className="ml-9 space-y-1 text-xs md:text-sm">
                          <p className="text-gray-600">
                            <span className="font-semibold">Your Answer:</span>{" "}
                            {userAnswer
                              ? `${userAnswer} - ${question.options[userAnswer.charCodeAt(0) - 65]}`
                              : "Not Answered"}
                          </p>
                          <p className="text-green-700 font-semibold">
                            <span>Correct Answer:</span>{" "}
                            {`${question.correctAnswer} - ${question.options[question.correctAnswer.charCodeAt(0) - 65]}`}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            <div className="flex gap-3 justify-center flex-col md:flex-row">
              <Button
                onClick={onRetry}
                className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold px-8 py-2 rounded-lg w-full md:w-auto"
              >
                Exit Exam
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs md:text-sm text-gray-600 mt-6">
          © 2025RISE COACHING | Strive for Excellence
        </p>
      </div>
    </div>
  )
}
