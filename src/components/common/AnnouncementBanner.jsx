import { useState, useEffect } from "react"
import { X } from "lucide-react"

const POLL_MS = 60_000
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

export default function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    setDismissed(false)
  }, [announcement?.id])

  useEffect(() => {
    let cancelled = false

    const fetchActive = () => {
      fetch(`${API_URL}/announcements/active`)
        .then(res => {
          if (!res.ok) return
          return res.json()
        })
        .then(data => {
          if (cancelled) return
          setAnnouncement(data && data.length > 0 ? data[0] : null)
        })
        .catch(() => {})
    }

    fetchActive()
    const interval = setInterval(fetchActive, POLL_MS)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  if (dismissed || !announcement) return null

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] animate-fade-in pointer-events-none">
      <div
        className="flex items-center gap-3 rounded-full px-5 py-2 pointer-events-auto"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <span className="text-[12px] tracking-widest uppercase text-accent font-medium whitespace-nowrap">
          {announcement.content}
        </span>
        <button
          onClick={() => setDismissed(true)}
          className="text-muted-foreground/60 hover:text-accent transition-colors duration-200 ml-1"
          aria-label="Dismiss"
        >
          <X size={13} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}
