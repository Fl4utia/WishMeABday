/**
 * Custom React hook for protected routes
 * Redirects to login if user is not authenticated
 */
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";
import { ROUTES } from "../constants/routes";

interface UseProtectedRouteOptions {
  redirectTo?: string;
}

export function useProtectedRoute(
  options: UseProtectedRouteOptions = {}
): { isAuthenticated: boolean; isLoading: boolean } {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const redirectTo = options.redirectTo || ROUTES.LOGIN;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return { isAuthenticated, isLoading };
}
