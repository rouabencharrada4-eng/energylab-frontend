// src/pages/public/Privacy.jsx
export default function Privacy() {
  return (
    <div
      className="max-w-3xl mx-auto px-6 py-16"
      style={{ paddingTop: "calc(6rem + var(--announcement-h, 0px))" }}
    >
      <h1 className="text-3xl font-display font-semibold mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: July 2026</p>

      <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Who we are</h2>
          <p>
            Energy Lab ("we", "us") operates this website and the booking services offered on it.
            This page explains what information we collect from you, why, and how it's handled.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Information we collect</h2>
          <p className="mb-2">When you create an account or book a session, we may collect:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Your name, email address, and phone number</li>
            <li>Your postal address, if you provide one</li>
            <li>Basic profile information from Google or Facebook, if you sign in that way (name, email, profile picture)</li>
            <li>Booking details — the sessions, dates, and times you reserve</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">How we use it</h2>
          <p className="mb-2">We use this information to:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Create and manage your account</li>
            <li>Process and confirm your bookings</li>
            <li>Contact you about your bookings or account, when necessary</li>
            <li>Improve our services</li>
          </ul>
          <p className="mt-2">We do not sell your personal information.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Authentication</h2>
          <p>
            Account creation and sign-in are handled by Clerk, our authentication provider, and,
            if you choose, Google or Facebook. When you sign in with Google or Facebook, those
            providers share your basic profile information (name, email, profile picture) with us
            in order to create your account — we don't receive your password or post anything on
            your behalf.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Data retention</h2>
          <p>
            We keep your account and booking information for as long as your account is active.
            You can request deletion of your account and associated data at any time by contacting
            us using the details below.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Contact us</h2>
          <p>
            If you have any questions about this policy or how your data is handled, contact us at{" "}
            <a href="mailto:energylab-contact@gmail.com" className="text-primary hover:underline">
              energylab-contact@gmail.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  )
}