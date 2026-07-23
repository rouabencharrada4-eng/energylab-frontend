// src/context/CurrentUserContext.jsx
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { useUser } from "@clerk/clerk-react"
import { usersApi } from "@/lib/api"

const CurrentUserContext = createContext(undefined)

// Right after an OAuth sign-in, GET /users/me can fail for a couple of
// transient reasons that are NOT "this user doesn't exist":
//   - 404: the Clerk webhook (or its self-heal fallback) hasn't landed yet.
//   - 401: our axios interceptor forces a fresh Clerk token on every
//     request; if that token fetch is slow right after a redirect, the
//     request goes out with no Authorization header at all.
//   - no response: network hiccup, or the backend is cold-starting.
// All three are worth retrying instead of giving up immediately.
const MAX_RETRIES = 8
const BASE_DELAY_MS = 700

function isRetryable(err) {
  const status = err?.response?.status
  return status === 404 || status === 401 || !err?.response
}

export function CurrentUserProvider({ children }) {
  const { isLoaded, isSignedIn } = useUser()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchUser = useCallback(async () => {
    if (!isLoaded) return
    if (!isSignedIn) {
      setUser(null)
      setLoading(false)
      setError(null)
      return
    }
    setLoading(true)
    setError(null)
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const res = await usersApi.me()
        setUser(res.data)
        setLoading(false)
        return
      } catch (err) {
        if (isRetryable(err) && attempt < MAX_RETRIES - 1) {
          const delay = BASE_DELAY_MS * Math.pow(1.4, attempt)
          await new Promise(r => setTimeout(r, delay))
          continue
        }
        setUser(null)
        setError(err.response?.data?.detail || "Failed to load your account")
        setLoading(false)
        return
      }
    }
  }, [isLoaded, isSignedIn])

  useEffect(() => { fetchUser() }, [fetchUser])

  // Lets a caller that just got a fresh UserOut back from the API (e.g.
  // CompleteProfile after a successful PATCH) push it straight into shared
  // state, instead of every consumer waiting on a second round-trip.
  const setUserDirectly = useCallback((freshUser) => {
    setUser(freshUser)
  }, [])

  const value = { user, loading, error, refetch: fetchUser, setUserDirectly }

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  )
}

export function useCurrentUser() {
  const ctx = useContext(CurrentUserContext)
  if (!ctx) {
    throw new Error("useCurrentUser must be used within a CurrentUserProvider")
  }
  return ctx
}