"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Medal, Trophy } from "lucide-react"
import { getTeacherExams, getExamResults } from "@/lib/firebase-helpers"

interface LeaderboardProps {
  teacherId: string
}

interface StudentResult {
  id: string
  studentName: string
  studentRollNo: string
  score: number
  totalQuestions: number
  percentage: number
  submittedAt: string
}

export default function Leaderboard({ teacherId }: LeaderboardProps) {
  const [exams, setExams] = useState<any[]>([])
  const [selectedExamId, setSelectedExamId] = useState<string>("")
  const [results, setResults] = useState<StudentResult[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadExams()
  }, [teacherId])

  useEffect(() => {
    if (selectedExamId) {
      loadResults()
    }
  }, [selectedExamId])

  const loadExams = async () => {
    try {
      const data = await getTeacherExams(teacherId)
      setExams(data)
      if (data.length > 0) {
        setSelectedExamId(data[0].id)
      }
    } catch (err) {
      console.error("Error loading exams:", err)
    }
  }

  const loadResults = async () => {
    if (!selectedExamId) return
    setLoading(true)
    try {
      const data = await getExamResults(teacherId, selectedExamId)
      setResults(data)
    } catch (err) {
      console.error("Error loading results:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exam Leaderboard</CardTitle>
          <CardDescription>View top performers in each exam</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Exam</label>
            <Select value={selectedExamId} onValueChange={setSelectedExamId}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {exams.map((exam) => (
                  <SelectItem key={exam.id} value={exam.id}>
                    {exam.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading results...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No results available for this exam yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={result.id}
                  className={`p-4 rounded-lg border-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
                    index === 0
                      ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300"
                      : index === 1
                        ? "bg-gradient-to-r from-gray-50 to-blue-50 border-gray-300"
                        : index === 2
                          ? "bg-gradient-to-r from-orange-50 to-red-50 border-orange-300"
                          : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full font-bold">
                      {index === 0 && <Trophy className="w-8 h-8 text-yellow-500" />}
                      {index === 1 && <Medal className="w-8 h-8 text-gray-400" />}
                      {index === 2 && <Medal className="w-8 h-8 text-orange-600" />}
                      {index > 2 && <span className="text-xl text-gray-600">#{index + 1}</span>}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{result.studentName}</p>
                      <p className="text-sm text-gray-600">Roll: {result.studentRollNo}</p>
                    </div>
                  </div>
                  <div className="flex flex-col md:text-right gap-2">
                    <div>
                      <p className="font-bold text-lg text-blue-600">
                        {result.score}/{result.totalQuestions}
                      </p>
                      <p className="text-sm text-gray-600">{result.percentage.toFixed(2)}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
