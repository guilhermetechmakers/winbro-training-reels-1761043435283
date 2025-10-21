import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/LoginPage";
import { SignupPage } from "@/pages/SignupPage";
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
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/password-reset" element={<PasswordResetPage />} />
          <Route path="/email-verification" element={<EmailVerificationPage />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/library" element={<ContentLibraryPage />} />
          <Route path="/clip/:id" element={<ClipViewerPage />} />
          <Route path="/upload" element={<UploadContentPage />} />
          <Route path="/course-builder" element={<CourseBuilderPage />} />
          <Route path="/course/:id" element={<LearningPlayerPage />} />
          <Route path="/quiz/:id" element={<QuizCertificatePage />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
          
          {/* Settings and billing */}
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/help" element={<HelpPage />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}
