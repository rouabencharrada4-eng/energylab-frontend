import { useEffect, useLayoutEffect, useRef, useState } from "react"

/**
 * ScrollFilament
 * Draws a winding line down its parent container that grows perfectly
 * from top to bottom as the user scrolls.
 */
export default function ScrollFilament({ className = "", strokeWidth = 4 }) {
  const svgRef = useRef(null)
  const pathRef = useRef(null)
  const [length, setLength] = useState(0)

  // Hand-tuned coordinates spaced out cleanly to match 3 alternating layout rows:
  // Row 1 (Top): Starts left, sweeps right towards the image
  // Row 2 (Middle): Sweeps smoothly back left towards the second image
  // Row 3 (Bottom): Sweeps back right/center to finish out the section
  const d = `
    M 30 0
    C 30 150, 170 100, 170 300
    C 170 500, 30 400, 30 600
    C 30 800, 100 750, 100 900
  `

  useLayoutEffect(() => {
    if (pathRef.current) {
      setLength(pathRef.current.getTotalLength())
    }
  }, [])

  useEffect(() => {
    if (!length) return

    const svg = svgRef.current
    if (!svg) return

    function handleScroll() {
      const parent = svg.parentElement
      if (!parent || !pathRef.current) return

      const rect = parent.getBoundingClientRect()
      const viewportHeight = window.innerHeight

      // Track relative to when the top of the container enters the viewport
      // up until the bottom leaves the viewport
      const start = rect.top - viewportHeight
      const end = rect.bottom
      const totalRange = end - start

      if (totalRange <= 0) return

      const currentPos = -start
      let progress = currentPos / totalRange

      // Clamp progress precisely between 0 and 1
      progress = Math.min(Math.max(progress, 0), 1)

      // Animate stroke smoothly down the screen
      pathRef.current.style.strokeDashoffset = String(length * (1 - progress))
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll)
    
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
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
      {/* Visual background guide track */}
      <path
        d={d}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{ stroke: "hsl(var(--muted-foreground))", opacity: 0.15 }}
      />
      {/* Gold filling line */}
      <path
        ref={pathRef}
        d={d}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{
          stroke: "hsl(var(--el-filament))",
          strokeDasharray: `${length} ${length}`,
          strokeDashoffset: length,
          transition: "stroke-dashoffset 0.15s ease-out",
        }}
      />
    </svg>
  )
}