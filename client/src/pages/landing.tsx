import { useState } from "react";
import Header from "@/components/Header";
import Calculator from "@/components/Calculator";
import CategoryGrid from "@/components/CategoryGrid";
import ContactDialog from "@/components/ContactDialog";
import { searchCalculators } from "@/data/calculators";
import { Link } from "wouter";

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
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Free Online Calculators
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Over 200 calculators for Math, Finance, Health, and everyday calculations
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <input 
                type="search" 
                placeholder="Search calculators (e.g., mortgage, BMI, percentage)..." 
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 shadow-lg"
                value={searchQuery}
                onChange={handleSearch}
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
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

        {/* Working Calculator Section */}
        <section className="mb-12">
          <Calculator />
        </section>

        {/* Ad Widget Area 1 */}
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 mb-12 text-center">
          <p className="text-gray-500 font-medium">Advertisement Area - 728x90 Leaderboard</p>
        </div>

        {/* Calculator Categories Section */}
        <CategoryGrid />

        {/* Ad Widget Area 2 */}
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 mb-12 text-center">
          <p className="text-gray-500 font-medium">Advertisement Area - 300x250 Medium Rectangle</p>
        </div>

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
            
            <div>
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
