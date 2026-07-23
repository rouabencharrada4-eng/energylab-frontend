// src/lib/api.js
import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  headers: { "Content-Type": "application/json" },
})

// Called once from App.jsx after Clerk loads
let _getToken = null

export function initApiAuth(getToken) {
  _getToken = getToken
}

api.interceptors.request.use(async (config) => {
  if (_getToken) {
    try {
      const token = await Promise.race([
        _getToken({ skipCache: true }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("getToken timeout")), 5000)
        ),
      ])
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`
      } else {
        console.warn("[API] getToken returned null — not signed in?")
      }
    } catch (e) {
      console.error("[API] getToken failed:", e)
    }
  }
  return config
})

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
  uploadImage: (id, file) => {
    const form = new FormData()
    form.append("file", file)
    return api.post(`/services/${id}/image`, form, { headers: { "Content-Type": "multipart/form-data" } })
  },
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
  getAll:       ()                       => api.get("/bookings"),
  getMine:      ()                       => api.get("/bookings/me"),
  create:       (data)                   => api.post("/bookings", data),
  updateStatus: (id, status, adminNotes) => api.patch(`/bookings/${id}/status`, { status, admin_notes: adminNotes }),
  cancel:       (id)                     => api.patch(`/bookings/${id}/status`, { status: "cancelled" }),
}

export const announcementsApi = {
  getActive: ()         => api.get("/announcements/active"),
  getAll:    ()         => api.get("/announcements"),
  create:    (data)     => api.post("/announcements", data),
  update:    (id, data) => api.put(`/announcements/${id}`, data),
  remove:    (id)       => api.delete(`/announcements/${id}`),
}

export const siteContentApi = {
  get:    ()       => api.get("/site-content"),
  update: (values) => api.put("/site-content", { values }),
}

export const galleryApi = {
  getPublic: ()         => api.get("/gallery"),
  getAll:    ()         => api.get("/gallery/all"),
  add:       (file, caption, sortOrder) => {
    const form = new FormData()
    form.append("file", file)
    form.append("caption", caption || "")
    form.append("sort_order", sortOrder ?? 0)
    return api.post("/gallery", form, { headers: { "Content-Type": "multipart/form-data" } })
  },
  update: (id, data) => api.put(`/gallery/${id}`, data),
  remove: (id)       => api.delete(`/gallery/${id}`),
}

export const showcaseApi = {
  getPublic: () => api.get("/showcase"),
}

export const eventsApi = {
  getActive: ()         => api.get("/events/active"),
  getAll:    ()         => api.get("/events"),
  create:    (data)     => api.post("/events", data),
  update:    (id, data) => api.put(`/events/${id}`, data),
  remove:    (id)       => api.delete(`/events/${id}`),
  uploadImage: (id, file) => {
    const form = new FormData()
    form.append("file", file)
    return api.post(`/events/${id}/image`, form, { headers: { "Content-Type": "multipart/form-data" } })
  },
}
export default api

export const heroImagesApi = {
  getPublic: () => api.get("/hero-images"),
  getAll:    () => api.get("/hero-images/all"),
  add:       (file, sortOrder) => {
    const form = new FormData()
    form.append("file", file)
    form.append("sort_order", sortOrder ?? 0)
    return api.post("/hero-images", form, { headers: { "Content-Type": "multipart/form-data" } })
  },
  update: (id, data) => api.put(`/hero-images/${id}`, data),
  remove: (id)       => api.delete(`/hero-images/${id}`),
}
export const analyticsApi = {
  getDashboard: (params) => api.get("/analytics/dashboard", { params }),
}