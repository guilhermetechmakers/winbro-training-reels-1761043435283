import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LandingPage } from "@/pages/LandingPage";
import { LoginSignupPage } from "@/pages/LoginSignupPage";
import { PasswordResetPage } from "@/pages/PasswordResetPage";
import { EmailVerificationPage } from "@/pages/EmailVerificationPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ContentLibraryPage } from "@/pages/ContentLibraryPage";
import { ClipViewerPage } from "@/pages/ClipViewerPage";
import { UploadContentPage } from "@/pages/UploadContentPage";
import { CourseBuilderPage } from "@/pages/CourseBuilderPage";
import { LearningPlayerPage } from "@/pages/LearningPlayerPage";
import { QuizCertificatePage } from "@/pages/QuizCertificatePage";
import { AdminDashboardPage } from "@/pages/AdminDashboardPage";
import { UserManagementPage } from "@/pages/UserManagementPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { OrderHistoryPage } from "@/pages/OrderHistoryPage";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import { HelpPage } from "@/pages/HelpPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

// React Query client with optimal defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={
            <ProtectedRoute requireAuth={false}>
              <LoginSignupPage />
            </ProtectedRoute>
          } />
          <Route path="/signup" element={
            <ProtectedRoute requireAuth={false}>
              <LoginSignupPage />
            </ProtectedRoute>
          } />
          <Route path="/password-reset" element={
            <ProtectedRoute requireAuth={false}>
              <PasswordResetPage />
            </ProtectedRoute>
          } />
          <Route path="/email-verification" element={
            <ProtectedRoute requireAuth={false}>
              <EmailVerificationPage />
            </ProtectedRoute>
          } />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/library" element={
            <ProtectedRoute>
              <ContentLibraryPage />
            </ProtectedRoute>
          } />
          <Route path="/clip/:id" element={
            <ProtectedRoute>
              <ClipViewerPage />
            </ProtectedRoute>
          } />
          <Route path="/upload" element={
            <ProtectedRoute>
              <UploadContentPage />
            </ProtectedRoute>
          } />
          <Route path="/course-builder" element={
            <ProtectedRoute>
              <CourseBuilderPage />
            </ProtectedRoute>
          } />
          <Route path="/course/:id" element={
            <ProtectedRoute>
              <LearningPlayerPage />
            </ProtectedRoute>
          } />
          <Route path="/quiz/:id" element={
            <ProtectedRoute>
              <QuizCertificatePage />
            </ProtectedRoute>
          } />
          
          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute>
              <UserManagementPage />
            </ProtectedRoute>
          } />
          
          {/* Settings and billing */}
          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <OrderHistoryPage />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          } />
          <Route path="/help" element={
            <ProtectedRoute>
              <HelpPage />
            </ProtectedRoute>
          } />
          
          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
