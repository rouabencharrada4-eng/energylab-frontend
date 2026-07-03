import { useUser } from "@clerk/clerk-react"
import { Navigate } from "react-router-dom"

export function ProtectedRoute({ children, requireAdmin = false }) {
  const { isLoaded, isSignedIn, user } = useUser()

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!isSignedIn) return <Navigate to="/" replace />

  if (requireAdmin && user?.publicMetadata?.role !== "admin") {
    return <Navigate to="/dashboard" replace />
  }

  return children
}