import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { PlayerProvider } from "@/contexts/PlayerContext";

// Pages
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

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/gate" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/gate" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <AccessGate />} 
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/playlists"
        element={
          <ProtectedRoute>
            <PlaylistsIndex />
          </ProtectedRoute>
        }
      />
      <Route
        path="/playlist/:id"
        element={
          <ProtectedRoute>
            <PlaylistDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/episode/:id"
        element={
          <ProtectedRoute>
            <EpisodeDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <Search />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create/win-wire"
        element={
          <ProtectedRoute>
            <WinWireCreator />
          </ProtectedRoute>
        }
      />
      <Route
        path="/win-wire/preview"
        element={
          <ProtectedRoute>
            <WinWirePreview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create/learnings"
        element={
          <ProtectedRoute>
            <MonthlyLearnings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create/request"
        element={
          <ProtectedRoute>
            <RequestBriefing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
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
