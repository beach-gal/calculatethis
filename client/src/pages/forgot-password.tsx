import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle } from "lucide-react";
import SEO from "@/components/SEO";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [resetLink, setResetLink] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordFormData) => {
      const response = await apiRequest("POST", "/api/auth/forgot-password", data);
      const result = await response.json();
      return result;
    },
    onSuccess: (data: any) => {
      if (data.resetLink) {
        setResetLink(data.resetLink);
      }
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPasswordMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <SEO
        title="Forgot Password - CalculateThis.org"
        description="Reset your CalculateThis.org password. Enter your email to receive a password reset link."
        ogUrl="https://calculatethis.org/forgot-password"
      />
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          {forgotPasswordMutation.isSuccess && !resetLink ? (
            <Alert className="mb-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                If an account exists with this email, a password reset link has been sent.
                Please check your inbox.
              </AlertDescription>
            </Alert>
          ) : null}

          {resetLink ? (
            <div className="space-y-4">
              <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  <strong className="block mb-2">Development Mode:</strong>
                  Click the link below to reset your password:
                </AlertDescription>
              </Alert>
              <a
                href={resetLink.split(window.location.host)[1]}
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                data-testid="link-reset-password"
              >
                Reset Your Password
              </a>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-4">
                In production, this link would be sent to your email.
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          {...field}
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {forgotPasswordMutation.isError && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {forgotPasswordMutation.error instanceof Error
                        ? forgotPasswordMutation.error.message
                        : "Failed to process password reset request"}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600"
                  disabled={forgotPasswordMutation.isPending}
                  data-testid="button-send-reset-link"
                >
                  {forgotPasswordMutation.isPending
                    ? "Sending..."
                    : "Send Reset Link"}
                </Button>
              </form>
            </Form>
          )}

          <div className="mt-4 text-center text-sm">
            <Link
              href="/login"
              className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
              data-testid="link-back-to-login"
            >
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
