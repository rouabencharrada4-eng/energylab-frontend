// src/components/admin/SiteContentEditor.jsx
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, Loader2, Save } from "lucide-react"

// key -> label, for every text field the admin can edit.
// Grouped into sections purely for layout; the backend just stores flat key/value pairs.
const SECTIONS = [
  {
    title: "Hero",
    fields: [
      { key: "hero_title_line1", label: "Title — line 1" },
      { key: "hero_title_line2", label: "Title — line 2" },
      { key: "hero_tagline", label: "Tagline" },
    ],
    images: [{ key: "hero_bg_url", label: "Background image" }],
  },
  {
    title: "About",
    fields: [
      { key: "about_heading", label: "Section label" },
      { key: "about_paragraph_1", label: "Paragraph 1", area: true },
      { key: "about_paragraph_2", label: "Paragraph 2", area: true },
      { key: "about_paragraph_3", label: "Paragraph 3", area: true },
      { key: "about_paragraph_4", label: "Paragraph 4", area: true },
    ],
    images: [{ key: "about_image_url", label: "About image" }],
  },
  {
    title: "Our Space",
    fields: [
      { key: "space_heading", label: "Heading" },
      { key: "space_subheading", label: "Subheading", area: true },
    ],
  },
  {
    title: "Contact",
    fields: [
      { key: "contact_location", label: "Location" },
      { key: "contact_phone", label: "Phone" },
      { key: "contact_email", label: "Email" },
      { key: "map_query", label: "Map search query (address or 'lat,lng')" },
    ],
  },
  {
    title: "Branding",
    images: [{ key: "logo_url", label: "Logo" }],
  },
]

function ImageField({ fieldKey, label, value, onUpload }) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      await onUpload(fieldKey, file)
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <div className="h-16 w-16 rounded-md border border-border/60 overflow-hidden shrink-0 bg-muted flex items-center justify-center">
          {value ? (
            <img src={value} alt={label} className="h-full w-full object-cover" />
          ) : (
            <span className="text-[10px] text-muted-foreground">None</span>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
        <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => inputRef.current?.click()} className="gap-1.5">
          {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
          {uploading ? "Uploading..." : "Replace"}
        </Button>
      </div>
    </div>
  )
}

export default function SiteContentEditor({ values, loading, saveValues, uploadImage }) {
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)

  useEffect(() => { setForm(values) }, [values])

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    setDirty(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveValues(form)
      setDirty(false)
      setSavedFlash(true)
      setTimeout(() => setSavedFlash(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (key, file) => {
    await uploadImage(key, file)
    setDirty(false)
  }

  if (loading) return <p className="text-muted-foreground text-sm">Loading...</p>

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur-sm py-2 z-10 -mx-1 px-1">
        <p className="text-xs text-muted-foreground">
          Edits here update the live homepage immediately after saving.
        </p>
        <Button onClick={handleSave} disabled={saving || !dirty} size="sm" className="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {savedFlash ? "Saved" : saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {SECTIONS.map(section => (
        <div key={section.title} className="rounded-lg border border-border/60 bg-card p-5 space-y-4">
          <h3 className="text-sm font-semibold text-accent uppercase tracking-widest">{section.title}</h3>

          {section.fields?.map(({ key, label, area }) => (
            <div key={key} className="space-y-1.5">
              <Label>{label}</Label>
              {area ? (
                <Textarea value={form[key] ?? ""} onChange={e => set(key, e.target.value)} rows={3} />
              ) : (
                <Input value={form[key] ?? ""} onChange={e => set(key, e.target.value)} />
              )}
            </div>
          ))}

          {section.images?.map(({ key, label }) => (
            <ImageField key={key} fieldKey={key} label={label} value={form[key]} onUpload={handleImageUpload} />
          ))}
        </div>
      ))}
    </div>
  )
}