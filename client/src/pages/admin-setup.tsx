import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Shield, CheckCircle } from "lucide-react";

export default function AdminSetup() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleMakeAdmin = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/make-me-admin', {}) as unknown as { message: string };
      
      // Invalidate admin check query
      queryClient.invalidateQueries({ queryKey: ['/api/admin/check'] });
      
      setSuccess(true);
      toast({
        title: "Success!",
        description: response.message,
      });

      // Redirect to admin dashboard after 2 seconds
      setTimeout(() => {
        setLocation("/admin");
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to make you an admin",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center px-4 py-12">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/login")} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-orange-600" />
            <CardTitle className="text-2xl font-bold">Admin Setup</CardTitle>
          </div>
          <CardDescription>Make yourself an administrator</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {success ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <CheckCircle className="h-16 w-16 text-green-600" />
              <p className="text-lg font-semibold text-center">
                You're now an administrator!
              </p>
              <p className="text-sm text-gray-600 text-center">
                Redirecting to admin dashboard...
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-700">
                Logged in as: <strong>{(user as any).email}</strong>
              </p>
              <p className="text-sm text-gray-600">
                Click the button below to grant yourself administrator privileges.
              </p>
              <Button
                onClick={handleMakeAdmin}
                disabled={isLoading}
                className="w-full"
                data-testid="button-make-admin"
              >
                {isLoading ? "Processing..." : "Make Me Admin"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
