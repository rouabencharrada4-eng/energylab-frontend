import { useState, useEffect, useRef } from "react"
import { X, Sparkles } from "lucide-react"

const POLL_MS = 60_000
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

// Publishes the banner's real rendered height as a CSS var (--announcement-h)
// so the fixed Navbar and the Hero section can reserve space for it instead
// of guessing a fixed offset and colliding with it.
function usePublishedHeight(active, ref) {
  useEffect(() => {
    const root = document.documentElement

    if (!active || !ref.current) {
      root.style.setProperty("--announcement-h", "0px")
      return
    }

    const el = ref.current
    const update = () => root.style.setProperty("--announcement-h", `${el.offsetHeight}px`)
    update()

    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [active, ref])

  useEffect(() => () => document.documentElement.style.setProperty("--announcement-h", "0px"), [])
}

export default function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState(null)
  const [dismissed, setDismissed] = useState(false)
  const barRef = useRef(null)

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

  const visible = !dismissed && !!announcement
  usePublishedHeight(visible, barRef)

  return (
    <div
      className="fixed top-0 inset-x-0 z-[70] overflow-hidden transition-[max-height] duration-300 ease-out"
      style={{ maxHeight: visible ? 56 : 0 }}
      aria-hidden={!visible}
    >
      <div
        ref={barRef}
        className="relative flex items-center justify-center gap-2 bg-primary px-12 py-2.5 text-center border-b border-primary-foreground/10"
      >
        <Sparkles size={13} className="text-primary-foreground/80 shrink-0" strokeWidth={1.5} />
        <span className="text-[11px] md:text-xs tracking-widest uppercase text-primary-foreground font-medium">
          {announcement?.content}
        </span>
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-200"
          aria-label="Dismiss announcement"
        >
          <X size={14} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}