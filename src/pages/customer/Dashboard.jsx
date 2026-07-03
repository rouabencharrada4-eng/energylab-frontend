import { useBookings } from "@/hooks/useBookings"
import { useUser, useAuth } from "@clerk/clerk-react"
import { useNavigate, Link } from "react-router-dom"
import BookingCard from "@/components/customer/BookingCard"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Plus } from "lucide-react"
import { usersApi, setAuthToken } from "@/lib/api"

export default function CustomerDashboard() {
  const { user }              = useUser()
  const { getToken, signOut } = useAuth()
  const { bookings, loading, cancelBooking } = useBookings(false)
  const navigate              = useNavigate()

  const active = bookings.filter(b => b.status !== "cancelled" && b.status !== "rejected")
  const past   = bookings.filter(b => b.status === "cancelled"  || b.status === "rejected")

  const handleDeleteAccount = async () => {
    const token = await getToken()
    setAuthToken(token)
    await usersApi.deleteAccount()
    await signOut()
    navigate("/")
  }

  return (
    <div className="max-w-4xl mx-auto px-6 pt-32 pb-24 space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold">My Bookings</h1>
          <p className="text-muted-foreground text-sm mt-1">Welcome back, {user?.firstName}</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <Link to="/book"><Plus size={16} /> New Booking</Link>
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading your bookings...</p>
      ) : (
        <>
          {active.length === 0 && (
            <p className="text-muted-foreground text-sm">No active bookings. Book your first session!</p>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            {active.map(b => <BookingCard key={b.id} booking={b} onCancel={cancelBooking} />)}
          </div>

          {past.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-muted-foreground">Past / Cancelled</h2>
              <div className="grid sm:grid-cols-2 gap-4 opacity-50">
                {past.map(b => <BookingCard key={b.id} booking={b} onCancel={() => {}} />)}
              </div>
            </div>
          )}
        </>
      )}

      <div className="border-t border-border/60 pt-8">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs">
              Delete my account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Account</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your account and all your bookings. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}