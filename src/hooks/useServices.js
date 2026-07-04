import { useState, useEffect, useCallback } from "react"
import { servicesApi, coachesApi, timeSlotsApi } from "@/lib/api"

export function useServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true)
      const res = await servicesApi.getAll()
      setServices(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load services")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchServices() }, [fetchServices])

  const createService = async (data) => {
    await servicesApi.create(data)
    await fetchServices()
  }

  const updateService = async (id, data) => {
    await servicesApi.update(id, data)
    await fetchServices()
  }

  const removeService = async (id) => {
    await servicesApi.remove(id)
    await fetchServices()
  }

  return { services, loading, error, refetch: fetchServices, createService, updateService, removeService }
}

export function useCoaches() {
  const [coaches, setCoaches] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCoaches = useCallback(async () => {
    try {
      const res = await coachesApi.getAll()
      setCoaches(res.data)
    } catch {
      // non-critical
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCoaches() }, [fetchCoaches])

  return { coaches, loading, refetch: fetchCoaches }
}

export function useTimeSlots(params) {
  const [timeSlots, setTimeSlots] = useState([])
  const [loading, setLoading]     = useState(true)

  const fetchSlots = useCallback(async () => {
    if (!params) { setLoading(false); return }
    try {
      const res = await timeSlotsApi.getAll(params)
      setTimeSlots(res.data)
    } catch {
      setTimeSlots([])
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => { fetchSlots() }, [fetchSlots])

  return { timeSlots, loading, refetch: fetchSlots }
}