// src/components/layout/Footer.jsx
import { Link, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { Mail, Phone } from "lucide-react"
import { siteContentApi } from "@/lib/api"

const footerLinks = [
  { hash: "#hero",     label: "Home"      },
  { hash: "#about",    label: "About"     },
  { hash: "#space",    label: "Our Space" },
  { hash: "#services", label: "Services"  },
  { hash: "#contact",  label: "Contact"   },
]

const DEFAULT_CONTACT = {
  contact_phone: "55 555 555",
  contact_email: "energylab-contact@gmail.com",
}

// Same behavior as the navbar: plain in-page anchor on the homepage,
// router Link + hash-scroll-on-mount from any other page.
function FooterLink({ hash, label }) {
  const location = useLocation()
  const onHome = location.pathname === "/"
  const className = "text-sm text-muted-foreground hover:text-foreground transition-colors"

  if (onHome) {
    return (
      <a href={hash} className={className}>
        {label}
      </a>
    )
  }
  return (
    <Link to={`/${hash}`} className={className}>
      {label}
    </Link>
  )
}

export default function Footer() {
  const [contact, setContact] = useState(DEFAULT_CONTACT)

  useEffect(() => {
    siteContentApi.get()
      .then(res => setContact(c => ({ ...c, ...res.data.values })))
      .catch(() => {})
  }, [])

  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 sm:grid-cols-3">

        {/* Brand */}
        <div className="flex items-center gap-3 sm:items-start sm:flex-col sm:gap-3">
        <img src="/assets/logo-mark.png" alt="Energy Lab" className="h-7 w-auto dark:invert" />          <span className="text-xs text-muted-foreground tracking-widest uppercase">
            Fitness · Wellness · Pilates
          </span>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-widest text-accent">Navigation</p>
          {footerLinks.map(({ hash, label }) => (
            <FooterLink key={hash} hash={hash} label={label} />
          ))}
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-widest text-accent">Contact</p>
          <a href={`tel:${contact.contact_phone.replace(/\s+/g, "")}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Phone size={14} /> {contact.contact_phone}
          </a>
          <a href={`mailto:${contact.contact_email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Mail size={14} /> {contact.contact_email}
          </a>
        </div>

      </div>

      <div className="border-t border-border/60">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Energy Lab. All rights reserved.
          </p>
          <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}