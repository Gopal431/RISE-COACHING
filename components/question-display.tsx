"use client"

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: string
}

interface QuestionDisplayProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  selectedAnswer: string
  onSelectAnswer: (answer: string) => void
}

export default function QuestionDisplay({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
}: QuestionDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-100 to-blue-100 p-4 rounded-lg border-l-4 border-orange-600">
        <p className="text-sm text-gray-600 mb-2">
          Question {questionNumber} of {totalQuestions}
        </p>
        <p className="text-lg font-semibold text-gray-900">{question.text}</p>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => {
          const optionLetter = String.fromCharCode(65 + index)
          return (
            <button
              key={optionLetter}
              onClick={() => onSelectAnswer(optionLetter)}
              className={`w-full p-4 text-left rounded-lg border-2 transition font-medium ${
                selectedAnswer === optionLetter
                  ? "bg-orange-100 border-orange-500 text-orange-900 shadow-md"
                  : "bg-white border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${
                    selectedAnswer === optionLetter
                      ? "bg-orange-500 border-orange-500 text-white"
                      : "bg-gray-100 border-gray-300 text-gray-700"
                  }`}
                >
                  {optionLetter}
                </div>
                <span className="text-base">{option}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
