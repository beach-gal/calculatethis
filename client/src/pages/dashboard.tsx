import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/Header";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function Dashboard() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Fetch user's calculation history
  const { data: calculationHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['/api/my-calculator-history'],
    retry: false,
    enabled: isAuthenticated,
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Dashboard - CalculateThis.org"
        description="View your calculation history and manage your account on CalculateThis.org."
        ogUrl="https://calculatethis.org/dashboard"
      />
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || user?.email || 'User'}!
          </h1>
          <p className="text-gray-600">Track your calculation history and discover new tools.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-600">Total Calculations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {calculationHistory?.length || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-600">Favorite Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {calculationHistory?.length > 0 ? 
                  // Find most used category
                  Object.entries(
                    calculationHistory.reduce((acc: any, calc: any) => {
                      acc[calc.calculatorType] = (acc[calc.calculatorType] || 0) + 1;
                      return acc;
                    }, {})
                  ).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'None'
                  : 'None'
                }
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-600">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {calculationHistory?.filter((calc: any) => {
                  const calcDate = new Date(calc.createdAt);
                  const oneWeekAgo = new Date();
                  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                  return calcDate > oneWeekAgo;
                }).length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Calculations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Calculations</CardTitle>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-500">Loading calculation history...</p>
              </div>
            ) : !calculationHistory || calculationHistory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No calculations yet!</p>
                <Link 
                  href="/" 
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Calculating
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {calculationHistory.slice(0, 10).map((calc: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{calc.calculatorName}</h4>
                        <Badge variant="secondary">{calc.calculatorType}</Badge>
                      </div>
                      {calc.result && (
                        <p className="text-sm text-gray-600">Result: {calc.result}</p>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(calc.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                
                {calculationHistory.length > 10 && (
                  <div className="text-center pt-4">
                    <p className="text-gray-500">Showing 10 of {calculationHistory.length} calculations</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Access */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link 
                href="/calculator/mortgage-calculator"
                className="p-4 text-center bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <div className="text-2xl mb-2">🏠</div>
                <div className="font-medium text-blue-800">Mortgage</div>
              </Link>
              <Link 
                href="/calculator/bmi-calculator"
                className="p-4 text-center bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <div className="text-2xl mb-2">⚖️</div>
                <div className="font-medium text-green-800">BMI</div>
              </Link>
              <Link 
                href="/calculator/percentage-calculator"
                className="p-4 text-center bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <div className="text-2xl mb-2">📊</div>
                <div className="font-medium text-purple-800">Percentage</div>
              </Link>
              <Link 
                href="/calculator/tip-calculator"
                className="p-4 text-center bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
              >
                <div className="text-2xl mb-2">💰</div>
                <div className="font-medium text-yellow-800">Tip</div>
              </Link>
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
