// src/components/admin/ShowcaseForm.jsx
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
  align: "left",
  bookable: false,
  is_active: true,
}

export default function ShowcaseForm({ open, onClose, onSave, initial = null }) {
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
          <DialogTitle>{initial ? "Edit Card" : "Add Card"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Private Coaching" />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} />
          </div>
          <div className="space-y-1.5">
            <Label>Image alignment</Label>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant={form.align === "left" ? "default" : "outline"}
                onClick={() => set("align", "left")} className={form.align === "left" ? "bg-primary text-primary-foreground" : ""}>
                Left
              </Button>
              <Button type="button" size="sm" variant={form.align === "right" ? "default" : "outline"}
                onClick={() => set("align", "right")} className={form.align === "right" ? "bg-primary text-primary-foreground" : ""}>
                Right
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label>Show "Book Now" button</Label>
            <Switch checked={form.bookable} onCheckedChange={v => set("bookable", v)} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Visible on site</Label>
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