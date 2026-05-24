import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/hooks/use-auth'
import { AdminRoute, ProtectedRoute } from '@/components/ProtectedRoute'
import Layout from '@/components/Layout'
import NotFound from '@/pages/NotFound'
import { SupportChat } from '@/components/support/SupportChat'

// Pages
import Index from '@/pages/Index'
import Dashboard from '@/pages/Dashboard'
import Emails from '@/pages/Emails'
import Whatsapp from '@/pages/Whatsapp'
import Duplicates from '@/pages/Duplicates'
import Settings from '@/pages/Settings'
import Photos from '@/pages/Photos'
import Plans from '@/pages/Plans'
import Unauthorized from '@/pages/Unauthorized'
import AdminPanel from '@/pages/admin/AdminPanel'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import ForgotPassword from '@/pages/auth/ForgotPassword'
import ResetPassword from '@/pages/auth/ResetPassword'

const App = () => (
  <AuthProvider>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<Index />} />

          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Main Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/emails" element={<Emails />} />
              <Route path="/whatsapp" element={<Whatsapp />} />
              <Route path="/photos" element={<Photos />} />
              <Route path="/duplicates" element={<Duplicates />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/plans" element={<Plans />} />
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminPanel />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        <SupportChat />
      </TooltipProvider>
    </BrowserRouter>
  </AuthProvider>
)

export default App
