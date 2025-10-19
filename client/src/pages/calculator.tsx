import { useParams, Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { calculatorsData } from "@/data/calculators";
import { performCalculation } from "@/lib/calculatorEngine";
import { getFormFields } from "@/lib/calculatorForms";

export default function CalculatorPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string>('');

  // Find calculator from our static data
  const calculator = calculatorsData.find(calc => calc.slug === slug);

  // Get form fields for this calculator
  const formFields = calculator ? getFormFields(calculator.slug) : [];

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

    try {
      // Use the comprehensive calculator engine
      const calculatedResult = performCalculation(calculator.slug, inputs);
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
                <Link href="/">
                  <Button className="mt-4" data-testid="button-home">Go to Home</Button>
                </Link>
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
        {/* Back to Home Button */}
        <Link href="/">
          <Button variant="outline" className="mb-4" data-testid="button-back-home">
            ← Back to Home
          </Button>
        </Link>
        
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
                
                {/* Dynamic form fields */}
                <div className="space-y-4">
                  {formFields.map((field) => (
                    <div key={field.id}>
                      <Label htmlFor={field.id} data-testid={`label-${field.id}`}>{field.label}</Label>
                      {field.type === 'select' ? (
                        <Select
                          value={inputs[field.id] || field.options?.[0]?.value || ''}
                          onValueChange={(value) => handleInputChange(field.id, value)}
                        >
                          <SelectTrigger id={field.id} data-testid={`select-${field.id}`}>
                            <SelectValue placeholder={`Select ${field.label}`} />
                          </SelectTrigger>
                          <SelectContent data-testid={`select-content-${field.id}`}>
                            {field.options?.map((option) => (
                              <SelectItem 
                                key={option.value} 
                                value={option.value}
                                data-testid={`select-option-${field.id}-${option.value}`}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id={field.id}
                          type={field.type}
                          step={field.step}
                          placeholder={field.placeholder}
                          value={inputs[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          data-testid={`input-${field.id}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                
                <Button 
                  onClick={handleCalculate} 
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                  size="lg"
                  data-testid="button-calculate"
                >
                  Calculate
                </Button>
              </div>
              
              {/* Result Display */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Result</h3>
                <div className="bg-gray-100 rounded-lg p-6 min-h-32">
                  {result ? (
                    <div className="text-lg font-semibold text-green-600" data-testid="text-result">{result}</div>
                  ) : (
                    <div className="text-gray-500">Results will appear here after calculation</div>
                  )}
                </div>
                
                {/* Embed Code */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-semibold mb-2">Embed this calculator on your website</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Copy and paste the code below into your HTML to add this calculator to your website:
                  </p>
                  <Input
                    readOnly
                    value={`<iframe src="${window.location.origin}/calculator/${slug}?embed=true" width="100%" height="600" frameborder="0"></iframe>`}
                    className="text-sm font-mono"
                    data-testid="input-embed-code"
                    onClick={(e) => {
                      e.currentTarget.select();
                      navigator.clipboard.writeText(e.currentTarget.value);
                      toast({ title: "Copied to clipboard!" });
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Click the code above to copy it. You can adjust the width and height values as needed.
                  </p>
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
            
            {/* Backlink */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Powered by{' '}
                <a 
                  href="https://calculatethis.org" 
                  className="text-blue-600 hover:text-blue-800 font-semibold underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="link-backlink"
                >
                  CalculateThis.org
                </a>
                {' '}- Free Online Calculators for Math, Finance, Health & More
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
