import React, { useState } from 'react'
import type { QuizQuestion } from '../types'

interface QuizProps {
  questions: QuizQuestion[]
  onComplete: (score: number) => void
  className?: string
}

type AnswerState = 'idle' | 'correct' | 'wrong'

export default function Quiz({ questions, onComplete, className = '' }: QuizProps) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<AnswerState>('idle')
  const [explanation, setExplanation] = useState<string | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [showSummary, setShowSummary] = useState(false)

  const q = questions[current]
  const isLast = current === questions.length - 1

  const handleOptionClick = (optionIndex: number) => {
    if (feedback !== 'idle') return
    setSelected(optionIndex)
    const correct = optionIndex === q.correct
    setFeedback(correct ? 'correct' : 'wrong')
    setExplanation(q.explanation)
    if (correct) setCorrectCount((c) => c + 1)
  }

  const handleNext = () => {
    if (isLast) {
      const score = Math.round((correctCount / questions.length) * 100)
      onComplete(score)
      setShowSummary(true)
    } else {
      setCurrent((c) => c + 1)
      setSelected(null)
      setFeedback('idle')
      setExplanation(null)
    }
  }

  if (showSummary) {
    const score = Math.round((correctCount / questions.length) * 100)
    return (
      <div className={`rounded-2xl border-2 border-soil/10 bg-white p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-soil mb-2">Quiz complete</h3>
        <div className="flex items-center justify-center gap-2 py-6">
          <span className="text-4xl font-bold text-primary">{score}%</span>
          <span className="text-soil/70">
            {correctCount}/{questions.length} correct
          </span>
        </div>
        <p className="text-sm text-soil/80 text-center">
          {score >= 80 ? 'Great job! You’re ready for the next lesson.' : 'Review the lesson and try again when you’re ready.'}
        </p>
      </div>
    )
  }

  if (!q) return null

  return (
    <div className={`rounded-2xl border-2 border-soil/10 bg-white p-4 sm:p-6 ${className}`}>
      <p className="text-xs text-soil/60 mb-2">
        Question {current + 1} of {questions.length}
      </p>
      <h3 className="font-semibold text-soil mb-4">{q.question}</h3>
      <ul className="space-y-2" role="listbox" aria-label="Answer options">
        {q.options.map((opt, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => handleOptionClick(i)}
              disabled={feedback !== 'idle'}
              className={`w-full text-left rounded-xl border-2 px-4 py-3 text-sm transition-all ${
                feedback === 'idle'
                  ? 'border-soil/20 hover:border-leaf/40 hover:bg-leaf/5'
                  : i === q.correct
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : selected === i && feedback === 'wrong'
                      ? 'border-red-400 bg-red-50 text-red-800'
                      : 'border-soil/15 bg-soil-light/50'
              }`}
            >
              {opt}
            </button>
          </li>
        ))}
      </ul>
      {explanation && (
        <div className="mt-4 p-3 rounded-lg bg-soil-light border border-soil/10">
          <p className="text-xs font-medium text-primary mb-1">Explanation</p>
          <p className="text-sm text-soil/90">{explanation}</p>
        </div>
      )}
      {feedback !== 'idle' && (
        <button
          type="button"
          onClick={handleNext}
          className="mt-4 w-full py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
        >
          {isLast ? 'Finish quiz' : 'Next question'}
        </button>
      )}
    </div>
  )
}
