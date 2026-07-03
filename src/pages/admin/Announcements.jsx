import { useEffect, useState } from "react"
import { useAuth } from "@clerk/clerk-react"
import { announcementsApi, setAuthToken } from "@/lib/api"
import AnnouncementForm from "@/components/admin/AnnouncementForm"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default function AdminAnnouncements() {
  const { getToken } = useAuth()
  const [items,    setItems]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing,  setEditing]  = useState(null)

  const load = async () => {
    const token = await getToken()
    setAuthToken(token)
    const res = await announcementsApi.getAll()
    setItems(res.data)
  }

  useEffect(() => { load().catch(() => {}).finally(() => setLoading(false)) }, [])

  const handleSave = async (data) => {
    const token = await getToken()
    setAuthToken(token)
    editing ? await announcementsApi.update(editing.id, data) : await announcementsApi.create(data)
    await load()
  }

  const handleRemove = async (id) => {
    const token = await getToken()
    setAuthToken(token)
    await announcementsApi.remove(id)
    await load()
  }

  const handleClose = () => { setFormOpen(false); setEditing(null) }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-semibold">Announcements</h1>
        <Button onClick={() => setFormOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <Plus size={16} /> New Banner
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : (
        <div className="space-y-3">
          {items.length === 0 && <p className="text-muted-foreground text-sm">No announcements yet.</p>}
          {items.map(item => (
            <div key={item.id} className="rounded-lg border border-border/60 bg-card p-4 flex items-start justify-between gap-4">
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium">{item.content}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className={`px-2 py-0.5 rounded-full ${
                    item.is_active ? "bg-green-500/10 text-green-400" : "bg-muted text-muted-foreground"
                  }`}>
                    {item.is_active ? "Active" : "Inactive"}
                  </span>
                  {item.ends_at && <span>Ends {formatDate(item.ends_at)}</span>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="outline" onClick={() => { setEditing(item); setFormOpen(true) }}
                  className="h-7 text-xs gap-1.5">
                  <Pencil size={11} /> Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleRemove(item.id)}
                  className="h-7 text-xs border-destructive/40 text-destructive hover:bg-destructive/10">
                  <Trash2 size={11} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnnouncementForm open={formOpen} onClose={handleClose} onSave={handleSave} initial={editing} />
    </div>
  )
}