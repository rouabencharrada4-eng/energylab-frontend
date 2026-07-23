// src/hooks/useCurrentUser.js
import { useState, useEffect, useCallback } from "react"
import { useUser } from "@clerk/clerk-react"
import { usersApi } from "@/lib/api"

// Right after an OAuth sign-in, the Clerk webhook that creates the matching
// row in our DB can lag a beat behind the frontend redirect. A 404 here means
// "sync pending," not "no such user" — so retry briefly instead of failing.
const MAX_RETRIES = 5
const RETRY_DELAY_MS = 800

export function useCurrentUser() {
  const { isLoaded, isSignedIn } = useUser()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchUser = useCallback(async () => {
    if (!isLoaded) return
    if (!isSignedIn) {
      setUser(null)
      setLoading(false)
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
        const syncPending = err.response?.status === 404
        if (syncPending && attempt < MAX_RETRIES - 1) {
          await new Promise(r => setTimeout(r, RETRY_DELAY_MS))
          continue
        }
        setError(err.response?.data?.detail || "Failed to load your account")
        setLoading(false)
        return
      }
    }
  }, [isLoaded, isSignedIn])

  useEffect(() => { fetchUser() }, [fetchUser])

  return { user, loading, error, refetch: fetchUser }
}