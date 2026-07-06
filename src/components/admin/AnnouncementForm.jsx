import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

const empty = { content: "", is_active: true, starts_at: "", ends_at: "" }

// <input type="datetime-local"> works in naive local wall-clock time (no
// timezone offset), but the backend stores/compares UTC (datetime.utcnow()).
// These helpers convert at the boundary so "2:30 PM" in the admin's browser
// really means 2:30 PM there, not 2:30 PM UTC.
function utcIsoToLocalInput(utcIso) {
  if (!utcIso) return ""
  const d = new Date(utcIso)
  const tzOffsetMs = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - tzOffsetMs).toISOString().slice(0, 16)
}

function localInputToUtcIso(localValue) {
  return localValue ? new Date(localValue).toISOString() : null
}

export default function AnnouncementForm({ open, onClose, onSave, initial = null }) {
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm(initial ? {
      ...empty,
      ...initial,
      starts_at: utcIsoToLocalInput(initial.starts_at),
      ends_at:   utcIsoToLocalInput(initial.ends_at),
    } : empty)
  }, [initial, open])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async () => {
    setSaving(true)
    await onSave({
      ...form,
      starts_at: localInputToUtcIso(form.starts_at),
      ends_at:   localInputToUtcIso(form.ends_at),
    })
    setSaving(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Announcement" : "New Announcement"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Banner Text</Label>
            <Textarea
              value={form.content}
              onChange={e => set("content", e.target.value)}
              placeholder="e.g. 🎉 10% OFF all sessions this week!"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Starts At (optional)</Label>
              <Input type="datetime-local" value={form.starts_at ?? ""} onChange={e => set("starts_at", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Ends At (optional)</Label>
              <Input type="datetime-local" value={form.ends_at ?? ""} onChange={e => set("ends_at", e.target.value)} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label>Active</Label>
            <Switch checked={form.is_active} onCheckedChange={v => set("is_active", v)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving || !form.content}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}