import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { SignInButton, useUser } from "@clerk/clerk-react"

const services = [
  {
    name: "Private Coaching",
    description: "One-on-one sessions tailored to your goals. Strength, conditioning, or a mix — your coach, your pace.",
    icon: "🏋️",
  },
  {
    name: "Pilates",
    description: "Mat and reformer sessions focused on core strength, flexibility, and controlled movement.",
    icon: "🧘",
  },
  {
    name: "Inbody Analysis",
    description: "Precise body composition analysis to track your progress beyond the scale.",
    icon: "📊",
  },
]

export default function Home() {
  const { isSignedIn } = useUser()

  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <img
          src="/assets/hero-bg.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6 space-y-8">
          <img src="/assets/logo-mark.png" alt="EnergyLab" className="h-16 w-auto mx-auto" />
          <h1 className="text-6xl md:text-8xl font-display font-semibold tracking-tight leading-none uppercase">
            Energy<br />
            <span className="text-primary">Lab</span>
          </h1>
          <p className="text-muted-foreground tracking-widest uppercase text-xs">
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
            <Button asChild size="lg" variant="outline">
              <Link to="/services">Our Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services teaser */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-3xl md:text-4xl font-display font-semibold mb-12 text-center">
          What We Offer
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map(s => (
            <div key={s.name} className="rounded-lg border border-border/60 bg-card p-7 space-y-4 hover:border-primary/40 transition-colors">
              <span className="text-3xl">{s.icon}</span>
              <h3 className="text-xl font-display font-semibold">{s.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
            </div>
          ))}
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
    </main>
  )
}