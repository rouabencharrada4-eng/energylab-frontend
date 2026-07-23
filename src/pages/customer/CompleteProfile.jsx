// src/pages/customer/CompleteProfile.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useUser } from "@clerk/clerk-react"
import { usersApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Loader2, CheckCircle2 } from "lucide-react"

const FITNESS_GOALS = [
  "Weight Loss",
  "Muscle Gain",
  "Bodybuilding",
  "General Fitness",
  "Flexibility & Mobility",
  "Other",
]

export default function CompleteProfile() {
  const { user } = useUser()
  const navigate = useNavigate()

  // Google/Facebook accounts skip the sign-up form entirely — no name or
  // address ever gets collected for them. Password accounts already gave
  // those in the sign-up modal, so we don't ask again here.
  const isOAuthUser = (user?.externalAccounts?.length ?? 0) > 0

  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName:  user?.lastName || "",
    address:   "",
    phone: "", age: "", weight_kg: "", height_cm: "", fitness_goal: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.fitness_goal) {
      setError("Please select a fitness goal.")
      return
    }
    setLoading(true)
    setError("")
    try {
      const payload = {
        phone:        form.phone,
        age:          Number(form.age),
        weight_kg:    Number(form.weight_kg),
        height_cm:    Number(form.height_cm),
        fitness_goal: form.fitness_goal,
      }
      if (isOAuthUser) {
        payload.full_name = `${form.firstName} ${form.lastName}`.trim()
        payload.address = form.address
      }
      await usersApi.update(payload)
      setSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't save your profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-6 pt-32 pb-24">
        <div className="rounded-2xl border-2 border-primary p-8 sm:p-10 text-center space-y-5">
          <div className="mx-auto h-14 w-14 rounded-full bg-primary/15 flex items-center justify-center">
            <CheckCircle2 size={28} className="text-primary" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-display font-semibold">Your profile has been created successfully!</h2>
            <p className="text-muted-foreground text-sm">
              You're still signed in — just head to the homepage to get started.
            </p>
          </div>
          <Button
            onClick={() => navigate("/")}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Go to Homepage
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-6 pt-32 pb-24">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-display font-semibold">Complete Your Profile</h1>
        <p className="text-muted-foreground text-sm">
          {user?.firstName ? `Welcome, ${user.firstName}. ` : ""}
          Just a few details so we can tailor your sessions — this only takes a minute.
        </p>
      </div>

      <div className="rounded-2xl border-2 border-primary p-6 sm:p-8">
        {error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2 mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isOAuthUser && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>First name</Label>
                  <Input required value={form.firstName} onChange={set("firstName")} />
                </div>
                <div className="space-y-1.5">
                  <Label>Last name</Label>
                  <Input required value={form.lastName} onChange={set("lastName")} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Address</Label>
                <Input placeholder="Optional" value={form.address} onChange={set("address")} />
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <Label>Phone number</Label>
            <Input
              type="tel"
              required
              placeholder="55 555 555"
              value={form.phone}
              onChange={set("phone")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Age</Label>
              <Input
                type="number"
                required
                min={10}
                max={100}
                placeholder="28"
                value={form.age}
                onChange={set("age")}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Weight (kg)</Label>
              <Input
                type="number"
                required
                min={20}
                max={300}
                step="0.1"
                placeholder="70"
                value={form.weight_kg}
                onChange={set("weight_kg")}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Height (cm)</Label>
            <Input
              type="number"
              required
              min={100}
              max={250}
              step="0.1"
              placeholder="175"
              value={form.height_cm}
              onChange={set("height_cm")}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Fitness goal</Label>
            <Select value={form.fitness_goal} onValueChange={(v) => setForm(f => ({ ...f, fitness_goal: v }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a goal" />
              </SelectTrigger>
              <SelectContent>
                {FITNESS_GOALS.map(goal => (
                  <SelectItem key={goal} value={goal}>{goal}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
            {loading ? <Loader2 size={14} className="animate-spin" /> : "Save & Continue"}
          </Button>
        </form>
      </div>
    </div>
  )
}