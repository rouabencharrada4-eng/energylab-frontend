import { useState } from "react"
import { useServices } from "@/hooks/useServices"
import ServiceForm from "@/components/admin/ServiceForm"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Clock, Users } from "lucide-react"

export default function AdminServices() {
  const { services, loading, createService, updateService, removeService } = useServices()
  const [formOpen, setFormOpen] = useState(false)
  const [editing,  setEditing]  = useState(null)

  const handleSave  = data => editing ? updateService(editing.id, data) : createService(data)
  const handleEdit  = s    => { setEditing(s); setFormOpen(true) }
  const handleClose = ()   => { setFormOpen(false); setEditing(null) }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-semibold">Services</h1>
        <Button onClick={() => setFormOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <Plus size={16} /> Add Service
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map(s => (
            <div key={s.id} className="rounded-lg border border-border/60 bg-card p-5 space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">{s.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  s.is_active ? "bg-green-500/10 text-green-400" : "bg-muted text-muted-foreground"
                }`}>
                  {s.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              {s.description && <p className="text-xs text-muted-foreground">{s.description}</p>}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock size={11} /> {s.duration_minutes}m</span>
                <span className="flex items-center gap-1"><Users size={11} /> Cap. {s.max_capacity}</span>
              </div>
              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="outline" onClick={() => handleEdit(s)} className="h-7 text-xs gap-1.5">
                  <Pencil size={11} /> Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => removeService(s.id)}
                  className="h-7 text-xs border-destructive/40 text-destructive hover:bg-destructive/10 gap-1.5">
                  <Trash2 size={11} /> Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ServiceForm open={formOpen} onClose={handleClose} onSave={handleSave} initial={editing} />
    </div>
  )
}