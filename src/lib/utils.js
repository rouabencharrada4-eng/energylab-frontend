import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function formatTime(timeString) {
  if (!timeString) return ""
  const [h, m] = timeString.split(":")
  const hour = parseInt(h)
  const ampm = hour >= 12 ? "PM" : "AM"
  const display = hour % 12 || 12
  return `${display}:${m} ${ampm}`
}

export function formatDateTime(dateString, timeString) {
  return `${formatDate(dateString)} at ${formatTime(timeString)}`
}

export const BOOKING_STATUS = {
  pending:   { label: "Pending",   color: "text-yellow-400 bg-yellow-400/10" },
  accepted:  { label: "Accepted",  color: "text-green-400 bg-green-400/10"  },
  rejected:  { label: "Rejected",  color: "text-red-400 bg-red-400/10"      },
  cancelled: { label: "Cancelled", color: "text-gray-400 bg-gray-400/10"    },
}