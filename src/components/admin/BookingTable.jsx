import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { formatDateTime, BOOKING_STATUS } from "@/lib/utils"

export default function BookingTable({ bookings, onUpdateStatus, loading }) {
  const [selected, setSelected] = useState(null)
  const [action, setAction]     = useState(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [processing, setProcessing] = useState(false)

  const handleOpen = (booking, act) => {
    setSelected(booking)
    setAction(act)
    setAdminNotes("")
  }

  const handleConfirm = async () => {
    setProcessing(true)
    await onUpdateStatus(selected.id, action === "accept" ? "accepted" : "rejected", adminNotes)
    setProcessing(false)
    setSelected(null)
  }

  if (loading) {
    return <p className="text-muted-foreground text-sm py-8 text-center">Loading bookings...</p>
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Coach</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                No bookings found.
              </TableCell>
            </TableRow>
          )}
          {bookings.map(b => {
            const status = BOOKING_STATUS[b.status]
            return (
              <TableRow key={b.id}>
                <TableCell>
                  <p className="font-medium text-sm">{b.customer?.full_name}</p>
                  <p className="text-xs text-muted-foreground">{b.customer?.email}</p>
                </TableCell>
                <TableCell className="text-sm">{b.time_slot?.service?.name}</TableCell>
                <TableCell className="text-sm">{b.time_slot?.coach?.full_name ?? "—"}</TableCell>
                <TableCell className="text-sm">
                  {formatDateTime(b.time_slot?.date, b.time_slot?.start_time)}
                </TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {b.status === "pending" && (
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleOpen(b, "accept")}
                        className="border-green-500/40 text-green-400 hover:bg-green-500/10 h-7 text-xs">
                        Accept
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleOpen(b, "reject")}
                        className="border-red-500/40 text-red-400 hover:bg-red-500/10 h-7 text-xs">
                        Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{action === "accept" ? "Accept Booking" : "Reject Booking"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="admin-notes">Note for customer (optional)</Label>
            <Textarea
              id="admin-notes"
              placeholder="e.g. See you at 10am sharp!"
              value={adminNotes}
              onChange={e => setAdminNotes(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>Cancel</Button>
            <Button
              onClick={handleConfirm}
              disabled={processing}
              className={action === "accept"
                ? "bg-primary hover:bg-primary/90"
                : "bg-destructive hover:bg-destructive/90"}
            >
              {processing ? "Saving..." : action === "accept" ? "Confirm Accept" : "Confirm Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}