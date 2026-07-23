// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ClerkProvider, AuthenticateWithRedirectCallback } from "@clerk/clerk-react"

import Navbar              from "@/components/layout/Navbar"
import Footer              from "@/components/layout/Footer"
import Sidebar             from "@/components/layout/Sidebar"
import AnnouncementBanner  from "@/components/common/AnnouncementBanner"
import { ProtectedRoute }  from "@/components/common/ProtectedRoute"
import { ProfileCompletionGate } from "@/components/common/ProfileCompletionGate"
import { CurrentUserProvider } from "@/context/CurrentUserContext"

import Home from "@/pages/public/Home"
import Privacy from "@/pages/public/Privacy"

import AdminDashboard     from "@/pages/admin/Dashboard"
import AdminBookings      from "@/pages/admin/Bookings"
import AdminTimeSlots     from "@/pages/admin/TimeSlots"
import AdminServices      from "@/pages/admin/Services"
import AdminWebsite       from "@/pages/admin/Website"
import AdminUsers         from "@/pages/admin/Users"
import AdminAnnouncements from "@/pages/admin/Announcements"
import AdminEvents        from "@/pages/admin/Events"

import CustomerDashboard from "@/pages/customer/Dashboard"
import BookingNew        from "@/pages/customer/BookingNew"
import CompleteProfile   from "@/pages/customer/CompleteProfile"

import { initApiAuth } from "@/lib/api"
import { useAuth } from "@clerk/clerk-react"

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen" style={{ paddingTop: "calc(4rem + var(--announcement-h, 0px))" }}>
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
      <CurrentUserProvider>
        <BrowserRouter>
          <ProfileCompletionGate />
          <AnnouncementBanner />
          <Navbar />

          <Routes>
            {/* Public — single-page vitrine, everything lives on "/" as sections */}
            <Route path="/" element={<Home />} />
            <Route path="/privacy" element={<Privacy />} />

            {/* Google/Facebook sign-in bounces through here on its way back */}
            <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />

            {/* Old bookmarks/links still resolve — they just land on the section */}
            <Route path="/services" element={<Navigate to="/#services" replace />} />
            <Route path="/contact"  element={<Navigate to="/#contact"  replace />} />

            {/* Customer — its own page, outside the vitrine */}
            <Route path="/dashboard" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
            <Route path="/book"      element={<ProtectedRoute><BookingNew /></ProtectedRoute>}        />
            <Route path="/complete-profile" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />

            {/* Admin — its own page, outside the vitrine */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>
            } />
            <Route path="/admin/bookings" element={
              <ProtectedRoute requireAdmin><AdminLayout><AdminBookings /></AdminLayout></ProtectedRoute>
            } />
            <Route path="/admin/time-slots" element={
              <ProtectedRoute requireAdmin><AdminLayout><AdminTimeSlots /></AdminLayout></ProtectedRoute>
            } />
            <Route path="/admin/services" element={
              <ProtectedRoute requireAdmin><AdminLayout><AdminServices /></AdminLayout></ProtectedRoute>
            } />
            <Route path="/admin/website" element={
              <ProtectedRoute requireAdmin><AdminLayout><AdminWebsite /></AdminLayout></ProtectedRoute>
            } />
            <Route path="/admin/events" element={
              <ProtectedRoute requireAdmin><AdminLayout><AdminEvents /></AdminLayout></ProtectedRoute>
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
      </CurrentUserProvider>
    </ClerkProvider>
  )
}