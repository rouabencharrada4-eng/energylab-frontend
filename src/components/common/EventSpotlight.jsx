// src/components/common/EventSpotlight.jsx
import { useEffect, useState } from "react"
import { Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

function formatEventDate(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit",
  })
}

function useCountdown(targetIso) {
  const [remaining, setRemaining] = useState(null)

  useEffect(() => {
    if (!targetIso) return
    const target = new Date(targetIso).getTime()

    const tick = () => {
      const diff = Math.max(0, target - Date.now())
      setRemaining({
        d: Math.floor(diff / 86400000),
        h: Math.floor(diff / 3600000) % 24,
        m: Math.floor(diff / 60000) % 60,
        s: Math.floor(diff / 1000) % 60,
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetIso])

  return remaining
}

function CountBox({ value, label }) {
  const [tick, setTick] = useState(false)
  useEffect(() => {
    setTick(true)
    const t = setTimeout(() => setTick(false), 250)
    return () => clearTimeout(t)
  }, [value])

  return (
    <div className="w-14 rounded-[10px] border border-border bg-background py-2 text-center">
      <span
        className={`block font-display font-bold text-xl transition-transform duration-200 ${
          tick ? "-translate-y-[3px] text-accent" : "text-foreground"
        }`}
      >
        {String(value).padStart(2, "0")}
      </span>
      <label className="mt-0.5 block text-[8.5px] uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
    </div>
  )
}

export default function EventSpotlight({ event, eventRef, visible }) {
  const countdown = useCountdown(event.event_date)

  return (
    <div
      ref={eventRef}
      className={`event-glow relative grid overflow-hidden rounded-[22px] border border-border bg-card transition-all duration-700 ease-out md:grid-cols-2 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* image side */}
      <div className="event-kenburns-wrap relative min-h-[220px] md:min-h-full overflow-hidden">
        {event.image_url ? (
          <div className="event-kenburns h-full w-full">
            <img src={event.image_url} alt={event.title} className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="event-kenburns h-full w-full bg-gradient-to-br from-primary/40 via-background to-background" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
        <span className="absolute left-6 top-6 rounded-full border border-white/25 bg-black/20 px-2.5 py-1 text-[10px] uppercase tracking-[.25em] text-foreground/80 backdrop-blur-sm">
          In Studio
        </span>
      </div>

      {/* perforation, desktop only */}
      <div className="event-perforation hidden md:block" />

      {/* info side */}
      <div className="flex flex-col justify-center gap-4 p-8 md:p-10">
        <p className="flex items-center gap-2 text-xs uppercase tracking-[.28em] text-accent">
          <span className="event-live-dot h-1.5 w-1.5 rounded-full bg-accent" />
          Upcoming Event
        </p>

        <h3 className="font-display italic text-3xl md:text-4xl font-semibold leading-tight">
          {event.title}
        </h3>

        {event.description && (
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
            {event.description}
          </p>
        )}

        {countdown && (
          <div className="flex gap-2.5 py-1">
            <CountBox value={countdown.d} label="Days" />
            <CountBox value={countdown.h} label="Hrs" />
            <CountBox value={countdown.m} label="Min" />
            <CountBox value={countdown.s} label="Sec" />
          </div>
        )}

        <div className="flex flex-col gap-1.5 text-xs text-foreground/80">
          {event.event_date && (
            <div className="flex items-center gap-2">
              <Calendar size={13} className="opacity-70" />
              {formatEventDate(event.event_date)}
            </div>
          )}
          <div className="flex items-center gap-2">
            <MapPin size={13} className="opacity-70" />
            Energy Lab Studio
          </div>
        </div>

        <Button className="event-cta mt-1 w-fit bg-primary text-primary-foreground hover:bg-primary/90">
          Reserve Your Spot
        </Button>
      </div>
    </div>
  )
}