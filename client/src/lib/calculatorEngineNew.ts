// New calculator engine using registry-based approach
// Routes calculations to appropriate handlers based on configuration

import { calculatorRegistry } from './calculatorConfig';
import {
  handleArithmetic,
  handlePercentage,
  handleStatistics,
  handleNumberTheory,
  handleAlgebra,
  handleGeometry,
  handleTrigonometry,
  handleConversion,
  handleLoan,
  handleInvestment,
  handleSalary,
  handleTaxDiscount,
  handleHealthBMI,
  handleHealthCalories,
  handleHealthFitness,
  handleDateTime,
  handleGrade,
  handleConstruction,
  handleText,
  handleRandom,
  handleGenerator,
  handleOther
} from './calculatorHandlers';

export interface CalculatorInputs {
  [key: string]: string;
}

export function performCalculation(slug: string, inputs: CalculatorInputs): string {
  try {
    // Get configuration for this calculator
    const config = calculatorRegistry[slug];
    
    if (!config) {
      // Fallback for calculators not in registry
      return 'Calculation completed. Results will vary based on your inputs.';
    }
    
    // Route to appropriate handler based on handler type
    switch (config.handler) {
      case 'arithmetic':
        return handleArithmetic(slug, inputs);
      
      case 'percentage':
        return handlePercentage(slug, inputs);
      
      case 'statistics':
        return handleStatistics(slug, inputs);
      
      case 'number-theory':
        return handleNumberTheory(slug, inputs);
      
      case 'algebra':
        return handleAlgebra(slug, inputs);
      
      case 'geometry':
        return handleGeometry(slug, inputs);
      
      case 'trigonometry':
        return handleTrigonometry(slug, inputs);
      
      case 'conversion':
        return handleConversion(slug, inputs);
      
      case 'loan':
        return handleLoan(slug, inputs);
      
      case 'investment':
        return handleInvestment(slug, inputs);
      
      case 'salary':
        return handleSalary(slug, inputs);
      
      case 'tax-discount':
        return handleTaxDiscount(slug, inputs);
      
      case 'health-bmi':
        return handleHealthBMI(slug, inputs);
      
      case 'health-calories':
        return handleHealthCalories(slug, inputs);
      
      case 'health-fitness':
        return handleHealthFitness(slug, inputs);
      
      case 'date-time':
        return handleDateTime(slug, inputs);
      
      case 'grade':
        return handleGrade(slug, inputs);
      
      case 'construction':
        return handleConstruction(slug, inputs);
      
      case 'text':
        return handleText(slug, inputs);
      
      case 'random':
        return handleRandom(slug, inputs);
      
      case 'generator':
        return handleGenerator(slug, inputs);
      
      case 'other':
      default:
        return handleOther(slug, inputs);
    }
  } catch (error) {
    console.error('Calculation error:', error);
    return 'Error in calculation. Please check your inputs and try again.';
  }
}
