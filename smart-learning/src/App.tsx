import { Routes, Route } from 'react-router-dom'
import { ProgressProvider } from './context/ProgressContext'
import LearningDashboard from './pages/LearningDashboard'
import CoursePage from './pages/CoursePage'
import LessonPage from './pages/LessonPage'
import QuizPage from './pages/QuizPage'

function App() {
  return (
    <ProgressProvider>
      <Routes>
        <Route path="/" element={<LearningDashboard />} />
        <Route path="/course/:courseId" element={<CoursePage />} />
        <Route path="/course/:courseId/lesson/:lessonId" element={<LessonPage />} />
        <Route path="/course/:courseId/lesson/:lessonId/quiz" element={<QuizPage />} />
      </Routes>
    </ProgressProvider>
  )
}

export default App
