// Comprehensive form field generator for all 200 calculators
// Uses calculator registry to determine appropriate fields

import { calculatorRegistry } from './calculatorConfig';

export interface FormField {
  id: string;
  label: string;
  type: 'number' | 'text' | 'select' | 'date';
  placeholder?: string;
  step?: string;
  options?: { value: string; label: string }[];
}

// Field presets for common input types
const commonFields = {
  // Math
  expression: { id: 'expression', label: 'Expression', type: 'text' as const, placeholder: 'e.g., 5 + 3 * 2' },
  value: { id: 'value', label: 'Value', type: 'number' as const, placeholder: 'Enter value', step: '0.01' },
  percentage: { id: 'percentage', label: 'Percentage (%)', type: 'number' as const, placeholder: 'Enter percentage', step: '0.01' },
  number: { id: 'number', label: 'Number', type: 'number' as const, placeholder: 'Enter number', step: '0.01' },
  a: { id: 'a', label: 'Value A', type: 'number' as const, placeholder: 'Enter value A', step: '0.01' },
  b: { id: 'b', label: 'Value B', type: 'number' as const, placeholder: 'Enter value B', step: '0.01' },
  c: { id: 'c', label: 'Value C', type: 'number' as const, placeholder: 'Enter value C', step: '0.01' },
  base: { id: 'base', label: 'Base', type: 'number' as const, placeholder: 'Enter base', step: '0.01' },
  exponent: { id: 'exponent', label: 'Exponent', type: 'number' as const, placeholder: 'Enter exponent', step: '0.01' },
  angle: { id: 'angle', label: 'Angle (degrees)', type: 'number' as const, placeholder: 'Enter angle', step: '0.01' },
  radius: { id: 'radius', label: 'Radius', type: 'number' as const, placeholder: 'Enter radius', step: '0.01' },
  
  // Statistics
  values: { id: 'values', label: 'Values (comma-separated)', type: 'text' as const, placeholder: 'e.g., 10, 20, 30, 40' },
  
  // Number Theory
  n: { id: 'n', label: 'n (total items)', type: 'number' as const, placeholder: 'Enter n' },
  r: { id: 'r', label: 'r (items to choose)', type: 'number' as const, placeholder: 'Enter r' },
  
  // Geometry
  length: { id: 'length', label: 'Length (ft)', type: 'number' as const, placeholder: 'Enter length', step: '0.01' },
  width: { id: 'width', label: 'Width (ft)', type: 'number' as const, placeholder: 'Enter width', step: '0.01' },
  height: { id: 'height', label: 'Height (ft)', type: 'number' as const, placeholder: 'Enter height', step: '0.01' },
  depth: { id: 'depth', label: 'Depth (in)', type: 'number' as const, placeholder: 'Enter depth', step: '0.01' },
  
  // Coordinates
  x1: { id: 'x1', label: 'x₁', type: 'number' as const, placeholder: 'Enter x1', step: '0.01' },
  y1: { id: 'y1', label: 'y₁', type: 'number' as const, placeholder: 'Enter y1', step: '0.01' },
  x2: { id: 'x2', label: 'x₂', type: 'number' as const, placeholder: 'Enter x2', step: '0.01' },
  y2: { id: 'y2', label: 'y₂', type: 'number' as const, placeholder: 'Enter y2', step: '0.01' },
  
  // Finance - Loans
  principal: { id: 'principal', label: 'Loan Amount ($)', type: 'number' as const, placeholder: 'Enter amount', step: '0.01' },
  rate: { id: 'rate', label: 'Interest Rate (% annual)', type: 'number' as const, placeholder: 'Enter rate', step: '0.01' },
  term: { id: 'term', label: 'Term (years)', type: 'number' as const, placeholder: 'Enter term' },
  payment: { id: 'payment', label: 'Monthly Payment ($)', type: 'number' as const, placeholder: 'Enter payment', step: '0.01' },
  
  // Finance - Investment
  initial: { id: 'initial', label: 'Initial Amount ($)', type: 'number' as const, placeholder: 'Enter initial amount', step: '0.01' },
  monthly: { id: 'monthly', label: 'Monthly Contribution ($)', type: 'number' as const, placeholder: 'Enter monthly', step: '0.01' },
  years: { id: 'years', label: 'Years', type: 'number' as const, placeholder: 'Enter years' },
  time: { id: 'time', label: 'Time (years)', type: 'number' as const, placeholder: 'Enter time', step: '0.1' },
  
  // Finance - Salary
  hourly: { id: 'hourly', label: 'Hourly Rate ($)', type: 'number' as const, placeholder: 'Enter hourly rate', step: '0.01' },
  annual: { id: 'annual', label: 'Annual Salary ($)', type: 'number' as const, placeholder: 'Enter annual salary', step: '0.01' },
  hoursPerWeek: { id: 'hoursPerWeek', label: 'Hours per Week', type: 'number' as const, placeholder: '40' },
  
  // Finance - Tax & Discount
  bill: { id: 'bill', label: 'Bill Amount ($)', type: 'number' as const, placeholder: 'Enter bill', step: '0.01' },
  tip: { id: 'tip', label: 'Tip (%)', type: 'number' as const, placeholder: '15', step: '0.1' },
  people: { id: 'people', label: 'Number of People', type: 'number' as const, placeholder: '1' },
  price: { id: 'price', label: 'Price ($)', type: 'number' as const, placeholder: 'Enter price', step: '0.01' },
  original: { id: 'original', label: 'Original Price ($)', type: 'number' as const, placeholder: 'Enter price', step: '0.01' },
  discount: { id: 'discount', label: 'Discount (%)', type: 'number' as const, placeholder: 'Enter discount', step: '0.1' },
  cost: { id: 'cost', label: 'Cost ($)', type: 'number' as const, placeholder: 'Enter cost', step: '0.01' },
  markup: { id: 'markup', label: 'Markup (%)', type: 'number' as const, placeholder: 'Enter markup', step: '0.1' },
  revenue: { id: 'revenue', label: 'Revenue ($)', type: 'number' as const, placeholder: 'Enter revenue', step: '0.01' },
  taxRate: { id: 'taxRate', label: 'Tax Rate (%)', type: 'number' as const, placeholder: 'Enter rate', step: '0.01' },
  vatRate: { id: 'vatRate', label: 'VAT Rate (%)', type: 'number' as const, placeholder: 'Enter rate', step: '0.01' },
  
  // Health
  weight: { id: 'weight', label: 'Weight (lbs)', type: 'number' as const, placeholder: 'Enter weight', step: '0.1' },
  heightFeet: { id: 'heightFeet', label: 'Height (feet)', type: 'number' as const, placeholder: 'Enter feet' },
  heightInches: { id: 'heightInches', label: 'Height (inches)', type: 'number' as const, placeholder: 'Enter inches', step: '0.1' },
  age: { id: 'age', label: 'Age (years)', type: 'number' as const, placeholder: 'Enter age' },
  gender: { 
    id: 'gender', 
    label: 'Gender', 
    type: 'select' as const, 
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' }
    ]
  },
  activityLevel: {
    id: 'activityLevel',
    label: 'Activity Level',
    type: 'select' as const,
    options: [
      { value: '1.2', label: 'Sedentary (little/no exercise)' },
      { value: '1.375', label: 'Light (1-3 days/week)' },
      { value: '1.55', label: 'Moderate (3-5 days/week)' },
      { value: '1.725', label: 'Active (6-7 days/week)' },
      { value: '1.9', label: 'Very Active (hard exercise daily)' }
    ]
  },
  
  // Conversions (Imperial)
  fahrenheit: { id: 'fahrenheit', label: 'Temperature (°F)', type: 'number' as const, placeholder: 'Enter Fahrenheit', step: '0.1' },
  feet: { id: 'feet', label: 'Length (feet)', type: 'number' as const, placeholder: 'Enter feet', step: '0.01' },
  miles: { id: 'miles', label: 'Distance (miles)', type: 'number' as const, placeholder: 'Enter miles', step: '0.01' },
  pounds: { id: 'pounds', label: 'Weight (lbs)', type: 'number' as const, placeholder: 'Enter pounds', step: '0.1' },
  inches: { id: 'inches', label: 'Length (inches)', type: 'number' as const, placeholder: 'Enter inches', step: '0.01' },
  gallons: { id: 'gallons', label: 'Volume (gallons)', type: 'number' as const, placeholder: 'Enter gallons', step: '0.01' },
  mph: { id: 'mph', label: 'Speed (mph)', type: 'number' as const, placeholder: 'Enter mph', step: '0.01' },
  sqft: { id: 'sqft', label: 'Area (sq ft)', type: 'number' as const, placeholder: 'Enter sq ft', step: '0.01' },
  
  // Date & Time
  birthDate: { id: 'birthDate', label: 'Birth Date', type: 'date' as const, placeholder: '' },
  startDate: { id: 'startDate', label: 'Start Date', type: 'date' as const, placeholder: '' },
  targetDate: { id: 'targetDate', label: 'Target Date', type: 'date' as const, placeholder: '' },
  days: { id: 'days', label: 'Number of Days', type: 'number' as const, placeholder: 'Enter days' },
  
  // Grades
  grades: { id: 'grades', label: 'Grades (comma-separated)', type: 'text' as const, placeholder: 'e.g., A, B, A, C' },
  correct: { id: 'correct', label: 'Correct Answers', type: 'number' as const, placeholder: 'Enter correct' },
  total: { id: 'total', label: 'Total Questions', type: 'number' as const, placeholder: 'Enter total' },
  
  // Random
  min: { id: 'min', label: 'Minimum', type: 'number' as const, placeholder: 'Enter min value' },
  max: { id: 'max', label: 'Maximum', type: 'number' as const, placeholder: 'Enter max value' },
  sides: { id: 'sides', label: 'Sides per Die', type: 'number' as const, placeholder: '6' },
  count: { id: 'count', label: 'Number of Dice', type: 'number' as const, placeholder: '1' },
  flips: { id: 'flips', label: 'Number of Flips', type: 'number' as const, placeholder: '1' },
  
  // Other
  text: { id: 'text', label: 'Text', type: 'text' as const, placeholder: 'Enter text' },
  coats: { id: 'coats', label: 'Number of Coats', type: 'number' as const, placeholder: '1' },
};

export function getFormFields(slug: string): FormField[] {
  // Look up calculator in registry
  const config = calculatorRegistry[slug];
  
  if (!config || !config.fields) {
    // Default fallback
    return [
      commonFields.value,
      { id: 'input2', label: 'Value 2', type: 'number', placeholder: 'Enter second value', step: '0.01' }
    ];
  }
  
  // Generate form fields based on the required fields
  const formFields: FormField[] = [];
  
  for (const fieldId of config.fields) {
    // Check if we have a predefined field
    if (commonFields[fieldId as keyof typeof commonFields]) {
      formFields.push(commonFields[fieldId as keyof typeof commonFields]);
    } else {
      // Create a generic field with sensible defaults
      // Determine if it should be text or number based on field name
      const isTextfield = fieldId.includes('text') || fieldId.includes('name') || 
                         fieldId.includes('equation') || fieldId.includes('shape') ||
                         fieldId.includes('operation') || fieldId.includes('case') ||
                         fieldId.includes('odds') || fieldId.includes('ratio') ||
                         fieldId.includes('activity') || fieldId.includes('Time');
      
      const label = fieldId
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .replace(/([0-9])/g, ' $1')
        .trim();
      
      formFields.push({
        id: fieldId,
        label: label,
        type: isTextfield ? 'text' : 'number',
        placeholder: `Enter ${label.toLowerCase()}`,
        step: isTextfield ? undefined : '0.01'
      });
    }
  }
  
  // Validate that we generated at least one field
  if (formFields.length === 0) {
    console.warn(`No fields generated for calculator: ${slug}`);
    return [commonFields.value];
  }
  
  return formFields;
}
