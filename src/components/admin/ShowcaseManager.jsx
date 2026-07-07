// src/components/admin/ShowcaseManager.jsx
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import ShowcaseForm from "@/components/admin/ShowcaseForm"
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Upload, Loader2 } from "lucide-react"

export default function ShowcaseManager({ items, loading, createItem, updateItem, removeItem, uploadImage, reorder }) {
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [uploadingId, setUploadingId] = useState(null)
  const fileInputs = useRef({})

  const handleSave = data => editing ? updateItem(editing.id, data) : createItem(data)
  const handleEdit = item => { setEditing(item); setFormOpen(true) }
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
        <p className="text-xs text-muted-foreground max-w-md">
          These are the cards in the "What We Offer" section on the homepage, top to bottom.
        </p>
        <Button onClick={() => setFormOpen(true)} size="sm" className="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground shrink-0">
          <Plus size={14} /> Add Card
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground text-sm">No cards yet — add one above.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={item.id} className="rounded-lg border border-border/60 bg-card p-4 flex items-start gap-4">
              <div className="h-16 w-16 rounded-md border border-border/60 overflow-hidden shrink-0 bg-muted flex items-center justify-center">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[10px] text-muted-foreground">None</span>
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">{item.name}</h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {item.align === "right" ? "Image right" : "Image left"}
                  </span>
                  {item.bookable && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">Bookable</span>
                  )}
                </div>
                {item.description && <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>}
                <div className="flex items-center gap-2 pt-1">
                  <Switch checked={item.is_active} onCheckedChange={v => updateItem(item.id, { is_active: v })} />
                  <span className="text-xs text-muted-foreground">{item.is_active ? "Visible" : "Hidden"}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 shrink-0">
                <input
                  ref={el => (fileInputs.current[item.id] = el)}
                  type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                  onChange={e => handleImageChange(item.id, e)}
                />
                <div className="flex gap-1.5">
                  <Button size="sm" variant="outline" onClick={() => handleImagePick(item.id)} disabled={uploadingId === item.id} className="h-7 text-xs gap-1.5">
                    {uploadingId === item.id ? <Loader2 size={11} className="animate-spin" /> : <Upload size={11} />} Image
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(item)} className="h-7 text-xs gap-1.5">
                    <Pencil size={11} /> Edit
                  </Button>
                </div>
                <div className="flex gap-1.5">
                  <Button size="icon-sm" variant="outline" disabled={i === 0} onClick={() => reorder(item.id, "up")}>
                    <ArrowUp size={12} />
                  </Button>
                  <Button size="icon-sm" variant="outline" disabled={i === items.length - 1} onClick={() => reorder(item.id, "down")}>
                    <ArrowDown size={12} />
                  </Button>
                  <Button size="icon-sm" variant="outline" onClick={() => removeItem(item.id)}
                    className="border-destructive/40 text-destructive hover:bg-destructive/10">
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ShowcaseForm open={formOpen} onClose={handleClose} onSave={handleSave} initial={editing} />
    </div>
  )
}