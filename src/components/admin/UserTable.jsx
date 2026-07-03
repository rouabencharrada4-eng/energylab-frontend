
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/utils"

export default function UserTable({ users, loading }) {
  if (loading) {
    return <p className="text-muted-foreground text-sm py-8 text-center">Loading users...</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Joined</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
              No users found.
            </TableCell>
          </TableRow>
        )}
        {users.map(u => (
          <TableRow key={u.id}>
            <TableCell className="font-medium text-sm">{u.full_name}</TableCell>
            <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
            <TableCell className="text-sm text-muted-foreground">{u.phone ?? "—"}</TableCell>
            <TableCell>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                u.role === "admin"
                  ? "bg-primary/15 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}>
                {u.role}
              </span>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">{formatDate(u.created_at)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}