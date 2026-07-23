// src/hooks/useCurrentUser.js
//
// This used to hold its own fetch+retry logic, but that meant every
// component calling useCurrentUser() got its own independent copy of the
// user (and, critically, its own independent view of `profile_complete`).
// That's what caused the complete-profile redirect loop: CompleteProfile
// would save successfully, but ProfileCompletionGate's separate copy never
// found out, so it bounced the user straight back.
//
// The actual state now lives in CurrentUserContext, mounted once in
// App.jsx, so every consumer reads and updates the same source of truth.
// Re-exported here so existing imports don't need to change.
export { useCurrentUser } from "@/context/CurrentUserContext"