import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

/**
 * Protects routes by checking if a user is authenticated.
 * If not, it redirects to /signin (or /landing).
 */
export default function ProtectedRoute() {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/signin" replace />;
}
