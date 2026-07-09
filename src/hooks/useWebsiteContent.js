// src/hooks/useWebsiteContent.js
import { useState, useEffect, useCallback } from "react"
import { siteContentApi, galleryApi, showcaseApi } from "@/lib/api"

export function useSiteContent() {
  const [values, setValues] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true)
      const res = await siteContentApi.get()
      setValues(res.data.values || {})
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load site content")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchContent() }, [fetchContent])

  const saveValues = async (patch) => {
    const res = await siteContentApi.update(patch)
    setValues(v => ({ ...v, ...res.data.values }))
  }

  return { values, loading, error, refetch: fetchContent, saveValues }
}

export function useGallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true)
      const res = await galleryApi.getAll()
      setImages(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load gallery")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchImages() }, [fetchImages])

  const addImage = async (file, caption, sortOrder) => {
    await galleryApi.add(file, caption, sortOrder)
    await fetchImages()
  }

  const updateImage = async (id, data) => {
    await galleryApi.update(id, data)
    await fetchImages()
  }

  const removeImage = async (id) => {
    await galleryApi.remove(id)
    await fetchImages()
  }

  // Swap sort_order with the neighboring image to move up/down in the list.
  const reorder = async (id, direction) => {
    const idx = images.findIndex(i => i.id === id)
    const swapIdx = direction === "up" ? idx - 1 : idx + 1
    if (idx === -1 || swapIdx < 0 || swapIdx >= images.length) return
    const a = images[idx]
    const b = images[swapIdx]
    await Promise.all([
      galleryApi.update(a.id, { sort_order: b.sort_order }),
      galleryApi.update(b.id, { sort_order: a.sort_order }),
    ])
    await fetchImages()
  }

  return { images, loading, error, refetch: fetchImages, addImage, updateImage, removeImage, reorder }
}

export function useShowcase() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true)
      const res = await showcaseApi.getAll()
      setItems(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load showcase items")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  const createItem = async (data) => {
    await showcaseApi.create(data)
    await fetchItems()
  }

  const updateItem = async (id, data) => {
    await showcaseApi.update(id, data)
    await fetchItems()
  }

  const removeItem = async (id) => {
    await showcaseApi.remove(id)
    await fetchItems()
  }

  const uploadImage = async (id, file) => {
    await showcaseApi.uploadImage(id, file)
    await fetchItems()
  }

  const reorder = async (id, direction) => {
    const idx = items.findIndex(i => i.id === id)
    const swapIdx = direction === "up" ? idx - 1 : idx + 1
    if (idx === -1 || swapIdx < 0 || swapIdx >= items.length) return
    const a = items[idx]
    const b = items[swapIdx]
    await Promise.all([
      showcaseApi.update(a.id, { sort_order: b.sort_order }),
      showcaseApi.update(b.id, { sort_order: a.sort_order }),
    ])
    await fetchItems()
  }

  return { items, loading, error, refetch: fetchItems, createItem, updateItem, removeItem, uploadImage, reorder }
}