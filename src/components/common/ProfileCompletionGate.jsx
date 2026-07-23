// src/components/common/ProfileCompletionGate.jsx
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useCurrentUser } from "@/hooks/useCurrentUser"

// Renders nothing — just watches auth + profile state on every navigation
// and bounces customers with an incomplete profile to /complete-profile,
// no matter where they land right after logging in (home, dashboard, a
// deep link, anywhere). Mainly catches Google/Facebook sign-ups, which
// skip the fields the password sign-up form collects.
const EXEMPT_PATHS = ["/complete-profile", "/sso-callback"]

export function ProfileCompletionGate() {
  const { user, loading } = useCurrentUser()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading || !user) return
    if (EXEMPT_PATHS.includes(location.pathname)) return
    if (user.role !== "customer") return
    if (user.profile_complete) return
    navigate("/complete-profile", { replace: true })
  }, [loading, user, location.pathname, navigate])

  return null
}