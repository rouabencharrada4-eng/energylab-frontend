import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useServices, useCoaches, useTimeSlots } from "@/hooks/useServices"
import { formatDate, formatTime } from "@/lib/utils"

export default function BookingForm({ onSubmit, loading }) {
  const { services }  = useServices()
  const { coaches }   = useCoaches()
  const [serviceId, setServiceId] = useState("")
  const [coachId,   setCoachId]   = useState("")
  const [slotId,    setSlotId]    = useState("")
  const [notes,     setNotes]     = useState("")

  const { timeSlots } = useTimeSlots(
    serviceId ? { service_id: serviceId, ...(coachId ? { coach_id: coachId } : {}) } : null
  )

  useEffect(() => { setCoachId(""); setSlotId("") }, [serviceId])
  useEffect(() => { setSlotId("") }, [coachId])

  const selectedService  = services.find(s => s.id === serviceId)
  const filteredCoaches  = coaches.filter(c => c.services?.some(s => s.id === serviceId))

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label>Service</Label>
        <Select value={serviceId} onValueChange={setServiceId}>
          <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
          <SelectContent>
            {services.filter(s => s.is_active).map(s => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedService?.requires_coach && (
        <div className="space-y-1.5">
          <Label>Coach (optional)</Label>
          <Select value={coachId} onValueChange={setCoachId}>
            <SelectTrigger><SelectValue placeholder="Any available coach" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              {filteredCoaches.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.full_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {serviceId && (
        <div className="space-y-1.5">
          <Label>Available Slot</Label>
          <Select value={slotId} onValueChange={setSlotId}>
            <SelectTrigger><SelectValue placeholder="Pick a time slot" /></SelectTrigger>
            <SelectContent>
              {timeSlots.length === 0 && (
                <SelectItem value="_none" disabled>No slots available</SelectItem>
              )}
              {timeSlots.map(slot => (
                <SelectItem key={slot.id} value={slot.id}>
                  {formatDate(slot.date)} · {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                  {slot.coach ? ` · ${slot.coach.full_name}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-1.5">
        <Label>Notes (optional)</Label>
        <Textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Any context for the coach..."
          rows={2}
        />
      </div>

      <Button
        onClick={() => onSubmit({ time_slot_id: slotId, customer_notes: notes })}
        disabled={!slotId || loading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {loading ? "Requesting..." : "Request Booking"}
      </Button>
    </div>
  )
}