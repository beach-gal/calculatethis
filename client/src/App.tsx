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
import Dashboard from "@/pages/dashboard";
import AdminPage from "@/pages/admin";
import AdminTestPage from "@/pages/admin-test";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show landing page for everyone - auth is optional
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/custom-calculator/:slug" component={CustomCalculator} />
      <Route path="/custom-calculator" component={CustomCalculator} />
      <Route path="/calculator/:slug" component={CalculatorPage} />
      <Route path="/dashboard" component={Dashboard} />
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
