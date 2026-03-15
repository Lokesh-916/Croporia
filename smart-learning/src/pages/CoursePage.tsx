import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import ProgressBar from '../components/ProgressBar'
import coursesData from '../data/courses.json'
import type { Course, Stage } from '../types'

const courses = coursesData.courses as Course[]

export default function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { getCourseProgress, getStageProgress, isLessonCompleted, isStageUnlocked } = useProgress()

  const course = courses.find((c) => c.id === courseId)
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-soil/70">Course not found.</p>
      </div>
    )
  }

  const totalLessons = course.stages.reduce((acc, s) => acc + s.lessons.length, 0)
  const { completed, percent } = getCourseProgress(course.id, totalLessons)

  const firstIncompleteLesson = ((): { stageIndex: number; lesson: { id: string } } | null => {
    for (let i = 0; i < course.stages.length; i++) {
      if (!isStageUnlocked(course.id, i, course.stages)) continue
      for (const lesson of course.stages[i].lessons) {
        if (!isLessonCompleted(course.id, lesson.id)) return { stageIndex: i, lesson }
      }
    }
    return null
  })()

  return (
    <div className="min-h-screen bg-soil-light">
      <header className="border-b border-soil/10 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link to="/" className="text-sm text-primary hover:underline">
            ← All courses
          </Link>
          <h1 className="text-xl font-bold text-soil mt-1 flex items-center gap-2">
            <span className="text-2xl">{course.icon}</span>
            {course.title}
          </h1>
          <ProgressBar percent={percent} completed={completed} total={totalLessons} showCount className="mt-3" />
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-soil/20 rounded-full hidden sm:block" />
          {course.stages.map((stage: Stage, stageIndex: number) => {
            const unlocked = isStageUnlocked(course.id, stageIndex, course.stages)
            const lessonIds = stage.lessons.map((l) => l.id)
            const { completed: stageCompleted, percent: stagePercent } = getStageProgress(
              course.id,
              stageIndex,
              lessonIds
            )
            return (
              <div
                key={stage.id}
                className={`relative pl-10 sm:pl-12 pb-10 ${!unlocked ? 'opacity-60' : ''}`}
              >
                <div className="absolute left-0 top-1 w-8 h-8 rounded-full border-2 border-soil/20 bg-soil-light flex items-center justify-center text-sm font-medium text-soil hidden sm:flex">
                  {stageIndex + 1}
                </div>
                <div className="rounded-2xl border-2 border-soil/10 bg-white overflow-hidden">
                  <div className="p-4 border-b border-soil/10 flex items-center justify-between flex-wrap gap-2">
                    <h2 className="font-semibold text-soil">{stage.title}</h2>
                    <ProgressBar percent={stagePercent} completed={stageCompleted} total={lessonIds.length} showCount />
                  </div>
                  <ul className="divide-y divide-soil/10">
                    {stage.lessons.map((lesson) => {
                      const done = isLessonCompleted(course.id, lesson.id)
                      const isNext =
                        firstIncompleteLesson?.stageIndex === stageIndex &&
                        firstIncompleteLesson?.lesson.id === lesson.id
                      const canOpen = unlocked
                      return (
                        <li key={lesson.id}>
                          <Link
                            to={canOpen ? `/course/${course.id}/lesson/${lesson.id}` : '#'}
                            className={`flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                              canOpen ? 'hover:bg-soil-light' : 'cursor-not-allowed'
                            } ${isNext ? 'bg-leaf/10' : ''}`}
                            onClick={(e) => !canOpen && e.preventDefault()}
                          >
                            <span
                              className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                done ? 'bg-primary text-white' : 'bg-soil/20 text-soil/70'
                              }`}
                            >
                              {done ? '✓' : stage.lessons.indexOf(lesson) + 1}
                            </span>
                            <span className="flex-1 font-medium text-soil">{lesson.title}</span>
                            {canOpen && <span className="text-primary text-sm">→</span>}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
