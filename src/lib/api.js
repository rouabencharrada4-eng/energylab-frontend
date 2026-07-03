import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
})

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common["Authorization"]
  }
}

export const usersApi = {
  me:            ()         => api.get("/users/me"),
  getAll:        ()         => api.get("/users"),
  deleteAccount: ()         => api.delete("/users/me"),
}

export const servicesApi = {
  getAll: ()         => api.get("/services"),
  create: (data)     => api.post("/services", data),
  update: (id, data) => api.put(`/services/${id}`, data),
  remove: (id)       => api.delete(`/services/${id}`),
}

export const coachesApi = {
  getAll: ()         => api.get("/coaches"),
  create: (data)     => api.post("/coaches", data),
  update: (id, data) => api.put(`/coaches/${id}`, data),
  remove: (id)       => api.delete(`/coaches/${id}`),
}

export const timeSlotsApi = {
  getAll: (params)   => api.get("/time-slots", { params }),
  create: (data)     => api.post("/time-slots", data),
  update: (id, data) => api.put(`/time-slots/${id}`, data),
  remove: (id)       => api.delete(`/time-slots/${id}`),
}

export const bookingsApi = {
  getAll:       ()                        => api.get("/bookings"),
  getMine:      ()                        => api.get("/bookings/me"),
  create:       (data)                    => api.post("/bookings", data),
  updateStatus: (id, status, adminNotes)  => api.patch(`/bookings/${id}/status`, { status, admin_notes: adminNotes }),
  cancel:       (id)                      => api.patch(`/bookings/${id}/status`, { status: "cancelled" }),
}

export const announcementsApi = {
  getActive: ()         => api.get("/announcements/active"),
  getAll:    ()         => api.get("/announcements"),
  create:    (data)     => api.post("/announcements", data),
  update:    (id, data) => api.put(`/announcements/${id}`, data),
  remove:    (id)       => api.delete(`/announcements/${id}`),
}

export default api