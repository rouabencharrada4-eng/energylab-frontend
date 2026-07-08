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
      const viewportH = window.innerHeight

      // Progress tracks the container as it passes through the viewport:
      //  - 0 when its top crosses the "start" line (near the bottom of the screen)
      //  - 1 when its bottom crosses the "end" line (near the top of the screen)
      // Because it's derived from rect.top only, it's monotonic and reversible,
      // so scrolling up and down both land on the same fill amount.
      const start = viewportH * 0.85
      const end = viewportH * 0.15
      const totalDistance = rect.height + (start - end)

      if (totalDistance <= 0) return

      const scrolled = start - rect.top
      let progress = scrolled / totalDistance
      progress = Math.min(Math.max(progress, 0), 1)

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
          transition: "stroke-dashoffset 0.1s ease-out",
        }}
      />
    </svg>
  )
}