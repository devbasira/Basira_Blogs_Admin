
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import CreateBlog from "@/pages/CreateBlog";
import EditBlog from "@/pages/EditBlog";
import BlogMetadata from "@/pages/BlogMetadata";
import BlogPreview from "@/pages/BlogPreview";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/blogs/create" element={
              <ProtectedRoute>
                <Layout>
                  <CreateBlog />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/blogs/:id/edit" element={
              <ProtectedRoute>
                <Layout>
                  <EditBlog />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/blogs/:id/metadata" element={
              <ProtectedRoute>
                <Layout>
                  <BlogMetadata />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/blogs/:id/preview" element={
              <ProtectedRoute>
                <Layout>
                  <BlogPreview />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
