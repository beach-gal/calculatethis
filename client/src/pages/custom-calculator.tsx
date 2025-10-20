import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import AdSlot from "@/components/AdSlot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, ArrowLeft } from "lucide-react";
import Badge from "@/components/Badge";
import { apiRequest } from "@/lib/queryClient";

interface GeneratedCalculator {
  name: string;
  description: string;
  fields: Array<{
    id: string;
    label: string;
    type: string;
    placeholder?: string;
    step?: string;
  }>;
  formula: string;
  resultLabel?: string;
  resultUnit?: string;
  example?: string;
}

export default function CustomCalculator() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCalculator, setGeneratedCalculator] = useState<GeneratedCalculator | null>(null);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast({
        title: "Description required",
        description: "Please describe the calculator you want to create",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedCalculator(null);
    setResult(null);

    try {
      const response = await apiRequest('POST', '/api/generate-calculator', { description });
      const calculator = await response.json();
      setGeneratedCalculator(calculator);
      
      // Initialize inputs
      const initialInputs: Record<string, string> = {};
      calculator.fields.forEach((field: any) => {
        initialInputs[field.id] = '';
      });
      setInputs(initialInputs);

      toast({
        title: "Calculator generated!",
        description: "Your custom calculator is ready to use",
      });
    } catch (error) {
      console.error("Error generating calculator:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate calculator. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCalculate = async () => {
    if (!generatedCalculator) return;

    try {
      // Execute formula server-side for security (using mathjs)
      const response = await apiRequest('POST', '/api/execute-custom-calculator', {
        formula: generatedCalculator.formula,
        inputs,
        resultLabel: generatedCalculator.resultLabel,
        resultUnit: generatedCalculator.resultUnit
      });
      const data = await response.json();
      setResult(data.result);
    } catch (error: any) {
      console.error("Calculation error:", error);
      toast({
        title: "Calculation error",
        description: error.message || "Failed to perform calculation. Please check your inputs.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
          data-testid="button-back-home"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        {/* Header Ad */}
        <AdSlot location="header" className="mb-6" />

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-purple-500" />
            <h1 className="text-4xl font-bold text-gray-900">AI Calculator Builder</h1>
            <Badge variant="new">NEW</Badge>
          </div>
          <p className="text-xl text-gray-600">
            Describe any calculator you need, and AI will build it for you instantly
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-8" data-testid="card-input">
          <CardHeader>
            <CardTitle>What calculator do you need?</CardTitle>
            <CardDescription>
              Describe your calculator in plain English. Be specific about what you want to calculate.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="description">Calculator Description</Label>
              <Textarea
                id="description"
                data-testid="input-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Example: I need a calculator that determines how many hours of sleep I need based on my age and activity level"
                rows={4}
                className="mt-1"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Example Ideas:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Calculate how many pizzas I need for a party based on number of guests</li>
                <li>• Determine my dog's age in human years based on breed and weight</li>
                <li>• Calculate the cost of running my pool heater based on electricity rates</li>
                <li>• Figure out how much mulch I need for my garden beds</li>
              </ul>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !description.trim()}
              className="w-full"
              size="lg"
              data-testid="button-generate"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Your Calculator...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Calculator
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Calculator Section */}
        {generatedCalculator && (
          <>
            {/* Inline Ad */}
            <AdSlot location="inline" className="mb-6" />
            
            <Card data-testid="card-generated">
            <CardHeader>
              <CardTitle>{generatedCalculator.name}</CardTitle>
              <CardDescription>{generatedCalculator.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedCalculator.fields.map((field) => (
                  <div key={field.id}>
                    <Label htmlFor={field.id}>{field.label}</Label>
                    <Input
                      id={field.id}
                      type={field.type}
                      data-testid={`input-${field.id}`}
                      placeholder={field.placeholder}
                      step={field.step}
                      value={inputs[field.id] || ''}
                      onChange={(e) => setInputs({ ...inputs, [field.id]: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                ))}
              </div>

              {/* Calculate Button */}
              <Button
                onClick={handleCalculate}
                className="w-full"
                size="lg"
                data-testid="button-calculate"
              >
                Calculate
              </Button>

              {/* Result */}
              {result && (
                <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6" data-testid="div-result">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">Result:</h3>
                  <p className="text-2xl font-bold text-green-700" data-testid="text-result">{result}</p>
                </div>
              )}

              {/* Example */}
              {generatedCalculator.example && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-1">Example:</h4>
                  <p className="text-sm text-gray-600">{generatedCalculator.example}</p>
                </div>
              )}
            </CardContent>
          </Card>
          </>
        )}

        {/* Footer Ad */}
        <AdSlot location="footer" className="mt-6" />
      </main>
    </div>
  );
}
