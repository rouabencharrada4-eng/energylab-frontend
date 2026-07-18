// src/components/auth/AuthModal.jsx
import { useState } from "react"
import { useSignIn, useSignUp } from "@clerk/clerk-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

function GoogleIcon(props) {
  return (
    <svg viewBox="0 0 48 48" width="18" height="18" {...props}>
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
  )
}

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
      <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.022 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.508 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.462h-1.26c-1.243 0-1.63.771-1.63 1.562v1.877h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.918 8.437-9.94z"/>
    </svg>
  )
}

const OAUTH_PROVIDERS = [
  {
    strategy: "oauth_google",
    label: "Continue with Google",
    icon: GoogleIcon,
    className: "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50",
  },
  {
    strategy: "oauth_facebook",
    label: "Continue with Facebook",
    icon: FacebookIcon,
    className: "bg-[#1877F2] text-white hover:bg-[#1877F2]/90",
  },
]

const EMPTY_SIGN_IN = { email: "", password: "" }
const EMPTY_SIGN_UP = { firstName: "", lastName: "", email: "", password: "", confirmPassword: "", phone: "", address: "" }

// Turns Clerk's error shape into a plain, readable message.
function readError(err, fallback) {
  return err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || fallback
}

export function AuthModal({ open, onOpenChange, defaultMode = "sign-in" }) {
  const { isLoaded: signInLoaded, signIn, setActive: setActiveFromSignIn } = useSignIn()
  const { isLoaded: signUpLoaded, signUp, setActive: setActiveFromSignUp } = useSignUp()

  // "sign-in" | "sign-up" | "verify"
  const [mode, setMode] = useState(defaultMode)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(null)
  const [error, setError] = useState("")

  const [signInForm, setSignInForm] = useState(EMPTY_SIGN_IN)
  const [signUpForm, setSignUpForm] = useState(EMPTY_SIGN_UP)
  const [code, setCode] = useState("")

  const resetState = () => {
    setMode(defaultMode)
    setError("")
    setSignInForm(EMPTY_SIGN_IN)
    setSignUpForm(EMPTY_SIGN_UP)
    setCode("")
    setLoading(false)
    setOauthLoading(null)
  }

  const handleOpenChange = (next) => {
    if (!next) resetState()
    onOpenChange(next)
  }

  // Same call works for both new and returning users — Clerk creates the
  // account automatically on first OAuth sign-in, so one button covers both.
  const handleOAuth = async (strategy) => {
    if (!signInLoaded) return
    setOauthLoading(strategy)
    setError("")
    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: window.location.pathname === "/" ? "/" : window.location.pathname,
      })
    } catch (err) {
      setError(readError(err, "Something went wrong. Please try again."))
      setOauthLoading(null)
    }
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    if (!signInLoaded) return
    setLoading(true)
    setError("")
    try {
      const result = await signIn.create({
        strategy: "password",
        identifier: signInForm.email,
        password: signInForm.password,
      })
      if (result.status === "complete") {
        await setActiveFromSignIn({ session: result.createdSessionId })
        handleOpenChange(false)
      } else {
        setError("Additional verification is required. Please try again or contact support.")
      }
    } catch (err) {
      setError(readError(err, "Couldn't sign in. Check your email and password."))
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    if (!signUpLoaded) return
    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError("Passwords don't match.")
      return
    }
    setLoading(true)
    setError("")
    try {
      await signUp.create({
        firstName: signUpForm.firstName,
        lastName: signUpForm.lastName,
        emailAddress: signUpForm.email,
        password: signUpForm.password,
        // Clerk doesn't have native "phone" (unverified) or "address" fields,
        // so these ride along as unsafeMetadata and get picked up by the
        // backend webhook after sign-up completes.
        unsafeMetadata: {
          phone: signUpForm.phone,
          address: signUpForm.address,
        },
      })
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
      setError("")
      setMode("verify")
    } catch (err) {
      setError(readError(err, "Couldn't create your account. Please check your details."))
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    if (!signUpLoaded) return
    setLoading(true)
    setError("")
    try {
      const result = await signUp.attemptEmailAddressVerification({ code })
      if (result.status === "complete") {
        await setActiveFromSignUp({ session: result.createdSessionId })
        handleOpenChange(false)
      } else {
        setError("That code didn't work. Please check it and try again.")
      }
    } catch (err) {
      setError(readError(err, "That code didn't work. Please check it and try again."))
    } finally {
      setLoading(false)
    }
  }

  const OAuthRow = (
    <div className="flex flex-col gap-2">
      {OAUTH_PROVIDERS.map(p => {
        const Icon = p.icon
        return (
          <button
            key={p.strategy}
            type="button"
            disabled={oauthLoading !== null}
            onClick={() => handleOAuth(p.strategy)}
            className={`w-full h-10 rounded-md text-sm font-medium flex items-center justify-center gap-2.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${p.className}`}
          >
            {oauthLoading === p.strategy ? <Loader2 size={16} className="animate-spin" /> : <Icon />}
            {p.label}
          </button>
        )
      })}
    </div>
  )

  const Divider = (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "sign-in" && "Welcome back"}
            {mode === "sign-up" && "Create your account"}
            {mode === "verify" && "Check your email"}
          </DialogTitle>
          <DialogDescription>
            {mode === "sign-in" && "Sign in to book sessions and manage your account."}
            {mode === "sign-up" && "Fill in your details to get started."}
            {mode === "verify" && `We sent a verification code to ${signUpForm.email}.`}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">{error}</p>
        )}

        {mode === "sign-in" && (
          <div className="space-y-4">
            {OAuthRow}
            {Divider}
            <form onSubmit={handleSignIn} className="space-y-3">
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input
                  type="email"
                  required
                  value={signInForm.email}
                  onChange={e => setSignInForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Password</Label>
                <Input
                  type="password"
                  required
                  value={signInForm.password}
                  onChange={e => setSignInForm(f => ({ ...f, password: e.target.value }))}
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
                {loading ? <Loader2 size={14} className="animate-spin" /> : "Sign In"}
              </Button>
            </form>
            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => { setError(""); setMode("sign-up") }}
              >
                Sign up
              </button>
            </p>
          </div>
        )}

        {mode === "sign-up" && (
          <div className="space-y-4">
            {OAuthRow}
            {Divider}
            <form onSubmit={handleSignUp} className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>First name</Label>
                  <Input
                    required
                    value={signUpForm.firstName}
                    onChange={e => setSignUpForm(f => ({ ...f, firstName: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Last name</Label>
                  <Input
                    required
                    value={signUpForm.lastName}
                    onChange={e => setSignUpForm(f => ({ ...f, lastName: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input
                  type="email"
                  required
                  value={signUpForm.email}
                  onChange={e => setSignUpForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Password</Label>
                <Input
                  type="password"
                  required
                  value={signUpForm.password}
                  onChange={e => setSignUpForm(f => ({ ...f, password: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Confirm password</Label>
                <Input
                  type="password"
                  required
                  value={signUpForm.confirmPassword}
                  onChange={e => setSignUpForm(f => ({ ...f, confirmPassword: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Phone number</Label>
                <Input
                  type="tel"
                  value={signUpForm.phone}
                  onChange={e => setSignUpForm(f => ({ ...f, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Address</Label>
                <Input
                  value={signUpForm.address}
                  onChange={e => setSignUpForm(f => ({ ...f, address: e.target.value }))}
                />
              </div>

              {/* Required by Clerk when bot-protection (Smart CAPTCHA) is on — stays invisible unless triggered */}
              <div id="clerk-captcha" />

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
                {loading ? <Loader2 size={14} className="animate-spin" /> : "Create Account"}
              </Button>
            </form>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => { setError(""); setMode("sign-in") }}
              >
                Sign in
              </button>
            </p>
          </div>
        )}

        {mode === "verify" && (
          <form onSubmit={handleVerify} className="space-y-3">
            <div className="space-y-1.5">
              <Label>Verification code</Label>
              <Input
                autoFocus
                required
                value={code}
                onChange={e => setCode(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
              {loading ? <Loader2 size={14} className="animate-spin" /> : "Verify & Continue"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}