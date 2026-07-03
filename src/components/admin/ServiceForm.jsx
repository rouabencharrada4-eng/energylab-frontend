import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

const empty = {
  name: "",
  description: "",
  duration_minutes: 60,
  max_capacity: 1,
  requires_coach: true,
  is_active: true,
}

export default function ServiceForm({ open, onClose, onSave, initial = null }) {
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm(initial ? { ...empty, ...initial } : empty)
  }, [initial, open])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async () => {
    setSaving(true)
    await onSave(form)
    setSaving(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Service" : "Add Service"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Private Coaching" />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={e => set("description", e.target.value)} rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Duration (min)</Label>
              <Input type="number" value={form.duration_minutes} onChange={e => set("duration_minutes", +e.target.value)} min={15} step={15} />
            </div>
            <div className="space-y-1.5">
              <Label>Max Capacity</Label>
              <Input type="number" value={form.max_capacity} onChange={e => set("max_capacity", +e.target.value)} min={1} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label>Requires Coach</Label>
            <Switch checked={form.requires_coach} onCheckedChange={v => set("requires_coach", v)} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Active</Label>
            <Switch checked={form.is_active} onCheckedChange={v => set("is_active", v)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving || !form.name}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}