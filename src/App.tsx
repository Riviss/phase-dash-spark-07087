import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Live from "./pages/Live";
import Pick from "./pages/Pick";
import QC from "./pages/QC";
import Events from "./pages/Events";
import Setup from "./pages/Setup";
import Logs from "./pages/Logs";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Live />} />
            <Route path="/live" element={<Live />} />
            <Route path="/pick" element={<Pick />} />
            <Route path="/qc" element={<QC />} />
            <Route path="/events" element={<Events />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/help" element={<Help />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
