// src/pages/admin/Website.jsx
import { useState } from "react"
import { useSiteContent, useGallery, useShowcase } from "@/hooks/useWebsiteContent"
import SiteContentEditor from "@/components/admin/SiteContentEditor"
import GalleryManager from "@/components/admin/GalleryManager"
import ShowcaseManager from "@/components/admin/ShowcaseManager"
import { cn } from "@/lib/utils"

const TABS = [
  { id: "content",  label: "Page Content" },
  { id: "gallery",  label: "Gallery" },
  { id: "showcase", label: "What We Offer" },
]

export default function AdminWebsite() {
  const [tab, setTab] = useState("content")

  const content  = useSiteContent()
  const gallery  = useGallery()
  const showcase = useShowcase()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-semibold">Website</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Edit the homepage's text, images, and gallery — changes go live as soon as you save.
        </p>
      </div>

      <div className="flex gap-1 border-b border-border/60">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
              tab === t.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "content" && (
        <SiteContentEditor
          values={content.values}
          loading={content.loading}
          saveValues={content.saveValues}
        />
      )}

      {tab === "gallery" && (
        <GalleryManager
          images={gallery.images}
          loading={gallery.loading}
          addImage={gallery.addImage}
          updateImage={gallery.updateImage}
          removeImage={gallery.removeImage}
          reorder={gallery.reorder}
        />
      )}

      {tab === "showcase" && (
        <ShowcaseManager
          items={showcase.items}
          loading={showcase.loading}
          createItem={showcase.createItem}
          updateItem={showcase.updateItem}
          removeItem={showcase.removeItem}
          uploadImage={showcase.uploadImage}
          reorder={showcase.reorder}
        />
      )}
    </div>
  )
}
