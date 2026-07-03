import { useEffect, useState } from "react"
import { servicesApi } from "@/lib/api"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Clock, Users } from "lucide-react"
import { useUser } from "@clerk/clerk-react"

export default function Services() {
  const { isSignedIn } = useUser()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    servicesApi.getAll()
      .then(res => setServices(res.data.filter(s => s.is_active)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
      <div className="mb-12 text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-display font-semibold">Our Services</h1>
        <p className="text-muted-foreground text-sm">Choose the session that fits your goals.</p>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground text-sm">Loading...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(s => (
            <div key={s.id} className="rounded-lg border border-border/60 bg-card p-7 space-y-4 hover:border-primary/40 transition-colors flex flex-col">
              <h3 className="text-xl font-display font-semibold">{s.name}</h3>
              {s.description && (
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{s.description}</p>
              )}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Clock size={12} /> {s.duration_minutes} min</span>
                <span className="flex items-center gap-1.5"><Users size={12} /> Up to {s.max_capacity}</span>
              </div>
              {isSignedIn && (
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground w-full">
                  <Link to="/book">Book This</Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}