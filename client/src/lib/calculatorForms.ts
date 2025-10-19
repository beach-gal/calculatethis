// Form field definitions for all calculators
// This defines what input fields each calculator needs

export interface FormField {
  id: string;
  label: string;
  type: 'number' | 'text' | 'select' | 'date';
  placeholder?: string;
  step?: string;
  options?: { value: string; label: string }[];
}

export function getFormFields(slug: string): FormField[] {
  // Math Calculators
  if (slug === 'percentage-calculator') {
    return [
      { id: 'value', label: 'Value', type: 'number', placeholder: 'Enter value' },
      { id: 'percentage', label: 'Percentage (%)', type: 'number', placeholder: 'Enter percentage', step: '0.01' }
    ];
  }

  if (slug === 'fraction-calculator') {
    return [
      { id: 'numerator1', label: 'First Numerator', type: 'number', placeholder: 'Enter numerator' },
      { id: 'denominator1', label: 'First Denominator', type: 'number', placeholder: 'Enter denominator' },
      { id: 'operation', label: 'Operation', type: 'select', options: [
        { value: 'add', label: 'Add (+)' },
        { value: 'subtract', label: 'Subtract (-)' },
        { value: 'multiply', label: 'Multiply (×)' },
        { value: 'divide', label: 'Divide (÷)' }
      ]},
      { id: 'numerator2', label: 'Second Numerator', type: 'number', placeholder: 'Enter numerator' },
      { id: 'denominator2', label: 'Second Denominator', type: 'number', placeholder: 'Enter denominator' }
    ];
  }

  if (slug === 'ratio-calculator') {
    return [
      { id: 'a', label: 'First Value (A)', type: 'number', placeholder: 'Enter first value' },
      { id: 'b', label: 'Second Value (B)', type: 'number', placeholder: 'Enter second value' }
    ];
  }

  if (slug === 'average-calculator') {
    return [
      { id: 'values', label: 'Values (comma-separated)', type: 'text', placeholder: 'e.g., 10, 20, 30, 40' }
    ];
  }

  if (slug === 'standard-deviation-calculator') {
    return [
      { id: 'values', label: 'Values (comma-separated)', type: 'text', placeholder: 'e.g., 10, 20, 30, 40' }
    ];
  }

  if (slug === 'random-number-generator') {
    return [
      { id: 'min', label: 'Minimum', type: 'number', placeholder: 'Enter minimum value' },
      { id: 'max', label: 'Maximum', type: 'number', placeholder: 'Enter maximum value' }
    ];
  }

  if (slug === 'exponent-calculator') {
    return [
      { id: 'base', label: 'Base', type: 'number', placeholder: 'Enter base', step: '0.01' },
      { id: 'exponent', label: 'Exponent', type: 'number', placeholder: 'Enter exponent', step: '0.01' }
    ];
  }

  if (slug === 'square-root-calculator') {
    return [
      { id: 'number', label: 'Number', type: 'number', placeholder: 'Enter number', step: '0.01' }
    ];
  }

  if (slug === 'quadratic-formula-calculator') {
    return [
      { id: 'a', label: 'a (coefficient of x²)', type: 'number', placeholder: 'Enter a', step: '0.01' },
      { id: 'b', label: 'b (coefficient of x)', type: 'number', placeholder: 'Enter b', step: '0.01' },
      { id: 'c', label: 'c (constant)', type: 'number', placeholder: 'Enter c', step: '0.01' }
    ];
  }

  if (slug === 'circle-calculator') {
    return [
      { id: 'radius', label: 'Radius', type: 'number', placeholder: 'Enter radius', step: '0.01' }
    ];
  }

  if (slug === 'pythagorean-theorem-calculator') {
    return [
      { id: 'a', label: 'Side A', type: 'number', placeholder: 'Enter side a', step: '0.01' },
      { id: 'b', label: 'Side B', type: 'number', placeholder: 'Enter side b', step: '0.01' }
    ];
  }

  if (slug === 'slope-calculator') {
    return [
      { id: 'x1', label: 'x₁', type: 'number', placeholder: 'Enter x1', step: '0.01' },
      { id: 'y1', label: 'y₁', type: 'number', placeholder: 'Enter y1', step: '0.01' },
      { id: 'x2', label: 'x₂', type: 'number', placeholder: 'Enter x2', step: '0.01' },
      { id: 'y2', label: 'y₂', type: 'number', placeholder: 'Enter y2', step: '0.01' }
    ];
  }

  if (slug === 'distance-calculator' || slug === 'midpoint-calculator') {
    return [
      { id: 'x1', label: 'x₁', type: 'number', placeholder: 'Enter x1', step: '0.01' },
      { id: 'y1', label: 'y₁', type: 'number', placeholder: 'Enter y1', step: '0.01' },
      { id: 'x2', label: 'x₂', type: 'number', placeholder: 'Enter x2', step: '0.01' },
      { id: 'y2', label: 'y₂', type: 'number', placeholder: 'Enter y2', step: '0.01' }
    ];
  }

  if (slug === 'factorial-calculator' || slug === 'prime-number-calculator' || slug === 'absolute-value-calculator') {
    return [
      { id: 'number', label: 'Number', type: 'number', placeholder: 'Enter number' }
    ];
  }

  if (slug === 'combination-calculator' || slug === 'permutation-calculator') {
    return [
      { id: 'n', label: 'n (total items)', type: 'number', placeholder: 'Enter n' },
      { id: 'r', label: 'r (items to choose)', type: 'number', placeholder: 'Enter r' }
    ];
  }

  if (slug === 'lcm-calculator' || slug === 'gcf-calculator') {
    return [
      { id: 'a', label: 'First Number', type: 'number', placeholder: 'Enter first number' },
      { id: 'b', label: 'Second Number', type: 'number', placeholder: 'Enter second number' }
    ];
  }

  if (slug === 'decimal-to-fraction') {
    return [
      { id: 'decimal', label: 'Decimal', type: 'number', placeholder: 'Enter decimal', step: '0.0001' }
    ];
  }

  if (slug === 'fraction-to-decimal') {
    return [
      { id: 'numerator', label: 'Numerator', type: 'number', placeholder: 'Enter numerator' },
      { id: 'denominator', label: 'Denominator', type: 'number', placeholder: 'Enter denominator' }
    ];
  }

  if (slug === 'base-converter') {
    return [
      { id: 'number', label: 'Number', type: 'text', placeholder: 'Enter number' },
      { id: 'fromBase', label: 'From Base', type: 'number', placeholder: 'e.g., 10' },
      { id: 'toBase', label: 'To Base', type: 'number', placeholder: 'e.g., 2' }
    ];
  }

  if (slug === 'log-calculator') {
    return [
      { id: 'number', label: 'Number', type: 'number', placeholder: 'Enter number', step: '0.01' },
      { id: 'base', label: 'Base', type: 'number', placeholder: 'Enter base (default: 10)', step: '0.01' }
    ];
  }

  if (slug === 'sine-calculator' || slug === 'cosine-calculator' || slug === 'tangent-calculator') {
    return [
      { id: 'angle', label: 'Angle (degrees)', type: 'number', placeholder: 'Enter angle', step: '0.01' }
    ];
  }

  if (slug === 'modulo-calculator') {
    return [
      { id: 'a', label: 'Dividend (a)', type: 'number', placeholder: 'Enter a' },
      { id: 'b', label: 'Divisor (b)', type: 'number', placeholder: 'Enter b' }
    ];
  }

  // Finance Calculators
  if (['mortgage-calculator', 'loan-calculator', 'personal-loan-calculator', 'auto-loan-calculator', 'student-loan-calculator'].includes(slug)) {
    return [
      { id: 'principal', label: 'Loan Amount ($)', type: 'number', placeholder: 'Enter loan amount', step: '0.01' },
      { id: 'rate', label: 'Annual Interest Rate (%)', type: 'number', placeholder: 'Enter rate', step: '0.01' },
      { id: 'term', label: 'Loan Term (years)', type: 'number', placeholder: 'Enter term' }
    ];
  }

  if (slug === 'simple-interest-calculator') {
    return [
      { id: 'principal', label: 'Principal Amount ($)', type: 'number', placeholder: 'Enter principal', step: '0.01' },
      { id: 'rate', label: 'Interest Rate (%)', type: 'number', placeholder: 'Enter rate', step: '0.01' },
      { id: 'time', label: 'Time (years)', type: 'number', placeholder: 'Enter time', step: '0.01' }
    ];
  }

  if (slug === 'compound-interest-calculator' || slug === 'interest-calculator') {
    return [
      { id: 'principal', label: 'Principal Amount ($)', type: 'number', placeholder: 'Enter principal', step: '0.01' },
      { id: 'rate', label: 'Interest Rate (%)', type: 'number', placeholder: 'Enter rate', step: '0.01' },
      { id: 'time', label: 'Time (years)', type: 'number', placeholder: 'Enter time', step: '0.01' },
      { id: 'frequency', label: 'Compounds per Year', type: 'number', placeholder: '12 for monthly, 1 for annual' }
    ];
  }

  if (slug === 'roi-calculator') {
    return [
      { id: 'initial', label: 'Initial Investment ($)', type: 'number', placeholder: 'Enter initial investment', step: '0.01' },
      { id: 'final', label: 'Final Value ($)', type: 'number', placeholder: 'Enter final value', step: '0.01' }
    ];
  }

  if (['savings-calculator', 'investment-calculator', 'retirement-calculator', '401k-calculator', 'roth-ira-calculator'].includes(slug)) {
    return [
      { id: 'initial', label: 'Initial Amount ($)', type: 'number', placeholder: 'Enter initial amount', step: '0.01' },
      { id: 'monthly', label: 'Monthly Contribution ($)', type: 'number', placeholder: 'Enter monthly contribution', step: '0.01' },
      { id: 'rate', label: 'Annual Return Rate (%)', type: 'number', placeholder: 'Enter rate', step: '0.01' },
      { id: 'years', label: 'Years', type: 'number', placeholder: 'Enter years' }
    ];
  }

  if (slug === 'hourly-to-salary' || slug === 'salary-calculator') {
    return [
      { id: 'hourly', label: 'Hourly Rate ($)', type: 'number', placeholder: 'Enter hourly rate', step: '0.01' },
      { id: 'hoursPerWeek', label: 'Hours per Week', type: 'number', placeholder: 'Default: 40' }
    ];
  }

  if (slug === 'salary-to-hourly') {
    return [
      { id: 'annual', label: 'Annual Salary ($)', type: 'number', placeholder: 'Enter annual salary', step: '0.01' },
      { id: 'hoursPerWeek', label: 'Hours per Week', type: 'number', placeholder: 'Default: 40' }
    ];
  }

  if (slug === 'tip-calculator') {
    return [
      { id: 'bill', label: 'Bill Amount ($)', type: 'number', placeholder: 'Enter bill amount', step: '0.01' },
      { id: 'tip', label: 'Tip Percentage (%)', type: 'number', placeholder: 'Default: 15', step: '0.01' },
      { id: 'people', label: 'Number of People', type: 'number', placeholder: 'Default: 1' }
    ];
  }

  if (slug === 'discount-calculator') {
    return [
      { id: 'original', label: 'Original Price ($)', type: 'number', placeholder: 'Enter original price', step: '0.01' },
      { id: 'discount', label: 'Discount (%)', type: 'number', placeholder: 'Enter discount percent', step: '0.01' }
    ];
  }

  if (slug === 'markup-calculator') {
    return [
      { id: 'cost', label: 'Cost ($)', type: 'number', placeholder: 'Enter cost', step: '0.01' },
      { id: 'markup', label: 'Markup (%)', type: 'number', placeholder: 'Enter markup percent', step: '0.01' }
    ];
  }

  if (slug === 'margin-calculator') {
    return [
      { id: 'revenue', label: 'Revenue ($)', type: 'number', placeholder: 'Enter revenue', step: '0.01' },
      { id: 'cost', label: 'Cost ($)', type: 'number', placeholder: 'Enter cost', step: '0.01' }
    ];
  }

  if (slug === 'sales-tax-calculator') {
    return [
      { id: 'price', label: 'Price ($)', type: 'number', placeholder: 'Enter price', step: '0.01' },
      { id: 'taxRate', label: 'Tax Rate (%)', type: 'number', placeholder: 'Enter tax rate', step: '0.01' }
    ];
  }

  if (slug === 'credit-card-calculator') {
    return [
      { id: 'balance', label: 'Balance ($)', type: 'number', placeholder: 'Enter balance', step: '0.01' },
      { id: 'apr', label: 'APR (%)', type: 'number', placeholder: 'Enter APR', step: '0.01' },
      { id: 'payment', label: 'Monthly Payment ($)', type: 'number', placeholder: 'Enter payment', step: '0.01' }
    ];
  }

  // Health Calculators
  if (slug === 'bmi-calculator') {
    return [
      { id: 'weight', label: 'Weight (lbs)', type: 'number', placeholder: 'Enter weight in pounds', step: '0.1' },
      { id: 'heightFeet', label: 'Height (feet)', type: 'number', placeholder: 'Enter feet' },
      { id: 'heightInches', label: 'Height (inches)', type: 'number', placeholder: 'Enter inches', step: '0.1' }
    ];
  }

  if (['calorie-calculator', 'tdee-calculator', 'bmr-calculator'].includes(slug)) {
    return [
      { id: 'weight', label: 'Weight (lbs)', type: 'number', placeholder: 'Enter weight in pounds', step: '0.1' },
      { id: 'heightFeet', label: 'Height (feet)', type: 'number', placeholder: 'Enter feet' },
      { id: 'heightInches', label: 'Height (inches)', type: 'number', placeholder: 'Enter inches', step: '0.1' },
      { id: 'age', label: 'Age (years)', type: 'number', placeholder: 'Enter age' },
      { id: 'gender', label: 'Gender', type: 'select', options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' }
      ]},
      { id: 'activityLevel', label: 'Activity Level', type: 'select', options: [
        { value: '1.2', label: 'Sedentary (little/no exercise)' },
        { value: '1.375', label: 'Light (1-3 days/week)' },
        { value: '1.55', label: 'Moderate (3-5 days/week)' },
        { value: '1.725', label: 'Active (6-7 days/week)' },
        { value: '1.9', label: 'Very Active (hard exercise daily)' }
      ]}
    ];
  }

  if (slug === 'protein-calculator') {
    return [
      { id: 'weight', label: 'Weight (lbs)', type: 'number', placeholder: 'Enter weight in pounds', step: '0.1' },
      { id: 'activityLevel', label: 'Activity Level', type: 'select', options: [
        { value: 'sedentary', label: 'Sedentary' },
        { value: 'moderate', label: 'Moderate' },
        { value: 'active', label: 'Active' },
        { value: 'very-active', label: 'Very Active' }
      ]}
    ];
  }

  if (slug === 'water-intake-calculator') {
    return [
      { id: 'weight', label: 'Weight (lbs)', type: 'number', placeholder: 'Enter weight in pounds', step: '0.1' }
    ];
  }

  // Conversion Calculators (Imperial defaults)
  if (slug === 'temperature-converter' || slug === 'celsius-to-fahrenheit') {
    return [
      { id: 'fahrenheit', label: 'Temperature (°F)', type: 'number', placeholder: 'Enter Fahrenheit', step: '0.1' }
    ];
  }

  if (slug === 'length-converter' || slug === 'feet-to-meters') {
    return [
      { id: 'feet', label: 'Length (feet)', type: 'number', placeholder: 'Enter feet', step: '0.01' }
    ];
  }

  if (slug === 'miles-to-km') {
    return [
      { id: 'miles', label: 'Distance (miles)', type: 'number', placeholder: 'Enter miles', step: '0.01' }
    ];
  }

  if (slug === 'weight-converter' || slug === 'kg-to-lbs') {
    return [
      { id: 'pounds', label: 'Weight (lbs)', type: 'number', placeholder: 'Enter pounds', step: '0.1' }
    ];
  }

  if (slug === 'cm-to-inches') {
    return [
      { id: 'inches', label: 'Length (inches)', type: 'number', placeholder: 'Enter inches', step: '0.01' }
    ];
  }

  if (slug === 'volume-converter' || slug === 'gallons-to-liters') {
    return [
      { id: 'gallons', label: 'Volume (gallons)', type: 'number', placeholder: 'Enter gallons', step: '0.01' }
    ];
  }

  if (slug === 'speed-converter') {
    return [
      { id: 'mph', label: 'Speed (mph)', type: 'number', placeholder: 'Enter mph', step: '0.01' }
    ];
  }

  // Other Calculators
  if (slug === 'age-calculator') {
    return [
      { id: 'birthDate', label: 'Birth Date', type: 'date', placeholder: '' }
    ];
  }

  if (slug === 'gpa-calculator') {
    return [
      { id: 'grades', label: 'Grades (comma-separated)', type: 'text', placeholder: 'e.g., A, B, A, C' }
    ];
  }

  if (slug === 'square-footage-calculator') {
    return [
      { id: 'length', label: 'Length (feet)', type: 'number', placeholder: 'Enter length', step: '0.01' },
      { id: 'width', label: 'Width (feet)', type: 'number', placeholder: 'Enter width', step: '0.01' }
    ];
  }

  if (slug === 'paint-calculator') {
    return [
      { id: 'sqft', label: 'Square Footage', type: 'number', placeholder: 'Enter sq ft', step: '0.01' },
      { id: 'coats', label: 'Number of Coats', type: 'number', placeholder: 'Default: 1' }
    ];
  }

  if (slug === 'gas-mileage-calculator' || slug === 'fuel-calculator') {
    return [
      { id: 'miles', label: 'Miles Driven', type: 'number', placeholder: 'Enter miles', step: '0.1' },
      { id: 'gallons', label: 'Gallons Used', type: 'number', placeholder: 'Enter gallons', step: '0.01' }
    ];
  }

  if (slug === 'dog-age-calculator') {
    return [
      { id: 'dogAge', label: 'Dog Age (years)', type: 'number', placeholder: 'Enter dog age', step: '0.1' }
    ];
  }

  if (slug === 'cat-age-calculator') {
    return [
      { id: 'catAge', label: 'Cat Age (years)', type: 'number', placeholder: 'Enter cat age', step: '0.1' }
    ];
  }

  if (slug === 'password-generator') {
    return [
      { id: 'length', label: 'Password Length', type: 'number', placeholder: 'Enter length (default: 12)' }
    ];
  }

  if (slug === 'dice-roller') {
    return [
      { id: 'sides', label: 'Sides per Die', type: 'number', placeholder: 'Enter sides (e.g., 6)' },
      { id: 'count', label: 'Number of Dice', type: 'number', placeholder: 'Enter count' }
    ];
  }

  if (slug === 'coin-flip') {
    return [
      { id: 'flips', label: 'Number of Flips', type: 'number', placeholder: 'Enter number of flips' }
    ];
  }

  // Default form for calculators not specifically defined
  return [
    { id: 'input1', label: 'Value 1', type: 'number', placeholder: 'Enter first value', step: '0.01' },
    { id: 'input2', label: 'Value 2', type: 'number', placeholder: 'Enter second value', step: '0.01' }
  ];
}
