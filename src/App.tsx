import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { TenantProvider } from "@/contexts/TenantContext";
import { PlayerProvider } from "@/contexts/PlayerContext";
import { ExperienceProvider } from "@/contexts/ExperienceContext";
import { TenantAccessGate } from "@/components/TenantAccessGate";

// Pages
import TenantSelector from "./pages/TenantSelector";
import TenantHome from "./pages/TenantHome";
import ExperiencePage from "./pages/ExperiencePage";
import InternalPage from "./pages/InternalPage";
import PartnerPage from "./pages/PartnerPage";
import AccessGate from "./pages/AccessGate";
import Home from "./pages/Home";
import PlaylistsIndex from "./pages/PlaylistsIndex";
import PlaylistDetail from "./pages/PlaylistDetail";
import EpisodeDetail from "./pages/EpisodeDetail";
import Search from "./pages/Search";
import WinWireCreator from "./pages/WinWireCreator";
import WinWirePreview from "./pages/WinWirePreview";
import MonthlyLearnings from "./pages/MonthlyLearnings";
import RequestBriefing from "./pages/RequestBriefing";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route for legacy auth flow
function LegacyProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/gate" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// Tenant-protected content wrapper
function TenantProtectedContent({ children }: { children: React.ReactNode }) {
  return (
    <TenantProvider>
      <TenantAccessGate>
        {children}
      </TenantAccessGate>
    </TenantProvider>
  );
}

// Experience-protected content wrapper (new unified approach)
function ExperienceProtectedContent() {
  return (
    <ExperienceProvider>
      <ExperiencePage />
    </ExperienceProvider>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Root = Tenant selector */}
      <Route path="/" element={<TenantSelector />} />
      
      {/* NEW: Space-based routes (Internal/Partner) with shared components */}
      <Route path="/internal" element={<InternalPage />} />
      <Route path="/partner" element={<PartnerPage />} />
      
      {/* LEGACY: Unified audience-based routes (seller/partner) */}
      {/* These share the same page template, differing only by config */}
      <Route
        path="/seller/:tenantSlug"
        element={<ExperienceProtectedContent />}
      />
      <Route
        path="/partner/:tenantSlug"
        element={<ExperienceProtectedContent />}
      />
      
      {/* LEGACY: Partner portal routes (redirect to new format) */}
      <Route
        path="/p/:partnerSlug"
        element={
          <TenantProtectedContent>
            <TenantHome />
          </TenantProtectedContent>
        }
      />
      <Route
        path="/p/:partnerSlug/*"
        element={
          <TenantProtectedContent>
            <TenantSubRoutes />
          </TenantProtectedContent>
        }
      />
      
      {/* LEGACY: Internal user portal routes (redirect to new format) */}
      <Route
        path="/u/:userSlug"
        element={
          <TenantProtectedContent>
            <TenantHome />
          </TenantProtectedContent>
        }
      />
      <Route
        path="/u/:userSlug/*"
        element={
          <TenantProtectedContent>
            <TenantSubRoutes />
          </TenantProtectedContent>
        }
      />

      {/* LEGACY: Old auth gate for backwards compatibility */}
      <Route 
        path="/gate" 
        element={isAuthenticated ? <Navigate to="/legacy" replace /> : <AccessGate />} 
      />
      <Route
        path="/legacy"
        element={
          <LegacyProtectedRoute>
            <Home />
          </LegacyProtectedRoute>
        }
      />
      <Route
        path="/playlists"
        element={
          <LegacyProtectedRoute>
            <PlaylistsIndex />
          </LegacyProtectedRoute>
        }
      />
      <Route
        path="/playlist/:id"
        element={
          <LegacyProtectedRoute>
            <PlaylistDetail />
          </LegacyProtectedRoute>
        }
      />
      <Route
        path="/episode/:id"
        element={
          <LegacyProtectedRoute>
            <EpisodeDetail />
          </LegacyProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <LegacyProtectedRoute>
            <Search />
          </LegacyProtectedRoute>
        }
      />
      <Route
        path="/create/win-wire"
        element={
          <LegacyProtectedRoute>
            <WinWireCreator />
          </LegacyProtectedRoute>
        }
      />
      <Route
        path="/win-wire/preview"
        element={
          <LegacyProtectedRoute>
            <WinWirePreview />
          </LegacyProtectedRoute>
        }
      />
      <Route
        path="/create/learnings"
        element={
          <LegacyProtectedRoute>
            <MonthlyLearnings />
          </LegacyProtectedRoute>
        }
      />
      <Route
        path="/create/request"
        element={
          <LegacyProtectedRoute>
            <RequestBriefing />
          </LegacyProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <LegacyProtectedRoute adminOnly>
            <AdminDashboard />
          </LegacyProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// Sub-routes within tenant context
function TenantSubRoutes() {
  return (
    <Routes>
      <Route path="playlists" element={<PlaylistsIndex />} />
      <Route path="playlist/:id" element={<PlaylistDetail />} />
      <Route path="episode/:id" element={<EpisodeDetail />} />
      <Route path="search" element={<Search />} />
      <Route path="*" element={<Navigate to=".." replace />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <PlayerProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </PlayerProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
