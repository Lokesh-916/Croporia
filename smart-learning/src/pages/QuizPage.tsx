import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Quiz from '../components/Quiz'
import { useProgress } from '../context/ProgressContext'
import coursesData from '../data/courses.json'
import type { Course, Lesson } from '../types'

const courses = coursesData.courses as Course[]

export default function QuizPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
  const navigate = useNavigate()
  const { setLessonCompleted } = useProgress()

  const course = courses.find((c) => c.id === courseId)
  let lesson: Lesson | null = null
  for (const s of course?.stages ?? []) {
    lesson = s.lessons.find((l) => l.id === lessonId) ?? null
    if (lesson) break
  }

  if (!course || !lesson?.quiz?.questions?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-soil/70">Quiz not found.</p>
      </div>
    )
  }

  const handleComplete = (score: number) => {
    setLessonCompleted(course.id, lesson!.id, score)
  }

  return (
    <div className="min-h-screen bg-soil-light">
      <header className="border-b border-soil/10 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link to={`/course/${course.id}/lesson/${lesson.id}`} className="text-sm text-primary hover:underline">
            ← Back to lesson
          </Link>
          <h1 className="text-lg font-bold text-soil mt-1">Quiz: {lesson.title}</h1>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6">
        <Quiz questions={lesson.quiz.questions} onComplete={handleComplete} />
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate(`/course/${course.id}`)}
            className="text-primary font-medium hover:underline"
          >
            Back to course
          </button>
        </div>
      </main>
    </div>
  )
}
