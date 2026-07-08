import { useEffect, useRef } from "react"

const VB_W = 200
const VB_H = 900

/**
 * ScrollFilament
 * Draws a winding line down its parent container that grows
 * from top to bottom as the user scrolls.
 *
 * Note: with vector-effect: non-scaling-stroke, browsers compute
 * stroke-dasharray/offset in SCREEN pixels (and ignore pathLength),
 * so we sample the path and measure its true on-screen length.
 */
export default function ScrollFilament({ className = "", strokeWidth = 4 }) {
  const svgRef = useRef(null)
  const pathRef = useRef(null)
  const screenLenRef = useRef(0)
  const progressRef = useRef(0)

  const d = `
    M 30 0
    C 30 150, 170 100, 170 300
    C 170 500, 30 400, 30 600
    C 30 800, 100 750, 100 900
  `

  useEffect(() => {
    const svg = svgRef.current
    const path = pathRef.current
    if (!svg || !path) return

    function apply() {
      const len = screenLenRef.current
      if (!len) return
      path.style.strokeDasharray = `${len} ${len}`
      path.style.strokeDashoffset = String(len * (1 - progressRef.current))
    }

    // Measure the path's length in *screen* pixels by sampling it in
    // user space and scaling each segment by the current stretch factors.
    function measure() {
      const total = path.getTotalLength()
      const sx = svg.clientWidth / VB_W
      const sy = svg.clientHeight / VB_H
      if (!total || !sx || !sy) return

      const SAMPLES = 200
      let len = 0
      let prev = path.getPointAtLength(0)
      for (let i = 1; i <= SAMPLES; i++) {
        const p = path.getPointAtLength((i / SAMPLES) * total)
        len += Math.hypot((p.x - prev.x) * sx, (p.y - prev.y) * sy)
        prev = p
      }
      screenLenRef.current = len
      apply()
    }

    function handleScroll() {
      const parent = svg.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const viewportH = window.innerHeight

      const startTrigger = rect.top - viewportH * 0.7
      const endTrigger = rect.bottom - viewportH * 0.3
      const totalDistance = endTrigger - startTrigger
      if (totalDistance <= 0) return

      let progress = -startTrigger / totalDistance
      progressRef.current = Math.min(Math.max(progress, 0), 1)
      apply()
    }

    // Re-measure whenever the container resizes (images loading, breakpoints…)
    const ro = new ResizeObserver(() => {
      measure()
      handleScroll()
    })
    ro.observe(svg)

    measure()
    handleScroll()

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll)
    return () => {
      ro.disconnect()
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VB_W} ${VB_H}`}
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
          // dasharray/offset are set in JS in screen-pixel units
          strokeDasharray: "0 999999",
          transition: "stroke-dashoffset 0.1s ease-out",
        }}
      />
    </svg>
  )
}