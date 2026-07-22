// src/components/admin/HeroImagesManager.jsx
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, ArrowUp, ArrowDown, Loader2 } from "lucide-react"

export default function HeroImagesManager({ images, loading, addImage, updateImage, removeImage, reorder }) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)

  const handleAdd = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    try {
      // Upload sequentially so sort_order (based on current length) stays correct for each.
      for (const file of files) {
        await addImage(file, images.length)
      }
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground max-w-md">
          These photos rotate as the homepage hero background, cross-fading every 2 seconds in the order
          shown below. The title, tagline, and buttons stay fixed on top. Upload just one photo to keep
          a static background.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleAdd}
        />
        <Button onClick={() => inputRef.current?.click()} disabled={uploading} size="sm" className="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground shrink-0">
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          {uploading ? "Uploading..." : "Add Photos"}
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : images.length === 0 ? (
        <p className="text-muted-foreground text-sm">No slideshow photos yet — add some above. Until then the default hero background is used.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <div key={img.id} className="rounded-lg border border-border/60 bg-card overflow-hidden">
              <img src={img.image_url} alt="" className="w-full aspect-video object-cover" />
              <div className="p-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch checked={img.is_active} onCheckedChange={v => updateImage(img.id, { is_active: v })} />
                    <span className="text-xs text-muted-foreground">{img.is_active ? "In rotation" : "Hidden"}</span>
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