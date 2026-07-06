import { Link, useLocation } from "react-router-dom"
import { useUser, UserButton, SignInButton } from "@clerk/clerk-react"
import { Button } from "@/components/ui/button"

const publicLinks = [
  { hash: "#hero",     label: "Home"      },
  { hash: "#about",    label: "About"     },
  { hash: "#space",    label: "Our Space" },
  { hash: "#services", label: "Services"  },
  { hash: "#contact",  label: "Contact"   },
]

// On the homepage this is a plain in-page anchor (smooth-scrolled via CSS).
// From any other page (e.g. /dashboard) it's a router Link back to "/",
// and Home's own effect scrolls to the hash once it mounts.
function NavAnchor({ hash, label, className }) {
  const location = useLocation()
  const onHome = location.pathname === "/"

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

export default function Navbar() {
  const { isSignedIn, user } = useUser()
  const isAdmin = user?.publicMetadata?.role === "admin"

  return (
    <header
      className="fixed inset-x-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-sm transition-[top] duration-300 ease-out"
      style={{ top: "var(--announcement-h, 0px)" }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-3">
          {/* invert flips the black mark to white so it's actually
              visible against the dark navbar */}
          <img src="/assets/logo-mark.png" alt="Energy Lab" className="h-8 w-auto invert" />
          <span className="hidden sm:block text-lg font-display font-semibold tracking-wide">
            <span className="text-foreground">Energy</span>{" "}
            <span className="text-primary">Lab</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {publicLinks.map(({ hash, label }) => (
            <NavAnchor
              key={hash}
              hash={hash}
              label={label}
              className="text-sm tracking-wide text-muted-foreground hover:text-accent transition-colors"
            />
          ))}
          {isSignedIn && (
            <Link
              to={isAdmin ? "/admin" : "/dashboard"}
              className="text-sm tracking-wide text-muted-foreground hover:text-accent transition-colors"
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