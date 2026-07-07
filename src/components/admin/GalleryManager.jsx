// src/components/admin/GalleryManager.jsx
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, ArrowUp, ArrowDown, Loader2 } from "lucide-react"

export default function GalleryManager({ images, loading, addImage, updateImage, removeImage, reorder }) {
  const [uploading, setUploading] = useState(false)
  const [captionDrafts, setCaptionDrafts] = useState({})
  const inputRef = useRef(null)

  const handleAdd = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      await addImage(file, "", images.length)
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const captionFor = (img) => captionDrafts[img.id] ?? img.caption ?? ""

  const commitCaption = (img) => {
    const val = captionDrafts[img.id]
    if (val === undefined || val === img.caption) return
    updateImage(img.id, { caption: val })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground max-w-md">
          These photos scroll in the "Our Space" section on the homepage, in the order shown below.
        </p>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAdd} />
        <Button onClick={() => inputRef.current?.click()} disabled={uploading} size="sm" className="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground shrink-0">
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          {uploading ? "Uploading..." : "Add Photo"}
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : images.length === 0 ? (
        <p className="text-muted-foreground text-sm">No photos yet — add one above.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <div key={img.id} className="rounded-lg border border-border/60 bg-card overflow-hidden">
              <img src={img.image_url} alt={img.caption || ""} className="w-full h-36 object-cover" />
              <div className="p-3 space-y-2.5">
                <Input
                  value={captionFor(img)}
                  onChange={e => setCaptionDrafts(d => ({ ...d, [img.id]: e.target.value }))}
                  onBlur={() => commitCaption(img)}
                  placeholder="Caption"
                  className="text-xs"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch checked={img.is_active} onCheckedChange={v => updateImage(img.id, { is_active: v })} />
                    <span className="text-xs text-muted-foreground">{img.is_active ? "Visible" : "Hidden"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="icon-sm" variant="outline" disabled={i === 0} onClick={() => reorder(img.id, "up")}>
                      <ArrowUp size={12} />
                    </Button>
                    <Button size="icon-sm" variant="outline" disabled={i === images.length - 1} onClick={() => reorder(img.id, "down")}>
                      <ArrowDown size={12} />
                    </Button>
                    <Button size="icon-sm" variant="outline" onClick={() => removeImage(img.id)}
                      className="border-destructive/40 text-destructive hover:bg-destructive/10">
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}