import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { X } from "lucide-react"
import { announcementsApi } from "@/lib/api"

// Refetch the active announcement whenever the visitor lands back on "/",
// plus a periodic poll. This component is mounted once, permanently,
// outside <Routes> (so Navbar/Footer/banner persist across pages) — that
// means a plain `useEffect(..., [])` only ever fetches once, at the moment
// the tab was first opened. Without this, an announcement created in the
// admin dashboard never appears until the visitor does a hard refresh.
const POLL_MS = 60_000

export default function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState(null)
  const [dismissed, setDismissed] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    let cancelled = false

    const fetchActive = () => {
      announcementsApi.getActive()
        .then(res => {
          if (cancelled) return
          setAnnouncement(res.data.length > 0 ? res.data[0] : null)
        })
        .catch(() => {})
    }

    fetchActive()
    const interval = setInterval(fetchActive, POLL_MS)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [pathname === "/"]) // re-run the effect when navigating to/away from home

  if (dismissed || !announcement) return null

  return (
    <div className="relative bg-primary text-primary-foreground text-center text-sm py-2.5 px-10">
      <p className="tracking-wide">{announcement.content}</p>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  )
}