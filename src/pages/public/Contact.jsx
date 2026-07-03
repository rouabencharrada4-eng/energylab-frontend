import { Mail, MapPin, Phone } from "lucide-react"

export default function Contact() {
  return (
    <main className="max-w-3xl mx-auto px-6 pt-32 pb-24 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-display font-semibold">Get in Touch</h1>
        <p className="text-muted-foreground text-sm">We'd love to hear from you.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        {[
          { icon: MapPin, label: "Location", value: "123 Energy Street\nTunis, Tunisia" },
          { icon: Phone,  label: "Phone",    value: "+216 XX XXX XXX" },
          { icon: Mail,   label: "Email",    value: "hello@energylab.tn" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-lg border border-border/60 bg-card p-6 flex flex-col items-center gap-3 text-center">
            <Icon size={22} className="text-primary" />
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground whitespace-pre-line">{value}</p>
          </div>
        ))}
      </div>
    </main>
  )
}