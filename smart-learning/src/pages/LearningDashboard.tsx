import React from 'react'
import { useProgress } from '../context/ProgressContext'
import CourseCard from '../components/CourseCard'
import coursesData from '../data/courses.json'
import type { Course } from '../types'

const courses = coursesData.courses as Course[]

export default function LearningDashboard() {
  const { getCourseProgress } = useProgress()

  return (
    <div className="min-h-screen bg-soil-light">
      <header className="border-b border-soil/10 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-primary">Croporia Smart Learning</h1>
          <p className="text-sm text-soil/70 mt-0.5">Farming education at your pace</p>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-lg font-semibold text-soil mb-6">Your courses</h2>
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
          {courses.map((course) => {
            const total = course.stages.reduce((acc, s) => acc + s.lessons.length, 0)
            const { completed, percent } = getCourseProgress(course.id, total)
            return (
              <CourseCard
                key={course.id}
                course={course}
                progressPercent={percent}
                completedLessons={completed}
                totalLessons={total}
              />
            )
          })}
        </div>
      </main>
    </div>
  )
}
