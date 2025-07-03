import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Calendario from "./pages/Calendario";
import Documentos from "./pages/Documentos";
import Conta from "./pages/Conta";
import GestaoPerfilPublico from "./pages/GestaoPerfilPublico";
import { DashboardLayout } from "./components/Layout/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/calendario" replace />} />
          <Route path="/login" element={<Login />} />
          <Route element={<DashboardLayout />}>
            <Route path="/calendario" element={<Calendario />} />
            <Route path="/documentos" element={<Documentos />} />
            <Route path="/conta" element={<Conta />} />
            <Route path="/gestao-perfil" element={<GestaoPerfilPublico />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
