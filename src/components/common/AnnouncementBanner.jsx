import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { announcementsApi } from "@/lib/api"

export default function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    announcementsApi.getActive()
      .then(res => { if (res.data.length > 0) setAnnouncement(res.data[0]) })
      .catch(() => {})
  }, [])

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