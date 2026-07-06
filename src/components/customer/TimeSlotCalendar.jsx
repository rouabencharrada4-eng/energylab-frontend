import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn, formatDate, formatTime } from "@/lib/utils"

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

function dateKey(year, month, day) {
  const mm = String(month + 1).padStart(2, "0")
  const dd = String(day).padStart(2, "0")
  return `${year}-${mm}-${dd}`
}

export default function TimeSlotCalendar({ timeSlots, slotId, onSelect }) {
  const [viewDate, setViewDate]         = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const [selectedDate, setSelectedDate] = useState(null)

  const slotsByDate = useMemo(() => {
    const map = {}
    for (const slot of timeSlots) {
      const key = slot.date
      if (!map[key]) map[key] = []
      map[key].push(slot)
    }
    for (const key in map) {
      map[key].sort((a, b) => a.start_time.localeCompare(b.start_time))
    }
    return map
  }, [timeSlots])

  const availableDates = useMemo(() => Object.keys(slotsByDate).sort(), [slotsByDate])

  const selectedSlot = timeSlots.find(s => s.id === slotId)
  const activeDate   = selectedDate ?? selectedSlot?.date ?? availableDates[0] ?? null

  const year         = viewDate.getFullYear()
  const month        = viewDate.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth  = new Date(year, month + 1, 0).getDate()
  const today        = startOfToday()

  const cells = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const handleDayClick = (day) => {
    const key = dateKey(year, month, day)
    if (!slotsByDate[key]) return
    setSelectedDate(key)
  }

  const slotsForActiveDate = activeDate ? (slotsByDate[activeDate] ?? []) : []

  if (availableDates.length === 0) {
    return (
      <p className="text-sm text-muted-foreground border border-input rounded-lg px-3 py-6 text-center">
        No available time slots for this service right now. Please check back later.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <div className="border border-input rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={() => setViewDate(new Date(year, month - 1, 1))}
            className="p-1 rounded hover:bg-accent"
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <p className="text-sm font-medium">
            {viewDate.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
          </p>
          <button
            type="button"
            onClick={() => setViewDate(new Date(year, month + 1, 1))}
            className="p-1 rounded hover:bg-accent"
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-1">
          {WEEKDAYS.map(w => <div key={w}>{w}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} />
            const key       = dateKey(year, month, day)
            const hasSlots  = !!slotsByDate[key]
            const isPast    = new Date(year, month, day) < today
            const isActive  = key === activeDate
            const disabled  = !hasSlots || isPast
            return (
              <button
                type="button"
                key={key}
                disabled={disabled}
                onClick={() => handleDayClick(day)}
                className={cn(
                  "h-8 text-xs rounded-md flex items-center justify-center transition-colors",
                  disabled && "text-muted-foreground/30 cursor-not-allowed",
                  hasSlots && !isPast && !isActive && "text-foreground font-medium hover:bg-accent",
                  isActive && "bg-primary text-primary-foreground font-semibold"
                )}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>

      {activeDate && (
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground">
            Available times on {formatDate(activeDate)}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {slotsForActiveDate.map(slot => (
              <button
                type="button"
                key={slot.id}
                onClick={() => onSelect(slot.id)}
                className={cn(
                  "text-sm rounded-lg border px-3 py-2 text-left transition-colors",
                  slot.id === slotId
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-input hover:bg-accent"
                )}
              >
                <div>{formatTime(slot.start_time)} – {formatTime(slot.end_time)}</div>
                {slot.coach && (
                  <div className="text-xs text-muted-foreground">{slot.coach.full_name}</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}