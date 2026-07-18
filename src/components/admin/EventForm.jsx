// src/components/admin/EventForm.jsx
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

const empty = { title: "", description: "", event_date: "", is_active: true }

// <input type="datetime-local"> works in naive local wall-clock time (no
// timezone offset), but the backend stores/compares UTC. These helpers
// convert at the boundary so "6:00 PM" in the admin's browser really means
// 6:00 PM there, not 6:00 PM UTC. (Same pattern as AnnouncementForm.)
function utcIsoToLocalInput(utcIso) {
  if (!utcIso) return ""
  const d = new Date(utcIso)
  const tzOffsetMs = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - tzOffsetMs).toISOString().slice(0, 16)
}

function localInputToUtcIso(localValue) {
  return localValue ? new Date(localValue).toISOString() : null
}

export default function EventForm({ open, onClose, onSave, initial = null }) {
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setForm(initial ? {
      ...empty,
      ...initial,
      event_date: utcIsoToLocalInput(initial.event_date),
    } : empty)
  }, [initial, open])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleClose = () => { setError(null); onClose() }

  const handleSubmit = async () => {
    setSaving(true)
    setError(null)
    try {
      await onSave({
        ...form,
        event_date: localInputToUtcIso(form.event_date),
      })
      handleClose()
    } catch (e) {
      console.error("Failed to save event:", e)
      setError("Failed to save. Check that you're signed in and the server is running.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Event" : "New Event"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Summer Pilates Workshop" />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} />
          </div>
          <div className="space-y-1.5">
            <Label>Date & Time (optional)</Label>
            <Input type="datetime-local" value={form.event_date ?? ""} onChange={e => set("event_date", e.target.value)} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Visible on site</Label>
            <Switch checked={form.is_active} onCheckedChange={v => set("is_active", v)} />
          </div>
        </div>

        <DialogFooter>
          {error && <p className="text-sm text-destructive w-full">{error}</p>}
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving || !form.title}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}