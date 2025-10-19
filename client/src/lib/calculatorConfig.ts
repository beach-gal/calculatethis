// Calculator configuration registry
// Maps each calculator to its handler type, field requirements, and calculation logic

export type CalculatorHandler = 
  | 'arithmetic' // Basic math operations
  | 'percentage' // Percentage calculations
  | 'geometry' // Area, volume, perimeter
  | 'trigonometry' // Sin, cos, tan
  | 'algebra' // Equations, formulas
  | 'statistics' // Mean, median, std dev
  | 'number-theory' // Prime, factorial, GCF, LCM
  | 'conversion' // Unit conversions (imperial default)
  | 'loan' // Loan/mortgage calculations
  | 'investment' // Savings, retirement, ROI
  | 'salary' // Salary conversions
  | 'tax-discount' // Tax, discount, markup
  | 'health-bmi' // BMI, body measurements
  | 'health-calories' // Calorie, TDEE, BMR
  | 'health-fitness' // Pace, heart rate, VO2
  | 'date-time' // Date and time calculations
  | 'grade' // GPA, test scores
  | 'construction' // Paint, concrete, flooring
  | 'text' // Word count, case convert
  | 'random' // Random numbers, dice, coins
  | 'generator' // Password, etc
  | 'other'; // Miscellaneous

export interface CalculatorConfig {
  handler: CalculatorHandler;
  fields: string[]; // Field IDs required
  imperial?: boolean; // Use imperial units by default
}

// Registry mapping slug to configuration
export const calculatorRegistry: Record<string, CalculatorConfig> = {
  // Math - Arithmetic & Basic
  'basic-calculator': { handler: 'arithmetic', fields: ['expression'] },
  'scientific-calculator': { handler: 'arithmetic', fields: ['expression'] },
  'percentage-calculator': { handler: 'percentage', fields: ['value', 'percentage'] },
  'ratio-calculator': { handler: 'arithmetic', fields: ['a', 'b'] },
  'fraction-calculator': { handler: 'arithmetic', fields: ['numerator1', 'denominator1', 'operation', 'numerator2', 'denominator2'] },
  'rounding-calculator': { handler: 'arithmetic', fields: ['number', 'decimals'] },
  'absolute-value-calculator': { handler: 'arithmetic', fields: ['number'] },
  'modulo-calculator': { handler: 'arithmetic', fields: ['a', 'b'] },
  
  // Math - Statistics
  'average-calculator': { handler: 'statistics', fields: ['values'] },
  'standard-deviation-calculator': { handler: 'statistics', fields: ['values'] },
  
  // Math - Number Theory
  'random-number-generator': { handler: 'random', fields: ['min', 'max'] },
  'factorial-calculator': { handler: 'number-theory', fields: ['number'] },
  'combination-calculator': { handler: 'number-theory', fields: ['n', 'r'] },
  'permutation-calculator': { handler: 'number-theory', fields: ['n', 'r'] },
  'prime-number-calculator': { handler: 'number-theory', fields: ['number'] },
  'lcm-calculator': { handler: 'number-theory', fields: ['a', 'b'] },
  'gcf-calculator': { handler: 'number-theory', fields: ['a', 'b'] },
  'divisibility-calculator': { handler: 'number-theory', fields: ['number', 'divisor'] },
  
  // Math - Algebra
  'exponent-calculator': { handler: 'algebra', fields: ['base', 'exponent'] },
  'square-root-calculator': { handler: 'algebra', fields: ['number'] },
  'algebra-calculator': { handler: 'algebra', fields: ['equation'] },
  'equation-solver': { handler: 'algebra', fields: ['equation'] },
  'quadratic-formula-calculator': { handler: 'algebra', fields: ['a', 'b', 'c'] },
  'log-calculator': { handler: 'algebra', fields: ['number', 'base'] },
  'antilog-calculator': { handler: 'algebra', fields: ['number', 'base'] },
  
  // Math - Geometry
  'circle-calculator': { handler: 'geometry', fields: ['radius'] },
  'triangle-calculator': { handler: 'geometry', fields: ['side1', 'side2', 'side3'] },
  'area-calculator': { handler: 'geometry', fields: ['shape', 'dimension1', 'dimension2'] },
  'volume-calculator': { handler: 'geometry', fields: ['shape', 'dimension1', 'dimension2', 'dimension3'] },
  'perimeter-calculator': { handler: 'geometry', fields: ['shape', 'sides'] },
  'pythagorean-theorem-calculator': { handler: 'geometry', fields: ['a', 'b'] },
  
  // Math - Coordinate Geometry
  'slope-calculator': { handler: 'algebra', fields: ['x1', 'y1', 'x2', 'y2'] },
  'distance-calculator': { handler: 'algebra', fields: ['x1', 'y1', 'x2', 'y2'] },
  'midpoint-calculator': { handler: 'algebra', fields: ['x1', 'y1', 'x2', 'y2'] },
  
  // Math - Trigonometry
  'sine-calculator': { handler: 'trigonometry', fields: ['angle'] },
  'cosine-calculator': { handler: 'trigonometry', fields: ['angle'] },
  'tangent-calculator': { handler: 'trigonometry', fields: ['angle'] },
  
  // Math - Number Systems
  'decimal-to-fraction': { handler: 'conversion', fields: ['decimal'] },
  'fraction-to-decimal': { handler: 'conversion', fields: ['numerator', 'denominator'] },
  'mixed-number-calculator': { handler: 'arithmetic', fields: ['whole', 'numerator', 'denominator'] },
  'binary-calculator': { handler: 'conversion', fields: ['number', 'operation'] },
  'hex-calculator': { handler: 'conversion', fields: ['number', 'operation'] },
  'octal-calculator': { handler: 'conversion', fields: ['number', 'operation'] },
  'base-converter': { handler: 'conversion', fields: ['number', 'fromBase', 'toBase'] },
  'binary-converter': { handler: 'conversion', fields: ['number', 'fromBase', 'toBase'] },
  'sig-fig-calculator': { handler: 'arithmetic', fields: ['number', 'sigfigs'] },
  
  // Math - Advanced (placeholder calculations)
  'matrix-calculator': { handler: 'other', fields: ['matrix'] },
  'integral-calculator': { handler: 'other', fields: ['function'] },
  'derivative-calculator': { handler: 'other', fields: ['function'] },
  'limit-calculator': { handler: 'other', fields: ['function'] },
  'series-calculator': { handler: 'other', fields: ['sequence'] },
  
  // Finance - Loans
  'mortgage-calculator': { handler: 'loan', fields: ['principal', 'rate', 'term'] },
  'loan-calculator': { handler: 'loan', fields: ['principal', 'rate', 'term'] },
  'auto-loan-calculator': { handler: 'loan', fields: ['principal', 'rate', 'term'] },
  'student-loan-calculator': { handler: 'loan', fields: ['principal', 'rate', 'term'] },
  'personal-loan-calculator': { handler: 'loan', fields: ['principal', 'rate', 'term'] },
  'amortization-calculator': { handler: 'loan', fields: ['principal', 'rate', 'term'] },
  'payment-calculator': { handler: 'loan', fields: ['principal', 'rate', 'term'] },
  'lease-calculator': { handler: 'loan', fields: ['price', 'residual', 'rate', 'term'] },
  'mortgage-refinance-calculator': { handler: 'loan', fields: ['balance', 'rate', 'term', 'newRate'] },
  
  // Finance - Interest
  'interest-calculator': { handler: 'investment', fields: ['principal', 'rate', 'time', 'frequency'] },
  'compound-interest-calculator': { handler: 'investment', fields: ['principal', 'rate', 'time', 'frequency'] },
  'simple-interest-calculator': { handler: 'investment', fields: ['principal', 'rate', 'time'] },
  
  // Finance - Investment
  'investment-calculator': { handler: 'investment', fields: ['initial', 'monthly', 'rate', 'years'] },
  'roi-calculator': { handler: 'investment', fields: ['initial', 'final'] },
  'retirement-calculator': { handler: 'investment', fields: ['initial', 'monthly', 'rate', 'years'] },
  '401k-calculator': { handler: 'investment', fields: ['initial', 'monthly', 'rate', 'years'] },
  'roth-ira-calculator': { handler: 'investment', fields: ['initial', 'monthly', 'rate', 'years'] },
  'savings-calculator': { handler: 'investment', fields: ['initial', 'monthly', 'rate', 'years'] },
  'college-savings-calculator': { handler: 'investment', fields: ['initial', 'monthly', 'rate', 'years'] },
  'annuity-calculator': { handler: 'investment', fields: ['payment', 'rate', 'periods'] },
  'fire-calculator': { handler: 'investment', fields: ['expenses', 'savings', 'rate'] },
  
  // Finance - Salary
  'salary-calculator': { handler: 'salary', fields: ['hourly', 'hoursPerWeek'] },
  'hourly-to-salary': { handler: 'salary', fields: ['hourly', 'hoursPerWeek'] },
  'salary-to-hourly': { handler: 'salary', fields: ['annual', 'hoursPerWeek'] },
  'paycheck-calculator': { handler: 'salary', fields: ['salary', 'frequency', 'taxRate'] },
  
  // Finance - Tax & Discounts
  'tip-calculator': { handler: 'tax-discount', fields: ['bill', 'tip', 'people'] },
  'discount-calculator': { handler: 'tax-discount', fields: ['original', 'discount'] },
  'markup-calculator': { handler: 'tax-discount', fields: ['cost', 'markup'] },
  'margin-calculator': { handler: 'tax-discount', fields: ['revenue', 'cost'] },
  'sales-tax-calculator': { handler: 'tax-discount', fields: ['price', 'taxRate'] },
  'tax-calculator': { handler: 'tax-discount', fields: ['income', 'deductions'] },
  'vat-calculator': { handler: 'tax-discount', fields: ['price', 'vatRate'] },
  'property-tax-calculator': { handler: 'tax-discount', fields: ['value', 'rate'] },
  'commission-calculator': { handler: 'tax-discount', fields: ['sales', 'rate'] },
  
  // Finance - Other
  'inflation-calculator': { handler: 'investment', fields: ['amount', 'years', 'rate'] },
  'depreciation-calculator': { handler: 'investment', fields: ['cost', 'salvage', 'years'] },
  'rent-calculator': { handler: 'other', fields: ['income'] },
  'budget-calculator': { handler: 'other', fields: ['income', 'expenses'] },
  'debt-calculator': { handler: 'loan', fields: ['balance', 'payment', 'rate'] },
  'credit-card-calculator': { handler: 'loan', fields: ['balance', 'apr', 'payment'] },
  'apr-calculator': { handler: 'investment', fields: ['principal', 'fee', 'term'] },
  'apy-calculator': { handler: 'investment', fields: ['rate', 'frequency'] },
  'net-worth-calculator': { handler: 'other', fields: ['assets', 'liabilities'] },
  'home-affordability-calculator': { handler: 'loan', fields: ['income', 'debt', 'downPayment'] },
  'rent-vs-buy-calculator': { handler: 'other', fields: ['rent', 'price', 'downPayment'] },
  'closing-costs-calculator': { handler: 'tax-discount', fields: ['price', 'rate'] },
  'currency-converter': { handler: 'conversion', fields: ['amount', 'from', 'to'] },
  'stock-calculator': { handler: 'investment', fields: ['shares', 'buyPrice', 'sellPrice'] },
  'dividend-calculator': { handler: 'investment', fields: ['shares', 'dividend'] },
  'bond-calculator': { handler: 'investment', fields: ['faceValue', 'coupon', 'years'] },
  
  // Health
  'bmi-calculator': { handler: 'health-bmi', fields: ['weight', 'heightFeet', 'heightInches'], imperial: true },
  'calorie-calculator': { handler: 'health-calories', fields: ['weight', 'heightFeet', 'heightInches', 'age', 'gender', 'activityLevel'], imperial: true },
  'tdee-calculator': { handler: 'health-calories', fields: ['weight', 'heightFeet', 'heightInches', 'age', 'gender', 'activityLevel'], imperial: true },
  'bmr-calculator': { handler: 'health-calories', fields: ['weight', 'heightFeet', 'heightInches', 'age', 'gender', 'activityLevel'], imperial: true },
  'body-fat-calculator': { handler: 'health-bmi', fields: ['weight', 'waist', 'neck', 'heightFeet', 'heightInches', 'gender'], imperial: true },
  'ideal-weight-calculator': { handler: 'health-bmi', fields: ['heightFeet', 'heightInches', 'gender'], imperial: true },
  'lean-body-mass-calculator': { handler: 'health-bmi', fields: ['weight', 'bodyFat'], imperial: true },
  'protein-calculator': { handler: 'health-calories', fields: ['weight', 'activityLevel'], imperial: true },
  'carb-calculator': { handler: 'health-calories', fields: ['weight', 'activityLevel'], imperial: true },
  'macro-calculator': { handler: 'health-calories', fields: ['weight', 'goal', 'activityLevel'], imperial: true },
  'water-intake-calculator': { handler: 'health-calories', fields: ['weight'], imperial: true },
  'pace-calculator': { handler: 'health-fitness', fields: ['distance', 'time'] },
  'running-calculator': { handler: 'health-fitness', fields: ['distance', 'time'] },
  'heart-rate-calculator': { handler: 'health-fitness', fields: ['age', 'restingHR'] },
  'vo2-max-calculator': { handler: 'health-fitness', fields: ['distance', 'time'] },
  'blood-pressure-calculator': { handler: 'other', fields: ['systolic', 'diastolic'] },
  'bac-calculator': { handler: 'health-fitness', fields: ['weight', 'drinks', 'hours', 'gender'], imperial: true },
  'sleep-calculator': { handler: 'date-time', fields: ['bedtime', 'wakeup'] },
  'one-rep-max-calculator': { handler: 'health-fitness', fields: ['weight', 'reps'] },
  'pregnancy-calculator': { handler: 'date-time', fields: ['lastPeriod'] },
  'due-date-calculator': { handler: 'date-time', fields: ['lastPeriod'] },
  'ovulation-calculator': { handler: 'date-time', fields: ['lastPeriod', 'cycleLength'] },
  'conception-calculator': { handler: 'date-time', fields: ['dueDate'] },
  'period-calculator': { handler: 'date-time', fields: ['lastPeriod', 'cycleLength'] },
  'body-type-calculator': { handler: 'other', fields: ['measurements'] },
  
  // Other - Date & Time
  'age-calculator': { handler: 'date-time', fields: ['birthDate'] },
  'date-calculator': { handler: 'date-time', fields: ['startDate', 'days'] },
  'time-calculator': { handler: 'date-time', fields: ['time1', 'time2'] },
  'hours-calculator': { handler: 'date-time', fields: ['startTime', 'endTime'] },
  'time-zone-converter': { handler: 'date-time', fields: ['time', 'fromZone', 'toZone'] },
  'birthday-calculator': { handler: 'date-time', fields: ['birthDate'] },
  'days-until-calculator': { handler: 'date-time', fields: ['targetDate'] },
  
  // Other - Grades
  'gpa-calculator': { handler: 'grade', fields: ['grades'] },
  'grade-calculator': { handler: 'grade', fields: ['scores', 'weights'] },
  'test-grade-calculator': { handler: 'grade', fields: ['correct', 'total'] },
  'final-grade-calculator': { handler: 'grade', fields: ['current', 'finalWeight', 'targetGrade'] },
  'weighted-grade-calculator': { handler: 'grade', fields: ['scores', 'weights'] },
  
  // Other - Construction
  'concrete-calculator': { handler: 'construction', fields: ['length', 'width', 'depth'], imperial: true },
  'paint-calculator': { handler: 'construction', fields: ['sqft', 'coats'] },
  'flooring-calculator': { handler: 'construction', fields: ['length', 'width'], imperial: true },
  'tile-calculator': { handler: 'construction', fields: ['roomLength', 'roomWidth', 'tileLength', 'tileWidth'], imperial: true },
  'gravel-calculator': { handler: 'construction', fields: ['length', 'width', 'depth'], imperial: true },
  'mulch-calculator': { handler: 'construction', fields: ['length', 'width', 'depth'], imperial: true },
  'soil-calculator': { handler: 'construction', fields: ['length', 'width', 'depth'], imperial: true },
  'square-footage-calculator': { handler: 'construction', fields: ['length', 'width'], imperial: true },
  'roof-calculator': { handler: 'construction', fields: ['length', 'width', 'pitch'], imperial: true },
  'fence-calculator': { handler: 'construction', fields: ['perimeter', 'height'], imperial: true },
  
  // Other - Conversions
  'temperature-converter': { handler: 'conversion', fields: ['fahrenheit'], imperial: true },
  'length-converter': { handler: 'conversion', fields: ['feet'], imperial: true },
  'weight-converter': { handler: 'conversion', fields: ['pounds'], imperial: true },
  'volume-converter': { handler: 'conversion', fields: ['gallons'], imperial: true },
  'area-converter': { handler: 'conversion', fields: ['sqft'], imperial: true },
  'speed-converter': { handler: 'conversion', fields: ['mph'], imperial: true },
  'time-converter': { handler: 'conversion', fields: ['hours'] },
  'pressure-converter': { handler: 'conversion', fields: ['psi'], imperial: true },
  'energy-converter': { handler: 'conversion', fields: ['btus'], imperial: true },
  'power-converter': { handler: 'conversion', fields: ['watts'] },
  'miles-to-km': { handler: 'conversion', fields: ['miles'], imperial: true },
  'kg-to-lbs': { handler: 'conversion', fields: ['pounds'], imperial: true },
  'cm-to-inches': { handler: 'conversion', fields: ['inches'], imperial: true },
  'feet-to-meters': { handler: 'conversion', fields: ['feet'], imperial: true },
  'gallons-to-liters': { handler: 'conversion', fields: ['gallons'], imperial: true },
  'celsius-to-fahrenheit': { handler: 'conversion', fields: ['fahrenheit'], imperial: true },
  
  // Other - Automotive
  'fuel-calculator': { handler: 'arithmetic', fields: ['miles', 'gallons'], imperial: true },
  'gas-mileage-calculator': { handler: 'arithmetic', fields: ['miles', 'gallons'], imperial: true },
  'car-payment-calculator': { handler: 'loan', fields: ['principal', 'rate', 'term'] },
  'tire-size-calculator': { handler: 'other', fields: ['width', 'ratio', 'diameter'] },
  
  // Other - Home
  'btu-calculator': { handler: 'arithmetic', fields: ['sqft'] },
  'air-conditioner-calculator': { handler: 'arithmetic', fields: ['sqft'] },
  'electricity-calculator': { handler: 'arithmetic', fields: ['watts', 'hours', 'rate'] },
  'carbon-footprint-calculator': { handler: 'other', fields: ['miles', 'electricity', 'gas'] },
  
  // Other - Pets & Animals
  'dog-age-calculator': { handler: 'arithmetic', fields: ['dogAge'] },
  'cat-age-calculator': { handler: 'arithmetic', fields: ['catAge'] },
  'pet-food-calculator': { handler: 'arithmetic', fields: ['weight', 'activity'] },
  'aquarium-calculator': { handler: 'geometry', fields: ['length', 'width', 'height'], imperial: true },
  
  // Other - Probability & Games
  'lottery-calculator': { handler: 'number-theory', fields: ['balls', 'picks'] },
  'probability-calculator': { handler: 'number-theory', fields: ['favorable', 'total'] },
  'odds-calculator': { handler: 'arithmetic', fields: ['odds'] },
  'dice-roller': { handler: 'random', fields: ['sides', 'count'] },
  'coin-flip': { handler: 'random', fields: ['flips'] },
  
  // Other - Events
  'wedding-budget-calculator': { handler: 'other', fields: ['guests', 'perPerson'] },
  'party-calculator': { handler: 'arithmetic', fields: ['people', 'costPerPerson'] },
  
  // Other - Cooking
  'recipe-converter': { handler: 'arithmetic', fields: ['originalServings', 'desiredServings'] },
  'cooking-time-calculator': { handler: 'arithmetic', fields: ['weight', 'temperature'] },
  'batch-calculator': { handler: 'arithmetic', fields: ['originalBatch', 'desiredBatch'] },
  'pizza-calculator': { handler: 'other', fields: ['pizzas', 'doughBalls'] },
  
  // Other - Digital & Screen
  'screen-size-calculator': { handler: 'geometry', fields: ['diagonal', 'ratio'] },
  'aspect-ratio-calculator': { handler: 'arithmetic', fields: ['width', 'height'] },
  'dpi-calculator': { handler: 'arithmetic', fields: ['width', 'height', 'diagonal'] },
  'pixels-to-inches': { handler: 'conversion', fields: ['pixels', 'dpi'] },
  'golden-ratio-calculator': { handler: 'arithmetic', fields: ['value'] },
  
  // Other - Text & Tools
  'password-generator': { handler: 'generator', fields: ['length'] },
  'subnet-calculator': { handler: 'other', fields: ['ip', 'subnet'] },
  'text-compare': { handler: 'text', fields: ['text1', 'text2'] },
  'word-counter': { handler: 'text', fields: ['text'] },
  'character-counter': { handler: 'text', fields: ['text'] },
  'case-converter': { handler: 'text', fields: ['text', 'case'] },
};
