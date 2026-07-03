export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src="/assets/logo-mark.png" alt="EnergyLab" className="h-6 w-auto opacity-70" />
          <span className="text-xs text-muted-foreground tracking-widest uppercase">
            Fitness · Wellness · Pilates
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Energy Lab. All rights reserved.
        </p>
      </div>
    </footer>
  )
}