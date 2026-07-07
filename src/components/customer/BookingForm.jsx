import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useServices, useCoaches, useTimeSlots } from "@/hooks/useServices"
import TimeSlotCalendar from "@/components/customer/TimeSlotCalendar"
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

  // Only Private Coaching and Pilates can be booked through this form —
  // the Inbody Machine service doesn't use a coach, so it's excluded here.
  const bookableServices = services.filter(s => s.is_active && s.requires_coach)

  const serviceItems = bookableServices.map(s => ({ value: s.id, label: s.name }))

  const coachItems = [
    { value: "", label: "Any" },
    ...filteredCoaches.map(c => ({ value: c.id, label: c.full_name })),
  ]


  return (
    <div className="space-y-5 rounded-2xl border-2 border-primary p-6">
      <div className="space-y-1.5">
        <Label>Service</Label>
        <Select value={serviceId} onValueChange={setServiceId} disabled={servicesLoading} items={serviceItems}>
          <SelectTrigger className="w-full border-primary/50 focus-visible:border-primary">
            <SelectValue placeholder={servicesLoading ? "Loading services..." : "Select a service"} />
          </SelectTrigger>
          <SelectContent>
            {bookableServices.map(s => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {servicesError && (
          <p className="text-sm text-destructive">
            Couldn't load services: {servicesError}
          </p>
        )}
        {!servicesLoading && !servicesError && bookableServices.length === 0 && (
          <p className="text-sm text-muted-foreground">No services available right now.</p>
        )}
      </div>

      {selectedService?.requires_coach && (
        <div className="space-y-1.5">
          <Label>Coach (optional)</Label>
          <Select value={coachId} onValueChange={setCoachId} items={coachItems}>
            <SelectTrigger className="w-full border-primary/50 focus-visible:border-primary">
              <SelectValue placeholder="Any available coach" />
            </SelectTrigger>
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
          <TimeSlotCalendar timeSlots={timeSlots} slotId={slotId} onSelect={setSlotId} />
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
          placeholder="+216 xx xxx xxx"
          aria-invalid={phoneInvalid}
          required
          className="border-primary/50 focus-visible:border-primary"
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
          className="border-primary/50 focus-visible:border-primary"
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