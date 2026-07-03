import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Calendar, Dumbbell, Users, Megaphone } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { to: "/admin",               label: "Dashboard",     icon: LayoutDashboard, exact: true },
  { to: "/admin/bookings",      label: "Bookings",      icon: Calendar         },
  { to: "/admin/services",      label: "Services",      icon: Dumbbell         },
  { to: "/admin/users",         label: "Users",         icon: Users            },
  { to: "/admin/announcements", label: "Announcements", icon: Megaphone        },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-56 shrink-0 border-r border-border/60 bg-card min-h-screen pt-4">
      <nav className="flex flex-col gap-1 px-3">
        {navItems.map(({ to, label, icon: Icon, exact }) => {
          const active = exact
            ? location.pathname === to
            : location.pathname.startsWith(to)

          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors",
                active
                  ? "bg-primary/15 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}