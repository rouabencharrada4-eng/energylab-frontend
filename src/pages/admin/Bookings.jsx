import { useState } from "react"
import { useBookings } from "@/hooks/useBookings"
import BookingTable from "@/components/admin/BookingTable"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminBookings() {
  const { bookings, loading, updateStatus } = useBookings(true)
  const [search, setSearch]           = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = bookings.filter(b => {
    const matchSearch = b.customer?.full_name?.toLowerCase().includes(search.toLowerCase())
      || b.customer?.email?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || b.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-semibold">Bookings</h1>

      <div className="flex gap-3">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["all", "pending", "accepted", "rejected", "cancelled"].map(s => (
              <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-border/60 bg-card overflow-hidden">
        <BookingTable bookings={filtered} onUpdateStatus={updateStatus} loading={loading} />
      </div>
    </div>
  )
}