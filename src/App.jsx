import { Routes, Route } from 'react-router-dom'
import FloatingChatbot from './components/FloatingChatbot'
import ProtectedRoute from './components/ProtectedRoute'
import { ProgressProvider } from './context/ProgressContext'

import Home from './pages/index'
import CropsIndex from './pages/crops/index'
import CropDetail from './pages/crops/[slug]'
import PracticesIndex from './pages/practices/index'
import PracticeDetail from './pages/practices/[slug]'
import FieldsIndex from './pages/fields/index'
import FieldNew from './pages/fields/new'
import CommunityIndex from './pages/community/index'
import Experts from './pages/experts'
import Assistant from './pages/assistant'
import PestHealth from './pages/pest-health'
import Market from './pages/market'
import Simulator from './pages/simulator'
import Predictor from './pages/predictor'
import Learn from './pages/learn'
import Login from './pages/auth/login'
import Signup from './pages/auth/signup'

function App() {
  return (
    <ProgressProvider>
      <div className="antialiased font-sans relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/crops" element={<CropsIndex />} />
          <Route path="/crops/:slug" element={<CropDetail />} />
          <Route path="/practices" element={<PracticesIndex />} />
          <Route path="/practices/:slug" element={<PracticeDetail />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/predictor" element={<Predictor />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/experts" element={<Experts />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/pest-health" element={<PestHealth />} />
          <Route path="/market" element={<Market />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/community" element={<ProtectedRoute><CommunityIndex /></ProtectedRoute>} />
          <Route path="/fields" element={<ProtectedRoute><FieldsIndex /></ProtectedRoute>} />
          <Route path="/fields/new" element={<ProtectedRoute><FieldNew /></ProtectedRoute>} />
        </Routes>
        <FloatingChatbot />
      </div>
    </ProgressProvider>
  )
}

export default App
