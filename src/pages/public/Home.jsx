import { useEffect, useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { SignInButton, useUser } from "@clerk/clerk-react"
import { Mail, MapPin, Phone } from "lucide-react"
import { servicesApi } from "@/lib/api"
import ScrollFilament from "@/components/common/ScrollFilament"

// Shown until /services returns real data — keeps the page looking
// finished on first load, or if the API isn't reachable yet.
const FALLBACK_SERVICES = [
  {
    id: "fallback-1",
    isDemo: true,
    name: "Private Coaching",
    description: "One-on-one sessions tailored to your goals — strength, conditioning, or a mix, at your pace.",
    image: "/assets/card_3.png",
  },
  {
    id: "fallback-2",
    isDemo: true,
    name: "Pilates",
    description: "Mat and reformer sessions focused on core strength, flexibility, and controlled movement.",
    image: "/assets/card_1.png",
  },
  {
    id: "fallback-3",
    isDemo: true,
    name: "Inbody Analysis",
    description: "Precise body composition analysis to track your progress beyond the scale.",
    image: "/assets/card_2.png",
  },
]

// If your admin-managed order doesn't match card_1/2/3.png, just
// reorder this array — nothing else depends on it.
const CARD_IMAGES = ["/assets/card_1.png", "/assets/card_2.png", "/assets/card_3.png"]

// A single symmetric "S" wave through three points — top-left,
// mid-right, bottom-left — built from two mirrored bezier halves
// with matching vertical tangents at each point, so the curve
// stays perfectly smooth and even top to bottom.
const FILAMENT_PATH = "M 60 0 C 60 300, 340 300, 340 600 C 340 900, 60 900, 60 1200"

const ALIGN = ["justify-start", "justify-end", "justify-start"]

function Reveal({ children, className = "" }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  )
}

export default function Home() {
  const { isSignedIn } = useUser()
  const location = useLocation()
  const [services, setServices] = useState(FALLBACK_SERVICES)

  useEffect(() => {
    servicesApi
      .getAll()
      .then((res) => {
        const active = (res.data || []).filter((s) => s.is_active)
        if (active.length) {
          setServices(
            active.slice(0, 3).map((s, i) => ({ ...s, image: CARD_IMAGES[i % CARD_IMAGES.length] }))
          )
        }
      })
      .catch(() => {
        // Fallback content above covers this.
      })
  }, [])

  // Smooth-scroll to a section when arriving via a #hash — from the
  // navbar, or redirected in from the old /services or /contact URLs.
  useEffect(() => {
    if (!location.hash) return
    const el = document.querySelector(location.hash)
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth" }))
  }, [location])

  return (
    <main>
      {/* ───────────────────────── Hero ───────────────────────── */}
      <section id="home" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden scroll-mt-16">
        <img
          src="/assets/hero-bg.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6 space-y-8">
          <img src="/assets/logo-mark.png" alt="EnergyLab" className="h-16 w-auto mx-auto" />
          <h1 className="text-6xl md:text-8xl font-display font-semibold tracking-tight leading-none uppercase">
            Energy<br />
            <span className="text-primary">Lab</span>
          </h1>
          <p className="text-muted-foreground tracking-widest uppercase text-xs">
            Fitness · Wellness · Pilates
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {isSignedIn ? (
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link to="/book">Book a Session</Link>
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Get Started
                </Button>
              </SignInButton>
            )}
            <a href="#services">
              <Button size="lg" variant="outline">Our Services</Button>
            </a>
          </div>
        </div>
      </section>

      {/* ───────────────────── Services + filament ───────────────────── */}
      <section id="services" className="relative max-w-6xl mx-auto px-6 py-28 scroll-mt-16">
        <Reveal className="mb-20 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-semibold">What We Offer</h2>
          <p className="text-muted-foreground text-sm mt-3">Three ways to work with us — pick your path.</p>
        </Reveal>

        <div className="relative h-[1700px] sm:h-[1900px] md:h-[2000px]">
          <ScrollFilament d={FILAMENT_PATH} strokeWidth={4} />

          <div className="relative h-full flex flex-col justify-between">
            {services.map((s, i) => {
              const alignEnd = ALIGN[i % ALIGN.length] === "justify-end"
              return (
                <div key={s.id ?? s.name} className={`flex ${ALIGN[i % ALIGN.length]}`}>
                  <Reveal
                    className={`flex flex-col ${alignEnd ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-8 lg:gap-10 w-full lg:w-auto max-w-lg text-center ${
                      alignEnd ? "lg:text-right" : "lg:text-left"
                    }`}
                  >
                    {/* Framed image */}
                    <div className="relative shrink-0 w-64 h-80 sm:w-72 sm:h-[26rem] md:w-80 md:h-[30rem]">
                      <div
                        className="absolute -inset-3 rounded-[1.75rem] border border-border/60"
                        aria-hidden="true"
                      />
                      <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border/70 bg-card shadow-2xl shadow-black/40">
                        <img src={s.image} alt={s.name} className="h-full w-full object-cover" />
                      </div>
                    </div>

                    <div className="space-y-3 px-2">
                      <h3 className="text-2xl md:text-3xl font-display font-semibold">{s.name}</h3>
                      {s.description && (
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-[30ch] mx-auto lg:mx-0">
                          {s.description}
                        </p>
                      )}
                      {isSignedIn && !s.isDemo && (
                        <Button asChild size="sm" variant="outline" className="mt-2">
                          <Link to="/book">Book this</Link>
                        </Button>
                      )}
                    </div>
                  </Reveal>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ───────────────────────── CTA band ───────────────────────── */}
      <section className="bg-primary/10 border-y border-primary/20 py-16 px-6 text-center space-y-6">
        <p className="text-2xl font-display font-semibold">Ready to start your journey?</p>
        {isSignedIn ? (
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link to="/book">Book Now</Link>
          </Button>
        ) : (
          <SignInButton mode="modal">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Create an Account
            </Button>
          </SignInButton>
        )}
      </section>

      {/* ───────────────────────── Contact ───────────────────────── */}
      <section id="contact" className="max-w-3xl mx-auto px-6 py-24 space-y-12 scroll-mt-16">
        <Reveal className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-display font-semibold">Get in Touch</h2>
          <p className="text-muted-foreground text-sm">We'd love to hear from you.</p>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { icon: MapPin, label: "Location", value: "123 Energy Street\nTunis, Tunisia" },
            { icon: Phone, label: "Phone", value: "+216 XX XXX XXX" },
            { icon: Mail, label: "Email", value: "hello@energylab.tn" },
          ].map(({ icon: Icon, label, value }) => (
            <Reveal key={label}>
              <div className="rounded-lg border border-border/60 bg-card p-6 flex flex-col items-center gap-3 text-center h-full">
                <Icon size={22} className="text-primary" />
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground whitespace-pre-line">{value}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  )
}