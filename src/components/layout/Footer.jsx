import { Link, useLocation } from "react-router-dom"
import { Mail, Phone } from "lucide-react"

const footerLinks = [
  { hash: "#hero",     label: "Home"      },
  { hash: "#about",    label: "About"     },
  { hash: "#space",    label: "Our Space" },
  { hash: "#services", label: "Services"  },
  { hash: "#contact",  label: "Contact"   },
]

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
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 sm:grid-cols-3">

        {/* Brand */}
        <div className="flex items-center gap-3 sm:items-start sm:flex-col sm:gap-3">
          <img src="/assets/logo-mark.png" alt="Energy Lab" className="h-7 w-auto invert" />
          <span className="text-xs text-muted-foreground tracking-widest uppercase">
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
          <a href="tel:55555555" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Phone size={14} /> 55 555 555
          </a>
          <a href="mailto:energylab-contact@gmail.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Mail size={14} /> energylab-contact@gmail.com
          </a>
        </div>

      </div>

      <div className="border-t border-border/60">
        <div className="max-w-7xl mx-auto px-6 py-5 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Energy Lab. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}