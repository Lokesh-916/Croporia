export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct: number
  explanation: string
}

export interface Lesson {
  id: string
  title: string
  content: string
  diagram: string
  intuition: string
  keyTakeaways: string[]
  quiz: { questions: QuizQuestion[] }
}

export interface Stage {
  id: string
  title: string
  lessons: Lesson[]
}

export interface Course {
  id: string
  title: string
  description: string
  icon: string
  stages: Stage[]
}

export interface CoursesData {
  courses: Course[]
}
