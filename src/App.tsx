import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AreaProvider, AREAS_STORAGE_KEY } from "@/contexts/AreaContext";
import AppLayout from "./components/layout/AppLayout";
import Live from "./pages/Live";
import Pick from "./pages/Pick";
import QC from "./pages/QC";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Setup from "./pages/Setup";
import Logs from "./pages/Logs";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Check if areas are configured
const hasAreas = (): boolean => {
  const stored = localStorage.getItem(AREAS_STORAGE_KEY);
  if (!stored) return false;
  try {
    const areas = JSON.parse(stored);
    return Array.isArray(areas) && areas.length > 0;
  } catch {
    return false;
  }
};

// Redirect to setup if no areas configured
const HomeRedirect = () => {
  return hasAreas() ? <Live /> : <Navigate to="/setup" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AreaProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomeRedirect />} />
              <Route path="/live" element={<Live />} />
              <Route path="/pick" element={<Pick />} />
              <Route path="/qc" element={<QC />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:eventId" element={<EventDetail />} />
              <Route path="/setup" element={<Setup />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/help" element={<Help />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AreaProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
