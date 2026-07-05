import { useEffect, useRef, useState } from "react"
import { useLocation, Link } from "react-router-dom"
import { SignInButton, useUser } from "@clerk/clerk-react"
import { Button } from "@/components/ui/button"
import { Mail, MapPin, Phone } from "lucide-react"
import ScrollFilament from "@/components/common/ScrollFilament"

const showcase = [
  {
    id: "coaching",
    name: "Private Coaching",
    image: "/assets/card_1.png",
    tagline: "One-on-one, built around you",
    description:
      "Strength, conditioning, or a mix of both — a dedicated coach designs every session around your goals and pace.",
    align: "left",
  },
  {
    id: "inbody",
    name: "Inbody Analysis",
    image: "/assets/card_3.png",
    tagline: "Know your numbers",
    description:
      "Precise body composition scans that track real progress — muscle, fat, water — far beyond what a scale can tell you.",
    align: "right",
  },
  {
    id: "pilates",
    name: "Pilates",
    image: "/assets/card_2.png",
    tagline: "Control, core, calm",
    description:
      "Mat and reformer sessions focused on controlled movement, flexibility, and a stronger core.",
    align: "left",
  },
]

// Placeholder gallery — swap these for real studio photos whenever they're ready.
// Each entry just needs a src and a short caption.
const gallery = [
  { src: "/assets/hero-bg.jpg", caption: "The studio floor" },
  { src: "/assets/card_2.png",  caption: "Reformer room" },
  { src: "/assets/card_3.png",  caption: "Equipment & mats" },
  { src: "/assets/card_1.png",  caption: "Private coaching space" },
]

function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return [ref, visible]
}

function ShowcaseCard({ item }) {
  const [ref, visible] = useReveal()
  const isRight = item.align === "right"

  return (
    <div
      ref={ref}
      className={`flex flex-col md:flex-row items-center gap-8 md:gap-10 md:w-[85%] transition-all duration-700 ease-out ${
        isRight ? "md:flex-row-reverse md:ml-auto" : "md:mr-auto"
      } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-48 md:w-56 rounded-xl border border-border/60 shadow-lg object-cover aspect-[2/3] shrink-0"
      />
      <div className={`space-y-3 ${isRight ? "md:text-right" : "text-left"}`}>
        <p className="text-xs uppercase tracking-widest text-accent">{item.tagline}</p>
        <h3 className="text-2xl font-display font-semibold">{item.name}</h3>
        <p className={`text-sm text-muted-foreground leading-relaxed max-w-xs ${isRight ? "md:ml-auto" : ""}`}>
          {item.description}
        </p>
      </div>
    </div>
  )
}

function GalleryTile({ src, caption }) {
  const [ref, visible] = useReveal()
  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden rounded-xl border border-border/60 aspect-[4/5] transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <img
        src={src}
        alt={caption}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <p className="text-xs uppercase tracking-widest text-white">{caption}</p>
      </div>
    </div>
  )
}

export default function Home() {
  const { isSignedIn } = useUser()
  const location = useLocation()

  // Coming from another page via a "/#hash" link — scroll once mounted.
  useEffect(() => {
    if (!location.hash) return
    const el = document.querySelector(location.hash)
    if (el) {
      const t = setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 60)
      return () => clearTimeout(t)
    }
  }, [location.hash])

  return (
    <main>
      {/* Hero */}
      <section
        id="hero"
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <img
            src="/assets/hero-bg.jpg"
            alt=""
            className="h-full w-full object-cover opacity-70"
          />
          {/* light burgundy wash — tints the photo without hiding it */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-primary/15 to-background/90" />
          {/* gentle edge vignette only — center stays clear so the photo reads */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,hsl(var(--background)/0.85)_100%)]" />
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto px-6 space-y-8">
          <img
            src="/assets/logo-mark.png"
            alt="EnergyLab"
            className="h-16 w-auto mx-auto invert drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
          />
          <h1 className="text-6xl md:text-8xl font-display font-semibold tracking-tight leading-none uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            Energy<br />
            <span className="text-primary">Lab</span>
          </h1>
          <p className="text-accent tracking-widest uppercase text-xs drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
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
            <Button asChild size="lg" variant="outline" className="bg-background/60 backdrop-blur-sm">
              <a href="#services">Our Services</a>
            </Button>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="max-w-3xl mx-auto px-6 py-24 text-center space-y-6 scroll-mt-16">
        <p className="text-xs uppercase tracking-widest text-accent">Who we are</p>
        <h2 className="text-3xl md:text-4xl font-display font-semibold">About Energy Lab</h2>
        <p className="text-muted-foreground leading-relaxed">
          Energy Lab is a Pilates and wellness studio built around one idea: movement should make
          you feel better, not just tired. Every session is paced around the breath — slow, controlled,
          intentional — so strength builds without strain on the body.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Whether you're here for private coaching, a Pilates class, or an Inbody check-in, our space
          is designed to be calm, uncluttered, and welcoming — good for the body, and just as good for
          the mind.
        </p>
      </section>

      {/* Our Space — gallery */}
      <section id="space" className="max-w-6xl mx-auto px-6 py-24 scroll-mt-16">
        <div className="text-center space-y-3 mb-14">
          <p className="text-xs uppercase tracking-widest text-accent">Take a look inside</p>
          <h2 className="text-3xl md:text-4xl font-display font-semibold">Our Space</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            A quiet, modern studio designed for focus — here's a glimpse before you visit.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {gallery.map((g) => (
            <GalleryTile key={g.src + g.caption} src={g.src} caption={g.caption} />
          ))}
        </div>
      </section>

      {/* Services — staggered cards + scroll filament */}
      <section id="services" className="relative max-w-4xl mx-auto px-6 py-28 scroll-mt-16">
        <h2 className="text-3xl md:text-4xl font-display font-semibold mb-20 text-center">
          What We Offer
        </h2>

        <div className="relative">
          <ScrollFilament className="hidden md:block" />
          <div className="relative z-10 flex flex-col gap-20 md:gap-28">
            {showcase.map((item) => (
              <ShowcaseCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
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

      {/* Contact */}
      <section id="contact" className="max-w-3xl mx-auto px-6 py-24 space-y-12 scroll-mt-16">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-display font-semibold">Get in Touch</h2>
          <p className="text-muted-foreground text-sm">We'd love to hear from you.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { icon: MapPin, label: "Location", value: "123 Energy Street\nTunis, Tunisia" },
            { icon: Phone,  label: "Phone",    value: "+216 XX XXX XXX" },
            { icon: Mail,   label: "Email",    value: "hello@energylab.tn" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-lg border border-border/60 bg-card p-6 flex flex-col items-center gap-3 text-center">
              <Icon size={22} className="text-primary" />
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground whitespace-pre-line">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}