import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

const empty = { content: "", is_active: true, starts_at: "", ends_at: "" }

export default function AnnouncementForm({ open, onClose, onSave, initial = null }) {
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm(initial ? { ...empty, ...initial } : empty)
  }, [initial, open])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async () => {
    setSaving(true)
    await onSave({ ...form, starts_at: form.starts_at || null, ends_at: form.ends_at || null })
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