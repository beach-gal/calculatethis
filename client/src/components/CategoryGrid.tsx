import { Link } from "wouter";
import { getCalculatorsByCategory } from "@/data/calculators";

export default function CategoryGrid() {
  const mathCalculators = getCalculatorsByCategory('Math');
  const financeCalculators = getCalculatorsByCategory('Finance');
  const healthCalculators = getCalculatorsByCategory('Health');
  const otherCalculators = getCalculatorsByCategory('Other');

  return (
    <section id="calculators" className="mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Browse All Calculators by Category</h2>
      
      {/* Force 4-column layout */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Math Calculators */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <img 
              src="https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=100&h=100&fit=crop" 
              alt="Math calculator icon" 
              className="w-12 h-12 rounded-lg mr-3 object-cover"
            />
            <h3 className="text-2xl font-bold text-blue-600">Math Calculators</h3>
          </div>
          <p className="text-gray-600 mb-4 text-sm">50 calculators for mathematical operations</p>
          
          <div className="space-y-1">
            {mathCalculators.slice(0, 20).map((calc) => (
              <Link 
                key={calc.slug}
                href={`/calculator/${calc.slug}`} 
                className="calculator-link block text-blue-600 hover:text-blue-800 hover:underline text-sm leading-tight py-0.5"
              >
                {calc.name}
              </Link>
            ))}
            {mathCalculators.length > 20 && (
              <Link 
                href="/category/math" 
                className="calculator-link block text-blue-500 hover:text-blue-700 font-medium text-sm mt-2"
              >
                View all {mathCalculators.length} math calculators →
              </Link>
            )}
          </div>
        </div>

        {/* Finance Calculators */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <img 
              src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=100&h=100&fit=crop" 
              alt="Finance icon" 
              className="w-12 h-12 rounded-lg mr-3 object-cover"
            />
            <h3 className="text-2xl font-bold text-green-600">Finance Calculators</h3>
          </div>
          <p className="text-gray-600 mb-4 text-sm">50 calculators for financial planning</p>
          
          <div className="space-y-1">
            {financeCalculators.slice(0, 20).map((calc) => (
              <Link 
                key={calc.slug}
                href={`/calculator/${calc.slug}`} 
                className="calculator-link block text-blue-600 hover:text-blue-800 hover:underline text-sm leading-tight py-0.5"
              >
                {calc.name}
              </Link>
            ))}
            {financeCalculators.length > 20 && (
              <Link 
                href="/category/finance" 
                className="calculator-link block text-blue-500 hover:text-blue-700 font-medium text-sm mt-2"
              >
                View all {financeCalculators.length} finance calculators →
              </Link>
            )}
          </div>
        </div>

        {/* Health Calculators */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <img 
              src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=100&h=100&fit=crop" 
              alt="Health icon" 
              className="w-12 h-12 rounded-lg mr-3 object-cover"
            />
            <h3 className="text-2xl font-bold text-red-600">Health Calculators</h3>
          </div>
          <p className="text-gray-600 mb-4 text-sm">25 calculators for health and fitness</p>
          
          <div className="space-y-1">
            {healthCalculators.map((calc) => (
              <Link 
                key={calc.slug}
                href={`/calculator/${calc.slug}`} 
                className="calculator-link block text-blue-600 hover:text-blue-800 hover:underline text-sm leading-tight py-0.5"
              >
                {calc.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Other Calculators */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <img 
              src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=100&h=100&fit=crop" 
              alt="Other tools icon" 
              className="w-12 h-12 rounded-lg mr-3 object-cover"
            />
            <h3 className="text-2xl font-bold text-purple-600">Other Calculators</h3>
          </div>
          <p className="text-gray-600 mb-4 text-sm">75 calculators for everyday use</p>
          
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {otherCalculators.slice(0, 25).map((calc) => (
              <Link 
                key={calc.slug}
                href={`/calculator/${calc.slug}`} 
                className="calculator-link block text-blue-600 hover:text-blue-800 hover:underline text-sm leading-tight py-0.5"
              >
                {calc.name}
              </Link>
            ))}
            {otherCalculators.length > 25 && (
              <Link 
                href="/category/other" 
                className="calculator-link block text-blue-500 hover:text-blue-700 font-medium text-sm mt-2"
              >
                View all {otherCalculators.length} other calculators →
              </Link>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
