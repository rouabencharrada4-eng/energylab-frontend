import { useEffect, useLayoutEffect, useRef, useState } from "react"

/**
 * ScrollFilament
 * Draws a winding line down its parent container, then "grows" it in
 * as that container scrolls through the viewport.
 *
 * Drop it as the first child of a `relative` wrapper around your
 * staggered content — it fills that wrapper (100% x 100%) and sits
 * behind the content (keep the content at z-10 or higher).
 *
 * The `d` path below is hand-tuned to weave: left → right → left across
 * a 0–900 tall / 0–200 wide box. If you add/remove rows, stretch the
 * viewBox height and add matching curve segments.
 */
export default function ScrollFilament({ className = "", strokeWidth = 5 }) {
  const svgRef = useRef(null)
  const pathRef = useRef(null)
  const [length, setLength] = useState(0)

  const d = `
    M 40 0
    C 40 150, 160 150, 160 300
    C 160 450, 40 450, 40 600
    C 40 750, 100 800, 100 900
  `

  // Measure before paint so we never flash a fully-solid line.
  useLayoutEffect(() => {
    if (pathRef.current) {
      setLength(pathRef.current.getTotalLength())
    }
  }, [])

  useEffect(() => {
    if (!length) return
    let ticking = false

    function update() {
      const svg = svgRef.current
      if (!svg || !pathRef.current) return
      const rect = svg.getBoundingClientRect()
      const viewportH = window.innerHeight

      // Tied to the viewport's vertical center, so the fill point sits right
      // where your eye is: 0 when the section's top reaches mid-screen,
      // 1 when the section's bottom reaches mid-screen.
      const progress = Math.min(Math.max((viewportH / 2 - rect.top) / rect.height, 0), 1)

      pathRef.current.style.strokeDashoffset = String(length * (1 - progress))
      ticking = false
    }

    function onScroll() {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [length])

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 200 900"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    >
      {/* Always-visible track — shows the full path so the eye can anticipate
          where the line goes before you've scrolled that far. */}
      <path
        d={d}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{ stroke: "hsl(var(--muted-foreground))", opacity: 0.5 }}
      />
      {/* Gold fill — draws in over the track as you scroll, glued to scroll
          position (no transition lag). */}
      <path
        ref={pathRef}
        d={d}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{
          stroke: "hsl(var(--el-filament))",
          strokeDasharray: length,
          strokeDashoffset: length,
        }}
      />
    </svg>
  )
}