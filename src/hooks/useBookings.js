import { useState, useEffect, useCallback } from "react"
import { bookingsApi } from "@/lib/api"

export function useBookings(adminMode = false) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true)
      const res = adminMode ? await bookingsApi.getAll() : await bookingsApi.getMine()
      setBookings(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }, [adminMode])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  const updateStatus = async (id, status, adminNotes = "") => {
    await bookingsApi.updateStatus(id, status, adminNotes)
    await fetchBookings()
  }

  const cancelBooking = async (id) => {
    await bookingsApi.cancel(id)
    await fetchBookings()
  }

  const createBooking = async (data) => {
    await bookingsApi.create(data)
    await fetchBookings()
  }

  return { bookings, loading, error, refetch: fetchBookings, updateStatus, cancelBooking, createBooking }
}