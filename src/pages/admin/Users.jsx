import { useEffect, useState } from "react"
import { useAuth } from "@clerk/clerk-react"
import { usersApi, setAuthToken } from "@/lib/api"
import UserTable from "@/components/admin/UserTable"
import { Input } from "@/components/ui/input"

export default function AdminUsers() {
  const { getToken } = useAuth()
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState("")

  useEffect(() => {
    const load = async () => {
      const token = await getToken()
      setAuthToken(token)
      const res = await usersApi.getAll()
      setUsers(res.data)
    }
    load().catch(() => {}).finally(() => setLoading(false))
  }, [getToken])

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-semibold">Users</h1>
      <Input
        placeholder="Search by name or email..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="max-w-xs"
      />
      <div className="rounded-lg border border-border/60 bg-card overflow-hidden">
        <UserTable users={filtered} loading={loading} />
      </div>
    </div>
  )
}