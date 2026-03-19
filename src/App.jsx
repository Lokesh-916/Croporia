import { Routes, Route } from 'react-router-dom'
import Home from './pages/index'
import CropsIndex from './pages/crops/index'
import CropDetail from './pages/crops/[slug]'
import PracticesIndex from './pages/practices/index'
import PracticeDetail from './pages/practices/[slug]'
import FieldsIndex from './pages/fields/index'
import FieldNew from './pages/fields/new'
import CommunityIndex from './pages/community/index'
import Login from './pages/auth/login'
import Signup from './pages/auth/signup'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <div className="antialiased font-sans">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/crops" element={<CropsIndex />} />
        <Route path="/crops/:slug" element={<CropDetail />} />
        <Route path="/practices" element={<PracticesIndex />} />
        <Route path="/practices/:slug" element={<PracticeDetail />} />
        <Route path="/fields" element={<FieldsIndex />} />
        <Route path="/fields/new" element={<FieldNew />} />
        <Route 
          path="/community" 
          element={
            <ProtectedRoute>
              <CommunityIndex />
            </ProtectedRoute>
          } 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  )
}

export default App
