// src/pages/public/Home.jsx
import { useCallback, useEffect, useState } from "react"
import { useLocation, Link } from "react-router-dom"
import { SignInButton, useUser } from "@clerk/clerk-react"
import { Button } from "@/components/ui/button"
import { Mail, MapPin, Phone } from "lucide-react"
import ScrollFilament from "@/components/common/ScrollFilament"
import { siteContentApi, galleryApi, showcaseApi, eventsApi } from "@/lib/api"

// Everything below is served from the admin-editable backend (Website tab in
// the admin dashboard). These DEFAULT_* values are only a fallback so the
// homepage renders instantly with sensible content while the live data loads
// (or if the API is briefly unreachable) — no blank states, no layout jump.
const DEFAULT_CONTENT = {
  hero_title_line1: "Energy",
  hero_title_line2: "Lab",
  hero_tagline: "Fitness · Wellness · Pilates",
  hero_bg_url: "/assets/hero-bg.jpg",
  logo_url: "/assets/logo-mark.png",

  about_heading: "About Us",
  about_text: [
    "Welcome to Energy Lab—a space where movement, wellness, and mindfulness come together.",
    "We believe true strength is built through intention, not intensity. Every Pilates session is thoughtfully designed around controlled movement and mindful breathing, helping you strengthen your body, improve mobility, and cultivate lasting balance.",
    "From private coaching and group classes to InBody assessments, every experience is tailored to support your individual journey. Our studio offers a peaceful, modern environment where you can disconnect from the pace of everyday life and reconnect with yourself.",
    "At Energy Lab, wellness isn't just a workout—it's a way of living.",
  ].join("\n\n"),

  space_heading: "Our Space",
  space_subheading: "A quiet, modern studio designed for focus — here's a glimpse before you visit.",

  contact_location: "Tunis, Lafayette 5020",
  contact_phone: "55 555 555",
  contact_email: "energylab-contact@gmail.com",
  map_query: "Tunis, Lafayette 5020, Tunisia",
}

const DEFAULT_SHOWCASE = [
  {
    id: "coaching",
    name: "Private Coaching",
    image_url: "/assets/card_1.png",
    description:
      "Strength, conditioning, or a mix of both — a dedicated coach designs every session around your goals and pace.",
    align: "left",
    bookable: true,
  },
  {
    id: "inbody",
    name: "Inbody Machine Service",
    image_url: "/assets/card_3.png",
    description:
      "Precise body composition scans that track real progress — muscle, fat, water — far beyond what a scale can tell you.",
    align: "right",
    bookable: false,
  },
  {
    id: "pilates",
    name: "Pilates",
    image_url: "/assets/card_2.png",
    description:
      "Mat and reformer sessions focused on controlled movement, flexibility, and a stronger core.",
    align: "left",
    bookable: true,
  },
]

const DEFAULT_GALLERY = [
  { id: "g1", image_url: "/assets/center_1.jpeg", caption: "The studio floor" },
  { id: "g2", image_url: "/assets/center_2.jpeg", caption: "Reformer room" },
  { id: "g3", image_url: "/assets/center_3.jpeg", caption: "Equipment wall" },
  { id: "g4", image_url: "/assets/center_4.jpeg", caption: "Private coaching space" },
  { id: "g5", image_url: "/assets/center_5.jpeg", caption: "Mat & stretch area" },
  { id: "g6", image_url: "/assets/center_6.jpeg", caption: "Reception" },
  { id: "g7", image_url: "/assets/center_7.jpeg", caption: "Studio detail" },
  { id: "g8", image_url: "/assets/center_8.jpeg", caption: "Natural light corner" },
  { id: "g9", image_url: "/assets/center_9.jpeg", caption: "Entrance" },
]

function useReveal() {
  const [node, setNode] = useState(null)
  const [visible, setVisible] = useState(false)

  // Callback ref instead of useRef: sections like the event card mount late
  // (only once the async fetch resolves), so a plain useRef's effect would
  // run before the DOM node exists and never observe it. A callback ref
  // fires whenever the node actually attaches, no matter when that happens.
  const ref = useCallback((node) => {
    setNode(node)
  }, [])

  useEffect(() => {
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
  }, [node])

  return [ref, visible]
}

// "Sat, Aug 2 · 6:00 PM" — used on the event spotlight card.
function formatEventDate(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit",
  })
}

function ShowcaseCard({ item }) {
  const [ref, visible] = useReveal()
  const { isSignedIn } = useUser()
  const isRight = item.align === "right"

  return (
    <div
      ref={ref}
      className={`flex flex-col md:flex-row items-center gap-8 md:gap-10 md:w-[85%] transition-all duration-700 ease-out ${
        isRight ? "md:flex-row-reverse md:ml-auto" : "md:mr-auto"
      } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div className="rounded-2xl border-2 border-primary p-3 shrink-0">
        <img
  src={item.image_url}
  alt={item.name}
  className="w-[320px] h-[440px] object-cover rounded-lg"
/>
      </div>

      <div className={`space-y-4 ${isRight ? "md:text-right" : "text-left"}`}>
        <h3 className="text-2xl font-display font-semibold text-accent">{item.name}</h3>
        <p className={`text-sm text-muted-foreground leading-relaxed max-w-xs ${isRight ? "md:ml-auto" : ""}`}>
          {item.description}
        </p>
        {item.bookable && (
          isSignedIn ? (
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to="/book">Book Now</Link>
            </Button>
          ) : (
            <SignInButton mode="modal">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Book Now
              </Button>
            </SignInButton>
          )
        )}
      </div>
    </div>
  )
}

function GalleryTile({ src, caption }) {
  return (
    <div className="group relative shrink-0 overflow-hidden rounded-xl border border-border/60 w-[520px] h-[280px]">
      <img
        src={src}
        alt={caption}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  )
}

function SpaceCarousel({ gallery }) {
  const [ref, visible] = useReveal()

  const row1 = [...gallery, ...gallery]
  const row2 = [...[...gallery].reverse(), ...[...gallery].reverse()]

  const pauseAnim = (e) => {
    e.currentTarget.firstElementChild.style.animationPlayState = "paused"
  }
  const resumeAnim = (e) => {
    e.currentTarget.firstElementChild.style.animationPlayState = "running"
  }

  return (
    <div
      ref={ref}
      className={`relative transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 md:w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 md:w-32 bg-gradient-to-l from-background to-transparent z-10" />

      <div className="overflow-hidden flex flex-col gap-4">
        <div className="flex" onMouseEnter={pauseAnim} onMouseLeave={resumeAnim}>
          <div
            className="flex gap-4 shrink-0"
            style={{ animation: "scroll-left 40s linear infinite" }}
          >
            {row1.map((img, i) => (
              <GalleryTile key={i} src={img.image_url} caption={img.caption} />
            ))}
          </div>
        </div>
        <div className="flex" onMouseEnter={pauseAnim} onMouseLeave={resumeAnim}>
          <div
            className="flex gap-4 shrink-0"
            style={{ animation: "scroll-right 40s linear infinite" }}
          >
            {row2.map((img, i) => (
              <GalleryTile key={i} src={img.image_url} caption={img.caption} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}

export default function Home() {
  const { isSignedIn } = useUser()
  const location = useLocation()
  const [aboutRef, aboutVisible] = useReveal()
  const [eventRef, eventVisible] = useReveal()

  const [content, setContent] = useState(DEFAULT_CONTENT)
  const [showcase, setShowcase] = useState(DEFAULT_SHOWCASE)
  const [gallery, setGallery] = useState(DEFAULT_GALLERY)
  const [event, setEvent] = useState(null) // no default — section only renders if admin set one

  useEffect(() => {
    siteContentApi.get()
      .then(res => setContent(c => ({ ...c, ...res.data.values })))
      .catch(() => {}) // keep defaults on failure
    showcaseApi.getPublic()
      .then(res => { if (res.data.length) setShowcase(res.data) })
      .catch(() => {})
    galleryApi.getPublic()
      .then(res => { if (res.data.length) setGallery(res.data) })
      .catch(() => {})
    eventsApi.getActive()
      .then(res => setEvent(res.data.length ? res.data[0] : null))
      .catch(() => {})
  }, [])

  // Admin edits this as one text area; a blank line between lines of text
  // is what breaks it into separate <p> paragraphs below.
  const aboutParagraphs = (content.about_text || "")
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean)

  const contactInfo = [
    { icon: MapPin, label: "Location", value: content.contact_location },
    { icon: Phone,  label: "Phone",    value: content.contact_phone },
    { icon: Mail,   label: "Email",    value: content.contact_email },
  ]

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
      <section
        id="hero"
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
        style={{ paddingTop: "calc(4rem + var(--announcement-h, 0px))" }}
      >
        <div className="absolute inset-0">
          <img
            src={content.hero_bg_url}
            alt=""
            className="h-full w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-primary/15 to-background/90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,hsl(var(--background)/0.85)_100%)]" />
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto px-6 space-y-8">
          <img
            src={content.logo_url}
            alt="EnergyLab"
            className="h-16 w-auto mx-auto invert drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
          />
          <h1 className="text-6xl md:text-8xl font-display font-semibold tracking-tight leading-none uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
             {content.hero_title_line1}<br />
             <span className="text-primary">{content.hero_title_line2}</span>
            </h1>
          <p className="text-accent tracking-widest uppercase text-xs drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
            {content.hero_tagline}
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

      {event && (
        <section id="event" className="max-w-5xl mx-auto px-6 pt-20 pb-4 scroll-mt-16">
          <div
            ref={eventRef}
            className={`rounded-2xl border-2 border-primary overflow-hidden grid md:grid-cols-2 transition-all duration-700 ease-out ${
              eventVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {event.image_url && (
              <div className="h-56 md:h-full">
                <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div
              className={`p-8 md:p-10 flex flex-col justify-center gap-3 ${
                event.image_url ? "" : "md:col-span-2 text-center items-center"
              }`}
            >
              <p className="text-xs uppercase tracking-widest text-accent">Upcoming Event</p>
              <h3 className="text-2xl md:text-3xl font-display font-semibold">{event.title}</h3>
              {event.event_date && (
                <p className="text-sm text-primary font-medium">{formatEventDate(event.event_date)}</p>
              )}
              {event.description && (
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line max-w-md">
                  {event.description}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      <section id="about" className="max-w-5xl mx-auto px-6 py-24 scroll-mt-16">
        <div
          ref={aboutRef}
          className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center transition-all duration-700 ease-out ${
            aboutVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative mx-auto md:mx-0 w-full max-w-sm">
            <div className="rounded-2xl border-2 border-primary p-3">
              <img
                src="/assets/about_us.png"
                alt="Inside Energy Lab"
                className="w-full h-[420px] object-cover rounded-lg"
              />
            </div>
          </div>

          <div className="text-center md:text-left space-y-5">
            <p className="text-xs uppercase tracking-widest text-accent">{content.about_heading}</p>
            {aboutParagraphs.map((paragraph, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section id="space" className="max-w-6xl mx-auto px-6 py-24 scroll-mt-16">
        <div className="text-center space-y-3 mb-14">
          <p className="text-xs uppercase tracking-widest text-accent">Take a look inside</p>
          <h2 className="text-3xl md:text-4xl font-display font-semibold">{content.space_heading}</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            {content.space_subheading}
          </p>
        </div>
        <SpaceCarousel gallery={gallery} />
      </section>

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
      <section id="contact" className="max-w-6xl mx-auto px-6 py-24 scroll-mt-16">
        <div className="text-center space-y-3 mb-14">
          <h2 className="text-3xl md:text-4xl font-display font-semibold">Get in Touch</h2>
          <p className="text-muted-foreground text-sm">We'd love to hear from you.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Left — stacked contact details, framed like the photos elsewhere on the page */}
          <div className="flex flex-col gap-5 justify-center">
            {contactInfo.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-2xl border-2 border-primary p-5 flex items-start gap-4"
              >
                <div className="shrink-0 h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center">
                  <Icon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                    {label}
                  </p>
                  <p className="text-sm font-medium whitespace-pre-line">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right — map */}
          <div className="rounded-xl border border-border/60 overflow-hidden min-h-[320px] lg:min-h-[400px]">
            <iframe
              title="Energy Lab location"
              src={`https://www.google.com/maps?q=${encodeURIComponent(content.map_query)}&output=embed`}
              className="w-full h-full"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </main>
  )
}