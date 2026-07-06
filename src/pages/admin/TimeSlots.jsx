import { useState } from "react"
import { useAdminTimeSlots, useServices } from "@/hooks/useServices"
import TimeSlotForm from "@/components/admin/TimeSlotForm"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2, Copy } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils"

export default function AdminTimeSlots() {
  const { timeSlots, loading, error, createSlot, updateSlot, removeSlot } = useAdminTimeSlots()
  const { services } = useServices()
  const [formOpen, setFormOpen]         = useState(false)
  const [editing, setEditing]           = useState(null)
  const [serviceFilter, setServiceFilter] = useState("all")

  const handleSave      = data => (editing?.id ? updateSlot(editing.id, data) : createSlot(data))
  const handleAdd        = ()  => { setEditing(null); setFormOpen(true) }
  const handleEdit       = s   => { setEditing(s); setFormOpen(true) }
  const handleDuplicate  = s   => { setEditing({ ...s, id: undefined }); setFormOpen(true) }
  const handleClose      = ()  => { setFormOpen(false); setEditing(null) }
  const handleRemove     = s   => {
    if (confirm(`Delete this time slot on ${formatDate(s.date)} at ${formatTime(s.start_time)}?`)) {
      removeSlot(s.id)
    }
  }

  const filtered = timeSlots
    .filter(s => serviceFilter === "all" || s.service_id === serviceFilter)
    .sort((a, b) => (a.date + a.start_time).localeCompare(b.date + b.start_time))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold">Time Slots</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Slots you create here are what customers see and pick from on the booking form.
          </p>
        </div>
        <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <Plus size={16} /> Add Time Slot
        </Button>
      </div>

      <Select value={serviceFilter} onValueChange={setServiceFilter}>
        <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All services</SelectItem>
          {services.map(s => (
            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded px-3 py-2">{error}</p>
      )}

      <div className="rounded-lg border border-border/60 bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Coach</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No time slots yet — add one so customers have something to book.
                </TableCell>
              </TableRow>
            )}
            {filtered.map(s => (
              <TableRow key={s.id}>
                <TableCell className="text-sm font-medium">{s.service?.name}</TableCell>
                <TableCell className="text-sm">{s.coach?.full_name ?? "Any"}</TableCell>
                <TableCell className="text-sm">{formatDate(s.date)}</TableCell>
                <TableCell className="text-sm">{formatTime(s.start_time)} – {formatTime(s.end_time)}</TableCell>
                <TableCell className="text-sm">{s.capacity ?? s.service?.max_capacity ?? "—"}</TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    s.is_active ? "bg-green-500/10 text-green-400" : "bg-muted text-muted-foreground"
                  }`}>
                    {s.is_active ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleDuplicate(s)} className="h-7 text-xs gap-1.5">
                      <Copy size={11} /> Duplicate
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(s)} className="h-7 text-xs gap-1.5">
                      <Pencil size={11} /> Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleRemove(s)}
                      className="h-7 text-xs border-destructive/40 text-destructive hover:bg-destructive/10 gap-1.5">
                      <Trash2 size={11} /> Remove
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TimeSlotForm open={formOpen} onClose={handleClose} onSave={handleSave} initial={editing} />
    </div>
  )
}