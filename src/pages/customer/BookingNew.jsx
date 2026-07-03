import { useState } from "react"
import { Link } from "react-router-dom"
import BookingForm from "@/components/customer/BookingForm"
import { useBookings } from "@/hooks/useBookings"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function BookingNew() {
  const { createBooking } = useBookings(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState(null)

  const handleSubmit = async (data) => {
    setLoading(true)
    setError(null)
    try {
      await createBooking(data)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto px-6 py-32 text-center space-y-6">
        <CheckCircle size={48} className="text-primary mx-auto" />
        <h2 className="text-2xl font-display font-semibold">Booking Requested!</h2>
        <p className="text-muted-foreground text-sm">
          Your session request has been sent. We'll confirm it shortly.
        </p>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link to="/dashboard">View My Bookings</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-6 pt-32 pb-24 space-y-8">
      <div>
        <h1 className="text-3xl font-display font-semibold">Book a Session</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Fill in the details and we'll confirm your booking shortly.
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded px-3 py-2">{error}</p>
      )}

      <BookingForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}