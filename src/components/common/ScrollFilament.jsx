import { useEffect, useRef, useState } from "react"

/**
 * ScrollFilament
 *
 * A single line that "draws" itself in as the section scrolls through
 * the viewport — pure SVG + a scroll listener, no animation library.
 *
 * `d` is authored in the local viewBox coordinate space (see default
 * below). Color reads --el-filament from globals.css so it can be
 * swapped independently of --primary / --accent while you test palettes.
 */
export default function ScrollFilament({ d, viewBox = "0 0 400 1200", strokeWidth = 3, className = "" }) {
  const svgRef = useRef(null)
  const pathRef = useRef(null)
  const [length, setLength] = useState(0)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (pathRef.current) {
      const total = pathRef.current.getTotalLength()
      setLength(total)
      setOffset(total)
    }
  }, [d])

  useEffect(() => {
    let raf = null

    const update = () => {
      raf = null
      const el = svgRef.current
      if (!el || !length) return

      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight

      // 0 as the section's top enters the viewport, 1 once its
      // bottom has scrolled past the top of the viewport.
      const progress = (vh - rect.top) / (rect.height + vh)
      const clamped = Math.min(1, Math.max(0, progress))

      setOffset(length * (1 - clamped))
    }

    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(update)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    update()

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [length])

  return (
    <svg
      ref={svgRef}
      viewBox={viewBox}
      preserveAspectRatio="none"
      className={`absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    >
      {/* faint full track, always visible */}
      <path
        d={d}
        fill="none"
        stroke="hsl(var(--el-filament))"
        strokeOpacity="0.15"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* the segment that draws itself in as you scroll */}
      <path
        ref={pathRef}
        d={d}
        fill="none"
        stroke="hsl(var(--el-filament))"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={length}
        strokeDashoffset={offset}
      />
    </svg>
  )
}