import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("croporia_token")
  if (!token) return <Navigate to="/login" replace />
  if (requiredRole) {
    const user = JSON.parse(localStorage.getItem("croporia_user") || "null")
    if (user?.role !== requiredRole) {
      return <Navigate to={user?.role === "Expert" ? "/expert-dashboard" : "/user-dashboard"} replace />
    }
  }
  return children
}