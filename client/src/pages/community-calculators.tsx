import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import AdSlot from "@/components/AdSlot";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Sparkles, Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Badge from "@/components/Badge";
import type { Calculator as CalculatorType } from "@shared/schema";

export default function CommunityCalculators() {
  const [, navigate] = useLocation();
  const { data: featuredCalculators, isLoading } = useQuery<CalculatorType[]>({
    queryKey: ['/api/calculators/featured/list'],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
          data-testid="button-back-home"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <AdSlot location="header" className="mb-6" />

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Community Built Calculators</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Explore amazing calculators created by our community using AI. Each one was made in seconds with our AI Calculator Builder!
          </p>
          <Link href="/custom-calculator">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" data-testid="button-create-calculator">
              <Sparkles className="mr-2 h-5 w-5" />
              Create Your Own Calculator
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading calculators...</p>
          </div>
        ) : !featuredCalculators || featuredCalculators.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Community Calculators Yet</h2>
                <p className="text-gray-600 mb-6">Be the first to create a calculator using our AI Builder!</p>
                <Link href="/custom-calculator">
                  <Button size="lg" data-testid="button-create-first">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Create Calculator
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCalculators.map((calculator) => (
              <Link
                key={calculator.id}
                href={`/custom-calculator/${calculator.slug}`}
                data-testid={`link-community-calculator-${calculator.slug}`}
              >
                <Card className="h-full hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer bg-gradient-to-br from-white to-blue-50">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      <Badge variant="new">AI-Generated</Badge>
                    </div>
                    <CardTitle className="text-xl">{calculator.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {calculator.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {calculator.creatorName && (
                      <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span>Created by <span className="font-semibold text-purple-600">{calculator.creatorName}</span></span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                        {calculator.category}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <AdSlot location="footer" className="mt-12" />
      </main>
    </div>
  );
}
