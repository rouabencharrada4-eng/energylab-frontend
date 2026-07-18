// src/pages/admin/Events.jsx
import { useRef, useState } from "react"
import { useEvents } from "@/hooks/useWebsiteContent"
import EventForm from "@/components/admin/EventForm"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, Trash2, Upload, Loader2 } from "lucide-react"

function formatEventDate(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit",
  })
}

export default function AdminEvents() {
  const { events, loading, createEvent, updateEvent, removeEvent, uploadImage } = useEvents()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [uploadingId, setUploadingId] = useState(null)
  const fileInputs = useRef({})

  const handleSave = data => editing ? updateEvent(editing.id, data) : createEvent(data)
  const handleEdit = event => { setEditing(event); setFormOpen(true) }
  const handleClose = () => { setFormOpen(false); setEditing(null) }

  const handleImagePick = (id) => fileInputs.current[id]?.click()
  const handleImageChange = async (id, e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingId(id)
    try {
      await uploadImage(id, file)
    } finally {
      setUploadingId(null)
      e.target.value = ""
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold">Events</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Shown on the homepage just above "About Us". Only one shows at a time —
            if several are active, the soonest upcoming one wins.
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <Plus size={16} /> New Event
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : events.length === 0 ? (
        <p className="text-muted-foreground text-sm">No events yet — add one above.</p>
      ) : (
        <div className="space-y-3">
          {events.map(event => (
            <div key={event.id} className="rounded-lg border border-border/60 bg-card p-4 flex items-start gap-4">
              <div className="h-16 w-16 rounded-md border border-border/60 overflow-hidden shrink-0 bg-muted flex items-center justify-center">
                {event.image_url ? (
                  <img src={event.image_url} alt={event.title} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[10px] text-muted-foreground">None</span>
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <h3 className="font-semibold text-sm">{event.title}</h3>
                {event.event_date && (
                  <p className="text-xs text-primary font-medium">{formatEventDate(event.event_date)}</p>
                )}
                {event.description && <p className="text-xs text-muted-foreground line-clamp-2">{event.description}</p>}
                <div className="flex items-center gap-2 pt-1">
                  <Switch checked={event.is_active} onCheckedChange={v => updateEvent(event.id, { is_active: v })} />
                  <span className="text-xs text-muted-foreground">{event.is_active ? "Visible" : "Hidden"}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 shrink-0">
                <input
                  ref={el => (fileInputs.current[event.id] = el)}
                  type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                  onChange={e => handleImageChange(event.id, e)}
                />
                <div className="flex gap-1.5">
                  <Button size="sm" variant="outline" onClick={() => handleImagePick(event.id)} disabled={uploadingId === event.id} className="h-7 text-xs gap-1.5">
                    {uploadingId === event.id ? <Loader2 size={11} className="animate-spin" /> : <Upload size={11} />} Image
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(event)} className="h-7 text-xs gap-1.5">
                    <Pencil size={11} /> Edit
                  </Button>
                </div>
                <Button size="sm" variant="outline" onClick={() => removeEvent(event.id)}
                  className="h-7 text-xs border-destructive/40 text-destructive hover:bg-destructive/10">
                  <Trash2 size={11} /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <EventForm open={formOpen} onClose={handleClose} onSave={handleSave} initial={editing} />
    </div>
  )
}