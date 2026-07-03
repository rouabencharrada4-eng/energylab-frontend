import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@clerk/clerk-react"
import { servicesApi, coachesApi, timeSlotsApi, setAuthToken } from "@/lib/api"

export function useServices() {
  const { getToken } = useAuth()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true)
      const token = await getToken()
      setAuthToken(token)
      const res = await servicesApi.getAll()
      setServices(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load services")
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => { fetchServices() }, [fetchServices])

  const createService = async (data) => {
    const token = await getToken()
    setAuthToken(token)
    await servicesApi.create(data)
    await fetchServices()
  }

  const updateService = async (id, data) => {
    const token = await getToken()
    setAuthToken(token)
    await servicesApi.update(id, data)
    await fetchServices()
  }

  const removeService = async (id) => {
    const token = await getToken()
    setAuthToken(token)
    await servicesApi.remove(id)
    await fetchServices()
  }

  return { services, loading, error, refetch: fetchServices, createService, updateService, removeService }
}

export function useCoaches() {
  const { getToken } = useAuth()
  const [coaches, setCoaches] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCoaches = useCallback(async () => {
    try {
      const token = await getToken()
      setAuthToken(token)
      const res = await coachesApi.getAll()
      setCoaches(res.data)
    } catch {
      // non-critical
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => { fetchCoaches() }, [fetchCoaches])

  return { coaches, loading, refetch: fetchCoaches }
}

export function useTimeSlots(params) {
  const { getToken } = useAuth()
  const [timeSlots, setTimeSlots] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSlots = useCallback(async () => {
    if (!params) { setLoading(false); return }
    try {
      const token = await getToken()
      setAuthToken(token)
      const res = await timeSlotsApi.getAll(params)
      setTimeSlots(res.data)
    } catch {
      setTimeSlots([])
    } finally {
      setLoading(false)
    }
  }, [getToken, JSON.stringify(params)])

  useEffect(() => { fetchSlots() }, [fetchSlots])

  return { timeSlots, loading, refetch: fetchSlots }
}