import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    // Don't refetch on window focus to avoid infinite loops
    refetchOnWindowFocus: false,
    // Handle 401 errors gracefully
    throwOnError: false,
  });

  // If we get a 401 error, treat as not authenticated
  const isAuthenticated = error && isUnauthorizedError(error as Error) ? false : !!user;

  return {
    user,
    isLoading,
    isAuthenticated,
  };
}
