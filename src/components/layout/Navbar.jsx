import { Link, useLocation } from "react-router-dom"
import { useUser, UserButton, SignInButton } from "@clerk/clerk-react"
import { Button } from "@/components/ui/button"

const publicLinks = [
  { to: "/",        label: "Home"     },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact"  },
]

export default function Navbar() {
  const { isSignedIn, user } = useUser()
  const location = useLocation()
  const isAdmin = user?.publicMetadata?.role === "admin"

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-3">
          <img src="/assets/logo-mark.png" alt="EnergyLab" className="h-8 w-auto" />
          <img src="/assets/logo-wordmark.png" alt="Energy Lab" className="h-5 w-auto hidden sm:block" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {publicLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm tracking-wide transition-colors ${
                location.pathname === to
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </Link>
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