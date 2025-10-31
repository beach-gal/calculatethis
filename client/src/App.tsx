import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import CalculatorPage from "@/pages/calculator";
import CustomCalculator from "@/pages/custom-calculator";
import CommunityCalculators from "@/pages/community-calculators";
import Dashboard from "@/pages/dashboard";
import AdminPage from "@/pages/admin";
import AdminTestPage from "@/pages/admin-test";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import Settings from "@/pages/settings";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import AdminSetup from "@/pages/admin-setup";
import EmergencyReset from "@/pages/emergency-reset";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show landing page for everyone - auth is optional
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/emergency-reset" component={EmergencyReset} />
      <Route path="/community-calculators" component={CommunityCalculators} />
      <Route path="/custom-calculator/:slug" component={CustomCalculator} />
      <Route path="/custom-calculator" component={CustomCalculator} />
      <Route path="/calculator/:slug" component={CalculatorPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/settings" component={Settings} />
      <Route path="/admin-setup" component={AdminSetup} />
      <Route path="/admin-test" component={AdminTestPage} />
      <Route path="/admin" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
