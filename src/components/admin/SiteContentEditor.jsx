// src/components/admin/SiteContentEditor.jsx
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Save } from "lucide-react"

// key -> label, for every text field the admin can edit.
// Grouped into sections purely for layout; the backend just stores flat key/value pairs.
//
// Deliberately NOT editable here (kept fixed in code):
//   - Hero (title/tagline/background image)
//   - About image (about_us.png)
//   - Our Space heading/subheading — photos for this section are managed
//     from the separate "Gallery" tab instead
//   - Branding (logo)
const SECTIONS = [
  {
    title: "About",
    fields: [
      { key: "about_heading", label: "Section label" },
      { key: "about_text", label: "Paragraph", area: true },
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
]

export default function SiteContentEditor({ values, loading, saveValues }) {
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
                <Textarea value={form[key] ?? ""} onChange={e => set(key, e.target.value)} rows={key === "about_text" ? 8 : 3} />
              ) : (
                <Input value={form[key] ?? ""} onChange={e => set(key, e.target.value)} />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
