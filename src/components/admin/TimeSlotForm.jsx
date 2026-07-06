import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useServices, useCoaches } from "@/hooks/useServices"

const empty = {
  service_id: "",
  coach_id:   "",
  date:       "",
  start_time: "",
  end_time:   "",
  capacity:   "",
  is_active:  true,
}

export default function TimeSlotForm({ open, onClose, onSave, initial = null }) {
  const { services } = useServices()
  const { coaches }   = useCoaches()
  const [form, setForm]     = useState(empty)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (initial) {
      setForm({
        service_id: initial.service_id ?? initial.service?.id ?? "",
        coach_id:   initial.coach_id   ?? initial.coach?.id   ?? "",
        date:       initial.date ?? "",
        start_time: initial.start_time ? initial.start_time.slice(0, 5) : "",
        end_time:   initial.end_time   ? initial.end_time.slice(0, 5)   : "",
        capacity:   initial.capacity ?? "",
        is_active:  initial.is_active ?? true,
      })
    } else {
      setForm(empty)
    }
  }, [initial, open])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const selectedService = services.find(s => s.id === form.service_id)
  const isEditing = !!initial?.id

  const valid = form.service_id && form.date && form.start_time && form.end_time
    && form.end_time > form.start_time

  const handleSubmit = async () => {
    if (!valid) return
    setSaving(true)
    try {
      await onSave({
        service_id: form.service_id,
        coach_id:   form.coach_id || null,
        date:       form.date,
        start_time: form.start_time,
        end_time:   form.end_time,
        capacity:   form.capacity ? Number(form.capacity) : null,
        is_active:  form.is_active,
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Time Slot" : "Add Time Slot"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Service</Label>
            <Select value={form.service_id} onValueChange={v => set("service_id", v)}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select a service" /></SelectTrigger>
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
              <Select value={form.coach_id} onValueChange={v => set("coach_id", v)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Any available coach" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any</SelectItem>
                  {coaches.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.full_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Date</Label>
            <Input type="date" value={form.date} onChange={e => set("date", e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Start Time</Label>
              <Input type="time" value={form.start_time} onChange={e => set("start_time", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>End Time</Label>
              <Input type="time" value={form.end_time} onChange={e => set("end_time", e.target.value)} />
            </div>
          </div>
          {form.start_time && form.end_time && form.end_time <= form.start_time && (
            <p className="text-sm text-destructive -mt-2">End time must be after start time.</p>
          )}

          <div className="space-y-1.5">
            <Label>Capacity (optional)</Label>
            <Input
              type="number"
              min={1}
              value={form.capacity}
              onChange={e => set("capacity", e.target.value)}
              placeholder={selectedService ? `Default: ${selectedService.max_capacity}` : "Uses service default"}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Active</Label>
            <Switch checked={form.is_active} onCheckedChange={v => set("is_active", v)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving || !valid}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}