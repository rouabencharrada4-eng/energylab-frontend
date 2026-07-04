import { Link, useLocation, useNavigate } from "react-router-dom"
import { useUser, UserButton, SignInButton } from "@clerk/clerk-react"
import { Button } from "@/components/ui/button"

const sectionLinks = [
  { hash: "#home",     label: "Home"     },
  { hash: "#services", label: "Services" },
  { hash: "#contact",  label: "Contact"  },
]

export default function Navbar() {
  const { isSignedIn, user } = useUser()
  const location = useLocation()
  const navigate = useNavigate()
  const isAdmin = user?.publicMetadata?.role === "admin"

  const goToSection = (e, hash) => {
    e.preventDefault()
    if (location.pathname === "/") {
      if (hash === "#home") {
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" })
      }
    } else {
      navigate(`/${hash}`)
    }
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-3">
          <img src="/assets/logo-mark.png" alt="EnergyLab" className="h-8 w-auto" />
          <img src="/assets/logo-wordmark.png" alt="Energy Lab" className="h-5 w-auto hidden sm:block" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {sectionLinks.map(({ hash, label }) => (
            <a
              key={hash}
              href={`/${hash}`}
              onClick={(e) => goToSection(e, hash)}
              className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </a>
          ))}
          {isSignedIn && (
            <Link
              to={isAdmin ? "/admin" : "/dashboard"}
              className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors"
            >
              {isAdmin ? "Admin" : "My Bookings"}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <SignInButton mode="modal">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Sign In
              </Button>
            </SignInButton>
          )}
        </div>

      </div>
    </header>
  )
}