import React from 'react'
import { Link } from 'react-router-dom'
import ProgressBar from './ProgressBar'
import type { Course } from '../types'

interface CourseCardProps {
  course: Course
  progressPercent: number
  completedLessons: number
  totalLessons: number
}

export default function CourseCard({ course, progressPercent, completedLessons, totalLessons }: CourseCardProps) {
  const total = course.stages.reduce((acc, s) => acc + s.lessons.length, 0)
  return (
    <Link
      to={`/course/${course.id}`}
      className="group block rounded-2xl border-2 border-soil/10 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-leaf/30 transition-all duration-300 hover:-translate-y-0.5 animate-fade-in"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-soil-light flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
          {course.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-soil group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-soil/70 mt-1 line-clamp-2">{course.description}</p>
          <ProgressBar
            percent={progressPercent}
            completed={completedLessons}
            total={total}
            showCount
            className="mt-4"
          />
          <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary">
            {completedLessons < total ? 'Continue' : 'Review'}
            <span aria-hidden>→</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
