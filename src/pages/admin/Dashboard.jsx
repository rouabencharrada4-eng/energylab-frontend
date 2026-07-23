import { useEffect, useState } from "react"
import { bookingsApi, usersApi, analyticsApi } from "@/lib/api"
import { Calendar, Users, Clock, CheckCircle } from "lucide-react"
import AnalyticsSection from "@/components/admin/AnalyticsCharts"

export default function AdminDashboard() {
  const [stats, setStats] = useState({ pending: 0, accepted: 0, today: 0, customers: 0 })
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    const load = async () => {
      const [bRes, uRes, aRes] = await Promise.all([
        bookingsApi.getAll(),
        usersApi.getAll(),
        analyticsApi.getDashboard(),
      ])
      const bookings = bRes.data
      const today    = new Date().toISOString().split("T")[0]
      setStats({
        pending:   bookings.filter(b => b.status === "pending").length,
        accepted:  bookings.filter(b => b.status === "accepted").length,
        today:     bookings.filter(b => b.time_slot?.date === today && b.status === "accepted").length,
        customers: uRes.data.filter(u => u.role === "customer").length,
      })
      setAnalytics(aRes.data)
    }
    load().catch(() => {})
  }, [])

  const cards = [
    { label: "Pending Requests",  value: stats.pending,   icon: Clock,       color: "text-yellow-400" },
    { label: "Accepted Bookings", value: stats.accepted,  icon: CheckCircle, color: "text-green-400"  },
    { label: "Sessions Today",    value: stats.today,     icon: Calendar,    color: "text-primary"    },
    { label: "Total Customers",   value: stats.customers, icon: Users,       color: "text-accent"     },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-display font-semibold">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-lg border border-border/60 bg-card p-5 space-y-3">
            <Icon size={18} className={color} />
            <p className="text-2xl font-semibold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
      <AnalyticsSection analytics={analytics} />
    </div>
  )
}