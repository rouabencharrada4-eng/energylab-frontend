import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@clerk/clerk-react"
import { bookingsApi, setAuthToken } from "@/lib/api"

export function useBookings(adminMode = false) {
  const { getToken } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true)
      const token = await getToken()
      setAuthToken(token)
      const res = adminMode ? await bookingsApi.getAll() : await bookingsApi.getMine()
      setBookings(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }, [getToken, adminMode])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  const updateStatus = async (id, status, adminNotes = "") => {
    const token = await getToken()
    setAuthToken(token)
    await bookingsApi.updateStatus(id, status, adminNotes)
    await fetchBookings()
  }

  const cancelBooking = async (id) => {
    const token = await getToken()
    setAuthToken(token)
    await bookingsApi.cancel(id)
    await fetchBookings()
  }

  const createBooking = async (data) => {
    const token = await getToken()
    setAuthToken(token)
    await bookingsApi.create(data)
    await fetchBookings()
  }

  return { bookings, loading, error, refetch: fetchBookings, updateStatus, cancelBooking, createBooking }
}