import { createContext, useContext, useCallback, useState, useEffect } from 'react'

const STORAGE_KEY = 'croporia-learning-progress'
const ProgressContext = createContext(null)

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(() => {
    try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : {} } catch { return {} }
  })

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)) } catch {}
  }, [progress])

  const setLessonCompleted = useCallback((courseId, lessonId, quizScore) => {
    setProgress(prev => ({ ...prev, [courseId]: { ...prev[courseId], [lessonId]: { completed: true, quizScore } } }))
  }, [])

  const isLessonCompleted = useCallback((courseId, lessonId) => {
    return progress[courseId]?.[lessonId]?.completed ?? false
  }, [progress])

  const getCourseProgress = useCallback((courseId, totalLessons) => {
    const course = progress[courseId] ?? {}
    const completed = Object.values(course).filter(p => p.completed).length
    return { completed, percent: totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0 }
  }, [progress])

  const getStageProgress = useCallback((courseId, _stageIndex, lessonIds) => {
    const course = progress[courseId] ?? {}
    const completed = lessonIds.filter(id => course[id]?.completed).length
    return { completed, percent: lessonIds.length > 0 ? Math.round((completed / lessonIds.length) * 100) : 0 }
  }, [progress])

  const isStageUnlocked = useCallback((courseId, stageIndex, stages) => {
    if (stageIndex === 0) return true
    const prev = stages[stageIndex - 1]
    const ids = prev.lessons.map(l => l.id)
    const { completed } = getStageProgress(courseId, stageIndex - 1, ids)
    return completed === ids.length
  }, [progress, getStageProgress])

  return (
    <ProgressContext.Provider value={{ progress, setLessonCompleted, isLessonCompleted, getCourseProgress, getStageProgress, isStageUnlocked }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
