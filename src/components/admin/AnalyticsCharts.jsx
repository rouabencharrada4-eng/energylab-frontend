import {
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, BarChart,
} from "recharts"

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "0.5rem",
  fontSize: "12px",
}

const STATUS_COLORS = {
  pending:   "hsl(45 90% 55%)",
  accepted:  "hsl(142 65% 40%)",
  rejected:  "hsl(var(--destructive))",
  cancelled: "hsl(var(--muted-foreground))",
}

function ChartCard({ title, children, empty }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card p-5 space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      {empty ? (
        <p className="text-xs text-muted-foreground py-16 text-center">Not enough data yet</p>
      ) : (
        <div className="h-64">{children}</div>
      )}
    </div>
  )
}

export function MembershipGrowthChart({ data }) {
  return (
    <ChartCard title="Membership Growth" empty={!data?.length}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="period" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
          <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: "11px" }} />
          <Bar yAxisId="left" dataKey="new_members" name="New members" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
          <Line yAxisId="right" type="monotone" dataKey="cumulative" name="Total members" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export function MemberStatusChart({ data }) {
  const chartData = [
    { name: "Active", value: data?.active ?? 0 },
    { name: "Inactive", value: data?.inactive ?? 0 },
  ]
  const empty = !data || (data.active === 0 && data.inactive === 0)
  const colors = ["hsl(var(--primary))", "hsl(var(--muted-foreground))"]

  return (
    <ChartCard title={`Active vs Inactive Members (last ${data?.active_days ?? 90}d)`} empty={empty}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2}>
            {chartData.map((entry, i) => <Cell key={entry.name} fill={colors[i]} />)}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: "11px" }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export function BookingStatusChart({ data }) {
  const empty = !data?.length
  return (
    <ChartCard title="Bookings by Status" empty={empty}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="status" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
          <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data?.map((entry) => (
              <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || "hsl(var(--primary))"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export function BookingTrendChart({ data }) {
  return (
    <ChartCard title="Booking Trend" empty={!data?.length}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
          <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="count" name="Bookings" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export function ServiceDistributionChart({ data }) {
  return (
    <ChartCard title="Subscription / Service Plan Distribution" empty={!data?.length}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
          <YAxis type="category" dataKey="service" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={110} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="count" name="Bookings" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export default function AnalyticsSection({ analytics }) {
  if (!analytics) return null
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <MembershipGrowthChart data={analytics.member_growth} />
      <MemberStatusChart data={analytics.member_status} />
      <BookingStatusChart data={analytics.booking_stats?.by_status} />
      <BookingTrendChart data={analytics.booking_stats?.by_day} />
      <div className="lg:col-span-2">
        <ServiceDistributionChart data={analytics.service_distribution} />
      </div>
    </div>
  )
}