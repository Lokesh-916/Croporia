import React, { createContext, useContext, useCallback, useState, useEffect } from 'react'

const STORAGE_KEY = 'croporia-learning-progress'

export interface LessonProgress {
  completed: boolean
  quizScore?: number
}

export interface ProgressState {
  [courseId: string]: {
    [lessonId: string]: LessonProgress
  }
}

interface ProgressContextValue {
  progress: ProgressState
  setLessonCompleted: (courseId: string, lessonId: string, quizScore?: number) => void
  isLessonCompleted: (courseId: string, lessonId: string) => boolean
  getCourseProgress: (courseId: string, totalLessons: number) => { completed: number; percent: number }
  getStageProgress: (courseId: string, stageIndex: number, lessonIds: string[]) => { completed: number; percent: number }
  isStageUnlocked: (courseId: string, stageIndex: number, stages: { lessons: { id: string }[] }[]) => boolean
}

const defaultState: ProgressState = {}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : defaultState
    } catch {
      return defaultState
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch {}
  }, [progress])

  const setLessonCompleted = useCallback((courseId: string, lessonId: string, quizScore?: number) => {
    setProgress((prev) => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        [lessonId]: { completed: true, quizScore },
      },
    }))
  }, [])

  const isLessonCompleted = useCallback(
    (courseId: string, lessonId: string) => progress[courseId]?.[lessonId]?.completed ?? false,
    [progress]
  )

  const getCourseProgress = useCallback(
    (courseId: string, totalLessons: number) => {
      const course = progress[courseId] ?? {}
      const completed = Object.values(course).filter((p) => p.completed).length
      const percent = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0
      return { completed, percent }
    },
    [progress]
  )

  const getStageProgress = useCallback(
    (courseId: string, _stageIndex: number, lessonIds: string[]) => {
      const course = progress[courseId] ?? {}
      const completed = lessonIds.filter((id) => course[id]?.completed).length
      const percent = lessonIds.length > 0 ? Math.round((completed / lessonIds.length) * 100) : 0
      return { completed, percent }
    },
    [progress]
  )

  const isStageUnlocked = useCallback(
    (courseId: string, stageIndex: number, stages: { lessons: { id: string }[] }[]) => {
      if (stageIndex === 0) return true
      const prevStage = stages[stageIndex - 1]
      const lessonIds = prevStage.lessons.map((l) => l.id)
      const { completed } = getStageProgress(courseId, stageIndex - 1, lessonIds)
      return completed === lessonIds.length
    },
    [progress, getStageProgress]
  )

  const value: ProgressContextValue = {
    progress,
    setLessonCompleted,
    isLessonCompleted,
    getCourseProgress,
    getStageProgress,
    isStageUnlocked,
  }

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
