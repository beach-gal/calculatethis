import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import AdSlot from "@/components/AdSlot";
import Calculator from "@/components/Calculator";
import CategoryGrid from "@/components/CategoryGrid";
import ContactDialog from "@/components/ContactDialog";
import Badge from "@/components/Badge";
import { searchCalculators } from "@/data/calculators";
import { Link } from "wouter";
import { Sparkles, Users } from "lucide-react";
import type { Calculator as CalculatorType } from "@shared/schema";

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 2) {
      const results = searchCalculators(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-4">
        
        {/* Header Ad */}
        <AdSlot location="header" className="mb-4" />
        
        {/* Hero Section */}
        <section className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Free Online Calculators
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Over 200 calculators for Math, Finance, Health, and everyday calculations
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <input 
                type="search" 
                placeholder="Search calculators (e.g., mortgage, BMI, percentage)..." 
                className="w-full px-5 py-3 text-base border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 shadow-lg"
                value={searchQuery}
                onChange={handleSearch}
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                Search
              </button>
            </div>
            
            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-2 z-50 max-h-60 overflow-y-auto">
                {searchResults.slice(0, 10).map((result) => (
                  <Link 
                    key={result.slug}
                    href={`/calculator/${result.slug}`}
                    className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
                  >
                    <div className="font-medium text-gray-900">{result.name}</div>
                    <div className="text-sm text-gray-600">{result.description}</div>
                    <div className="text-xs text-blue-600">{result.category}</div>
                  </Link>
                ))}
                {searchResults.length > 10 && (
                  <div className="px-4 py-2 text-sm text-gray-500 text-center">
                    Showing first 10 results of {searchResults.length}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* AI Calculator Builder Promo - NEW Feature */}
        <section className="mb-8">
          <Link href="/custom-calculator" data-testid="link-custom-calculator">
            <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-xl p-1 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
              <div className="bg-white rounded-lg p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                      <Sparkles className="h-7 w-7 text-purple-600" />
                      <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        AI Calculator Builder
                      </h2>
                      <Badge variant="new">NEW</Badge>
                    </div>
                    <p className="text-lg text-gray-700 mb-2">
                      Can't find the calculator you need? <span className="font-bold">Create your own in seconds with AI!</span>
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start text-sm">
                      <div className="bg-purple-50 px-3 py-1 rounded-lg text-purple-700 font-medium">
                        ✨ Instant generation
                      </div>
                      <div className="bg-pink-50 px-3 py-1 rounded-lg text-pink-700 font-medium">
                        🎯 Perfectly customized
                      </div>
                      <div className="bg-blue-50 px-3 py-1 rounded-lg text-blue-700 font-medium">
                        🚀 Free to use
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-bold text-base shadow-lg hover:shadow-xl transition-shadow" data-testid="button-try-ai-calculator">
                      Try It Now →
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* Community Built Section */}
        <CommunityBuiltSection />

        {/* Working Calculator Section */}
        <section className="mb-12">
          <Calculator />
        </section>

        {/* Inline Ad */}
        <AdSlot location="inline" className="mb-12" />

        {/* Calculator Categories Section */}
        <div id="calculators">
          <CategoryGrid />
        </div>

        {/* Sidebar Ad */}
        <AdSlot location="sidebar" className="mb-12" />

        {/* Featured Calculators Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Most Popular Calculators</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/calculator/mortgage-calculator" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=200&fit=crop" 
                alt="Mortgage calculator" 
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mortgage Calculator</h3>
              <p className="text-gray-600 text-sm">Calculate monthly payments and total interest</p>
            </Link>
            
            <Link href="/calculator/bmi-calculator" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop" 
                alt="BMI calculator" 
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-2">BMI Calculator</h3>
              <p className="text-gray-600 text-sm">Calculate your body mass index</p>
            </Link>
            
            <Link href="/calculator/percentage-calculator" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=200&h=200&fit=crop" 
                alt="Percentage calculator" 
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Percentage Calculator</h3>
              <p className="text-gray-600 text-sm">Calculate percentages and percent change</p>
            </Link>
            
            <Link href="/calculator/tip-calculator" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=200&fit=crop" 
                alt="Tip calculator" 
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tip Calculator</h3>
              <p className="text-gray-600 text-sm">Calculate tips and split bills easily</p>
            </Link>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose CalculateThis.org?</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">200+ Calculators</h3>
                <p className="text-gray-600">Comprehensive collection covering math, finance, health, and everyday calculations</p>
              </div>
              
              <div>
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Fast & Accurate</h3>
                <p className="text-gray-600">Instant results with precise calculations you can trust</p>
              </div>
              
              <div>
                <div className="text-4xl mb-3">📱</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Mobile Friendly</h3>
                <p className="text-gray-600">Works perfectly on all devices - desktop, tablet, and mobile</p>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">About Our Calculators</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                CalculateThis.org provides free online calculators for a wide range of needs. Whether you're calculating your mortgage payments, 
                checking your BMI, figuring out percentages, or converting units, we have the tools you need. Our calculators are designed 
                to be user-friendly, accurate, and accessible to everyone.
              </p>
              <p className="text-gray-600 leading-relaxed">
                From financial planning to health tracking, from mathematical operations to everyday conversions, our comprehensive collection 
                of 200+ calculators helps you make informed decisions quickly and easily. All calculators are free to use with no registration 
                required, though signing up allows you to track your calculation history.
              </p>
            </div>
          </div>
        </section>

        {/* Footer Ad */}
        <AdSlot location="footer" className="mt-12" />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            
            <div>
              <h4 className="text-lg font-bold mb-4">Popular Calculators</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/calculator/mortgage-calculator" className="hover:text-white transition-colors">Mortgage Calculator</Link></li>
                <li><Link href="/calculator/bmi-calculator" className="hover:text-white transition-colors">BMI Calculator</Link></li>
                <li><Link href="/calculator/percentage-calculator" className="hover:text-white transition-colors">Percentage Calculator</Link></li>
                <li><Link href="/calculator/loan-calculator" className="hover:text-white transition-colors">Loan Calculator</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#math" className="hover:text-white transition-colors">Math Calculators</a></li>
                <li><a href="#finance" className="hover:text-white transition-colors">Finance Calculators</a></li>
                <li><a href="#health" className="hover:text-white transition-colors">Health Calculators</a></li>
                <li><a href="#other" className="hover:text-white transition-colors">Other Calculators</a></li>
              </ul>
            </div>
            
            <div id="contact">
              <h4 className="text-lg font-bold mb-4">Get in Touch</h4>
              <p className="text-gray-400 mb-4">Have questions or feedback? We'd love to hear from you.</p>
              <ul className="space-y-2 text-gray-400">
                <li><ContactDialog /></li>
              </ul>
            </div>
            
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CalculateThis.org - All rights reserved. Free online calculators for everyone.</p>
            <p className="mt-2 text-sm">Providing accurate calculations for math, finance, health, and more since 2024.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CommunityBuiltSection() {
  const { data: featuredCalculators, isLoading } = useQuery<CalculatorType[]>({
    queryKey: ['/api/calculators/featured/list'],
  });

  if (isLoading || !featuredCalculators || featuredCalculators.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-center gap-3 mb-6">
        <Users className="h-8 w-8 text-blue-600" />
        <h2 className="text-3xl font-bold text-gray-900">Community Built Calculators</h2>
      </div>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        Check out these amazing calculators created by our users with AI! Each one was made in seconds using our AI Calculator Builder.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredCalculators.map((calculator) => (
          <Link
            key={calculator.id}
            href={`/custom-calculator/${calculator.slug}`}
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-[1.02] border-2 border-transparent hover:border-blue-200"
            data-testid={`link-community-calculator-${calculator.slug}`}
          >
            <div className="flex items-start gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{calculator.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{calculator.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-medium">
                {calculator.category}
              </span>
              <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded font-medium">
                AI-Generated
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
