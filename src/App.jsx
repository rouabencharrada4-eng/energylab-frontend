import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ClerkProvider } from "@clerk/clerk-react"

import Navbar              from "@/components/layout/Navbar"
import Footer              from "@/components/layout/Footer"
import Sidebar             from "@/components/layout/Sidebar"
import AnnouncementBanner  from "@/components/common/AnnouncementBanner"
import { ProtectedRoute }  from "@/components/common/ProtectedRoute"

import Home from "@/pages/public/Home"

import AdminDashboard     from "@/pages/admin/Dashboard"
import AdminBookings      from "@/pages/admin/Bookings"
import AdminServices      from "@/pages/admin/Services"
import AdminUsers         from "@/pages/admin/Users"
import AdminAnnouncements from "@/pages/admin/Announcements"

import CustomerDashboard from "@/pages/customer/Dashboard"
import BookingNew        from "@/pages/customer/BookingNew"

import { initApiAuth } from "@/lib/api"
import { useAuth } from "@clerk/clerk-react"

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen pt-16">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}

function ApiAuthInit() {
  const { getToken } = useAuth()
  initApiAuth(getToken)
  return null
}

export default function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ApiAuthInit />
      <BrowserRouter>
        <AnnouncementBanner />
        <Navbar />

        <Routes>
          {/* Public — single-page vitrine, everything lives on "/" as sections */}
          <Route path="/" element={<Home />} />

          {/* Old bookmarks/links still resolve — they just land on the section */}
          <Route path="/services" element={<Navigate to="/#services" replace />} />
          <Route path="/contact"  element={<Navigate to="/#contact"  replace />} />

          {/* Customer — its own page, outside the vitrine */}
          <Route path="/dashboard" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
          <Route path="/book"      element={<ProtectedRoute><BookingNew /></ProtectedRoute>}        />

          {/* Admin — its own page, outside the vitrine */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>
          } />
          <Route path="/admin/bookings" element={
            <ProtectedRoute requireAdmin><AdminLayout><AdminBookings /></AdminLayout></ProtectedRoute>
          } />
          <Route path="/admin/services" element={
            <ProtectedRoute requireAdmin><AdminLayout><AdminServices /></AdminLayout></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute requireAdmin><AdminLayout><AdminUsers /></AdminLayout></ProtectedRoute>
          } />
          <Route path="/admin/announcements" element={
            <ProtectedRoute requireAdmin><AdminLayout><AdminAnnouncements /></AdminLayout></ProtectedRoute>
          } />
        </Routes>

        <Footer />
      </BrowserRouter>
    </ClerkProvider>
  )
}