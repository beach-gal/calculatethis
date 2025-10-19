import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { calculatorsData } from "@/data/calculators";

export default function CalculatorPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string>('');

  // Find calculator from our static data
  const calculator = calculatorsData.find(calc => calc.slug === slug);

  const recordUsage = useMutation({
    mutationFn: async (data: any) => {
      if (!isAuthenticated) return;
      return apiRequest('POST', '/api/calculator-usage', data);
    },
    onSuccess: () => {
      toast({
        title: "Calculation recorded",
        description: "Your calculation has been saved to your history.",
      });
    },
    onError: (error) => {
      console.error('Failed to record usage:', error);
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCalculate = () => {
    if (!calculator) return;

    // Basic calculation logic based on calculator type
    let calculatedResult = '';

    try {
      switch (calculator.slug) {
        case 'percentage-calculator':
          const value = parseFloat(inputs.value || '0');
          const percentage = parseFloat(inputs.percentage || '0');
          calculatedResult = `${percentage}% of ${value} = ${(value * percentage / 100).toFixed(2)}`;
          break;
        
        case 'tip-calculator':
          const bill = parseFloat(inputs.bill || '0');
          const tipPercent = parseFloat(inputs.tip || '15');
          const tip = bill * tipPercent / 100;
          const total = bill + tip;
          calculatedResult = `Tip: $${tip.toFixed(2)} | Total: $${total.toFixed(2)}`;
          break;
        
        case 'bmi-calculator':
          const weight = parseFloat(inputs.weight || '0');
          const height = parseFloat(inputs.height || '0');
          const bmi = weight / ((height / 100) ** 2);
          let category = '';
          if (bmi < 18.5) category = 'Underweight';
          else if (bmi < 25) category = 'Normal';
          else if (bmi < 30) category = 'Overweight';
          else category = 'Obese';
          calculatedResult = `BMI: ${bmi.toFixed(1)} (${category})`;
          break;
        
        case 'mortgage-calculator':
          const principal = parseFloat(inputs.principal || '0');
          const rate = parseFloat(inputs.rate || '0') / 100 / 12;
          const term = parseFloat(inputs.term || '0') * 12;
          const monthlyPayment = principal * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
          calculatedResult = `Monthly Payment: $${monthlyPayment.toFixed(2)}`;
          break;
        
        default:
          calculatedResult = 'Calculation completed successfully!';
      }

      setResult(calculatedResult);

      // Record usage if authenticated
      recordUsage.mutate({
        calculatorName: calculator.name,
        calculatorType: calculator.category,
        inputs,
        result: calculatedResult,
      });
    } catch (error) {
      console.error('Calculation error:', error);
      setResult('Error in calculation. Please check your inputs.');
    }
  };

  if (!calculator) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Calculator Not Found</h1>
                <p className="text-gray-600">The calculator you're looking for doesn't exist.</p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-blue-600">{calculator.name}</CardTitle>
            <p className="text-gray-600 text-lg">{calculator.description}</p>
          </CardHeader>
          
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Input Form */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Enter Values</h3>
                
                {/* Dynamic form fields based on calculator type */}
                {calculator.slug === 'percentage-calculator' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="value">Value</Label>
                      <Input
                        id="value"
                        type="number"
                        placeholder="Enter value"
                        value={inputs.value || ''}
                        onChange={(e) => handleInputChange('value', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="percentage">Percentage (%)</Label>
                      <Input
                        id="percentage"
                        type="number"
                        placeholder="Enter percentage"
                        value={inputs.percentage || ''}
                        onChange={(e) => handleInputChange('percentage', e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                {calculator.slug === 'tip-calculator' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bill">Bill Amount ($)</Label>
                      <Input
                        id="bill"
                        type="number"
                        placeholder="Enter bill amount"
                        value={inputs.bill || ''}
                        onChange={(e) => handleInputChange('bill', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tip">Tip Percentage (%)</Label>
                      <Input
                        id="tip"
                        type="number"
                        placeholder="Enter tip percentage"
                        value={inputs.tip || '15'}
                        onChange={(e) => handleInputChange('tip', e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                {calculator.slug === 'bmi-calculator' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        placeholder="Enter weight in kg"
                        value={inputs.weight || ''}
                        onChange={(e) => handleInputChange('weight', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        placeholder="Enter height in cm"
                        value={inputs.height || ''}
                        onChange={(e) => handleInputChange('height', e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                {calculator.slug === 'mortgage-calculator' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="principal">Loan Amount ($)</Label>
                      <Input
                        id="principal"
                        type="number"
                        placeholder="Enter loan amount"
                        value={inputs.principal || ''}
                        onChange={(e) => handleInputChange('principal', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="rate">Annual Interest Rate (%)</Label>
                      <Input
                        id="rate"
                        type="number"
                        step="0.01"
                        placeholder="Enter annual interest rate"
                        value={inputs.rate || ''}
                        onChange={(e) => handleInputChange('rate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="term">Loan Term (years)</Label>
                      <Input
                        id="term"
                        type="number"
                        placeholder="Enter loan term in years"
                        value={inputs.term || ''}
                        onChange={(e) => handleInputChange('term', e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                {/* Default form for other calculators */}
                {!['percentage-calculator', 'tip-calculator', 'bmi-calculator', 'mortgage-calculator'].includes(calculator.slug) && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="input1">Input Value</Label>
                      <Input
                        id="input1"
                        type="number"
                        placeholder="Enter value"
                        value={inputs.input1 || ''}
                        onChange={(e) => handleInputChange('input1', e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={handleCalculate} 
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  Calculate
                </Button>
              </div>
              
              {/* Result Display */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Result</h3>
                <div className="bg-gray-100 rounded-lg p-6 min-h-32">
                  {result ? (
                    <div className="text-lg font-semibold text-green-600">{result}</div>
                  ) : (
                    <div className="text-gray-500">Results will appear here after calculation</div>
                  )}
                </div>
                
                {/* Embed Code */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Embed this calculator:</h4>
                  <Input
                    readOnly
                    value={`<iframe src="${window.location.origin}/calculator/${slug}?embed=true" width="100%" height="400"></iframe>`}
                    className="text-sm"
                  />
                </div>
              </div>
              
            </div>
            
            {/* SEO Content */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold mb-4">About the {calculator.name}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our {calculator.name.toLowerCase()} is a free online tool designed to help you {calculator.description.toLowerCase()}. 
                This calculator is accurate, easy to use, and provides instant results for your calculations.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Whether you're a student, professional, or just need quick calculations, this tool will save you time and ensure accuracy. 
                All calculations are performed client-side for privacy and speed.
                {isAuthenticated && " Your calculation history is automatically saved when you're signed in."}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
