import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useServices, useCoaches, useTimeSlots } from "@/hooks/useServices"
import { formatDate, formatTime } from "@/lib/utils"

// A phone number is considered valid if it has at least 8 digits,
// optionally prefixed with + and containing spaces/dashes/parentheses.
const PHONE_REGEX = /^\+?[0-9\s()-]{8,20}$/

export default function BookingForm({ onSubmit, loading }) {
  const { services, loading: servicesLoading, error: servicesError }  = useServices()
  const { coaches }   = useCoaches()
  const [serviceId, setServiceId] = useState("")
  const [coachId,   setCoachId]   = useState("")
  const [slotId,    setSlotId]    = useState("")
  const [phone,     setPhone]     = useState("")
  const [notes,     setNotes]     = useState("")
  const [phoneTouched, setPhoneTouched] = useState(false)

  const { timeSlots } = useTimeSlots(
    serviceId ? { service_id: serviceId, ...(coachId ? { coach_id: coachId } : {}) } : null
  )

  useEffect(() => { setCoachId(""); setSlotId("") }, [serviceId])
  useEffect(() => { setSlotId("") }, [coachId])

  const selectedService  = services.find(s => s.id === serviceId)
  const filteredCoaches  = coaches.filter(c => c.services?.some(s => s.id === serviceId))

  const phoneValid   = PHONE_REGEX.test(phone.trim())
  const phoneInvalid = phoneTouched && !phoneValid

  const serviceItems = services
    .filter(s => s.is_active)
    .map(s => ({ value: s.id, label: s.name }))

  const coachItems = [
    { value: "", label: "Any" },
    ...filteredCoaches.map(c => ({ value: c.id, label: c.full_name })),
  ]

  const slotItems = timeSlots.map(slot => ({
    value: slot.id,
    label: `${formatDate(slot.date)} · ${formatTime(slot.start_time)} – ${formatTime(slot.end_time)}${slot.coach ? ` · ${slot.coach.full_name}` : ""}`,
  }))

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label>Service</Label>
        <Select value={serviceId} onValueChange={setServiceId} disabled={servicesLoading} items={serviceItems}>
          <SelectTrigger>
            <SelectValue placeholder={servicesLoading ? "Loading services..." : "Select a service"} />
          </SelectTrigger>
          <SelectContent>
            {services.filter(s => s.is_active).map(s => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {servicesError && (
          <p className="text-sm text-destructive">
            Couldn't load services: {servicesError}
          </p>
        )}
        {!servicesLoading && !servicesError && services.length === 0 && (
          <p className="text-sm text-muted-foreground">No services available right now.</p>
        )}
      </div>

      {selectedService?.requires_coach && (
        <div className="space-y-1.5">
          <Label>Coach (optional)</Label>
          <Select value={coachId} onValueChange={setCoachId} items={coachItems}>
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
          <Select value={slotId} onValueChange={setSlotId} items={slotItems}>
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
        <Label htmlFor="customer-phone">Phone Number</Label>
        <Input
          id="customer-phone"
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          onBlur={() => setPhoneTouched(true)}
          placeholder="e.g. 12 345 678"
          aria-invalid={phoneInvalid}
          required
        />
        {phoneInvalid && (
          <p className="text-sm text-destructive">
            Please enter a valid phone number so we can reach you about this booking.
          </p>
        )}
      </div>

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
        onClick={() => {
          if (!phoneValid) {
            setPhoneTouched(true)
            return
          }
          onSubmit({ time_slot_id: slotId, customer_phone: phone.trim(), customer_notes: notes })
        }}
        disabled={!slotId || !phoneValid || loading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {loading ? "Requesting..." : "Request Booking"}
      </Button>
    </div>
  )
}