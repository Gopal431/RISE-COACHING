"use client"

interface TimerProps {
  timeLeft: number
}

export default function Timer({ timeLeft }: TimerProps) {
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const isLowTime = timeLeft < 300 // Less than 5 minutes

  return (
    <div
      className={`text-center font-bold text-lg px-4 py-2 rounded-lg ${
        isLowTime
          ? "animate-pulse bg-red-100 text-red-700"
          : "bg-white bg-opacity-20 text-black"
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        <span className="text-xl">⏱️</span>
        <span>
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </span>
      </div>
    </div>
  )
}
