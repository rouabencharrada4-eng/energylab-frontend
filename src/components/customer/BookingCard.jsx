import { Button } from "@/components/ui/button"
import { Calendar, Clock, User } from "lucide-react"
import { formatDate, formatTime, BOOKING_STATUS } from "@/lib/utils"

export default function BookingCard({ booking, onCancel }) {
  const status = BOOKING_STATUS[booking.status]
  const slot   = booking.time_slot

  return (
    <div className="rounded-lg border border-border/60 bg-card p-5 space-y-4">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-base">{slot?.service?.name}</h3>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${status.color}`}>
          {status.label}
        </span>
      </div>

      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar size={14} />
          <span>{formatDate(slot?.date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} />
          <span>{formatTime(slot?.start_time)} – {formatTime(slot?.end_time)}</span>
        </div>
        {slot?.coach && (
          <div className="flex items-center gap-2">
            <User size={14} />
            <span>{slot.coach.full_name}</span>
          </div>
        )}
      </div>

      {booking.admin_notes && (
        <p className="text-xs text-muted-foreground bg-muted rounded px-3 py-2 italic">
          {booking.admin_notes}
        </p>
      )}

      {(booking.status === "pending" || booking.status === "accepted") && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCancel(booking.id)}
          className="w-full border-destructive/40 text-destructive hover:bg-destructive/10"
        >
          Cancel Booking
        </Button>
      )}
    </div>
  )
}