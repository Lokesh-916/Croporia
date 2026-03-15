import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Diagram from '../components/Diagram'
import IntuitionBox from '../components/IntuitionBox'
import coursesData from '../data/courses.json'
import type { Course, Lesson as LessonType } from '../types'

const courses = coursesData.courses as Course[]

export default function LessonPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
  const navigate = useNavigate()

  const course = courses.find((c) => c.id === courseId)
  let lesson: LessonType | null = null
  for (const s of course?.stages ?? []) {
    lesson = s.lessons.find((l) => l.id === lessonId) ?? null
    if (lesson) break
  }

  if (!course || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-soil/70">Lesson not found.</p>
      </div>
    )
  }

  const hasQuiz = lesson.quiz?.questions?.length > 0

  return (
    <div className="min-h-screen bg-soil-light">
      <header className="border-b border-soil/10 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link to={`/course/${course.id}`} className="text-sm text-primary hover:underline">
            ← {course.title}
          </Link>
          <h1 className="text-lg font-bold text-soil mt-1">{lesson.title}</h1>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6 pb-12">
        <section className="animate-slide-up">
          <h2 className="sr-only">Lesson content</h2>
          <p className="text-soil leading-relaxed">{lesson.content}</p>
        </section>

        <section className="mt-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <Diagram type={lesson.diagram as import('../components/Diagram').DiagramType} className="w-full" />
        </section>

        <section className="mt-6 animate-slide-up">
          <IntuitionBox>{lesson.intuition}</IntuitionBox>
        </section>

        {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
          <section className="mt-6">
            <h3 className="text-sm font-semibold text-soil mb-2">Key takeaways</h3>
            <ul className="space-y-2">
              {lesson.keyTakeaways.map((takeaway, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-soil/90">
                  <span className="text-leaf flex-shrink-0">•</span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {hasQuiz && (
          <div className="mt-8">
            <button
              type="button"
              onClick={() => navigate(`/course/${course.id}/lesson/${lesson!.id}/quiz`)}
              className="w-full py-3 rounded-xl bg-harvest text-soil font-semibold hover:bg-harvest/90 transition-colors shadow-sm"
            >
              Start Quiz
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
