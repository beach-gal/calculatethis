// Calculator handler functions organized by type
// Each handler implements the calculation logic for a category of calculators

export interface CalculatorInputs {
  [key: string]: string;
}

// Helper functions
const parseNum = (val: string | undefined, defaultVal: number = 0): number => {
  const num = parseFloat(val || String(defaultVal));
  return isNaN(num) ? defaultVal : num;
};

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const lcm = (a: number, b: number): number => Math.abs(a * b) / gcd(a, b);

// Arithmetic Handlers
export function handleArithmetic(slug: string, inputs: CalculatorInputs): string {
  if (slug === 'basic-calculator' || slug === 'scientific-calculator') {
    const expression = inputs.expression || '';
    if (!expression) return 'Please enter an expression to calculate';
    
    try {
      // Safe expression evaluation - only allow numbers and basic operators
      const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');
      if (sanitized !== expression) {
        return 'Invalid characters in expression. Use only numbers and operators (+, -, *, /, ())';
      }
      
      // Evaluate using Function constructor (safer than eval)
      const result = Function('"use strict"; return (' + sanitized + ')')();
      
      if (typeof result !== 'number' || !isFinite(result)) {
        return 'Invalid expression';
      }
      
      return `${expression} = ${result}`;
    } catch (error) {
      return 'Invalid expression. Please check your input.';
    }
  }
  
  if (slug === 'ratio-calculator') {
    const a = parseNum(inputs.a);
    const b = parseNum(inputs.b);
    const divisor = gcd(a, b);
    return `Simplified Ratio: ${(a / divisor).toFixed(0)}:${(b / divisor).toFixed(0)}`;
  }
  
  if (slug === 'fraction-calculator') {
    const num1 = parseNum(inputs.numerator1);
    const den1 = parseNum(inputs.denominator1, 1);
    const num2 = parseNum(inputs.numerator2);
    const den2 = parseNum(inputs.denominator2, 1);
    const op = inputs.operation || 'add';
    
    let resultNum = 0, resultDen = 1;
    if (op === 'add') {
      resultNum = num1 * den2 + num2 * den1;
      resultDen = den1 * den2;
    } else if (op === 'subtract') {
      resultNum = num1 * den2 - num2 * den1;
      resultDen = den1 * den2;
    } else if (op === 'multiply') {
      resultNum = num1 * num2;
      resultDen = den1 * den2;
    } else {
      resultNum = num1 * den2;
      resultDen = den1 * num2;
    }
    
    const divisor = gcd(Math.abs(resultNum), Math.abs(resultDen));
    return `Result: ${(resultNum/divisor).toFixed(0)}/${(resultDen/divisor).toFixed(0)} = ${(resultNum/resultDen).toFixed(4)}`;
  }
  
  if (slug === 'rounding-calculator') {
    const num = parseNum(inputs.number);
    const decimals = parseInt(inputs.decimals || '0');
    return `Rounded: ${num.toFixed(decimals)}`;
  }
  
  if (slug === 'absolute-value-calculator') {
    const num = parseNum(inputs.number);
    return `|${num}| = ${Math.abs(num)}`;
  }
  
  if (slug === 'modulo-calculator') {
    const a = parseNum(inputs.a);
    const b = parseNum(inputs.b, 1);
    return `${a} mod ${b} = ${a % b}`;
  }
  
  if (slug === 'mixed-number-calculator') {
    const whole = parseNum(inputs.whole);
    const num = parseNum(inputs.numerator);
    const den = parseNum(inputs.denominator, 1);
    const improper = whole * den + num;
    return `Mixed: ${whole} ${num}/${den} = Improper: ${improper}/${den} = ${(improper/den).toFixed(4)}`;
  }
  
  if (slug === 'sig-fig-calculator') {
    const num = parseNum(inputs.number);
    const sigfigs = parseInt(inputs.sigfigs || '3');
    return `${num} with ${sigfigs} sig figs = ${num.toPrecision(sigfigs)}`;
  }
  
  if (slug === 'gas-mileage-calculator' || slug === 'fuel-calculator') {
    const miles = parseNum(inputs.miles);
    const gallons = parseNum(inputs.gallons, 1);
    return `Fuel Economy: ${(miles/gallons).toFixed(1)} MPG`;
  }
  
  if (slug === 'dog-age-calculator') {
    const age = parseNum(inputs.dogAge);
    const human = age <= 2 ? age * 10.5 : 21 + (age - 2) * 4;
    return `Dog Age: ${age} years = Human Age: ${human.toFixed(0)} years`;
  }
  
  if (slug === 'cat-age-calculator') {
    const age = parseNum(inputs.catAge);
    const human = age === 1 ? 15 : age === 2 ? 24 : 24 + (age - 2) * 4;
    return `Cat Age: ${age} years = Human Age: ${human.toFixed(0)} years`;
  }
  
  if (slug === 'pet-food-calculator') {
    const weight = parseNum(inputs.weight);
    const activity = inputs.activity || 'moderate';
    const multiplier = activity === 'low' ? 0.8 : activity === 'high' ? 1.2 : 1.0;
    const cups = weight * 0.02 * multiplier;
    return `Daily Food: ${cups.toFixed(1)} cups`;
  }
  
  if (slug === 'party-calculator') {
    const people = parseNum(inputs.people);
    const cost = parseNum(inputs.costPerPerson);
    return `Total Cost: $${(people * cost).toFixed(2)}`;
  }
  
  if (slug === 'recipe-converter') {
    const original = parseNum(inputs.originalServings, 1);
    const desired = parseNum(inputs.desiredServings, 1);
    const ratio = desired / original;
    return `Multiply all ingredients by ${ratio.toFixed(2)}`;
  }
  
  if (slug === 'cooking-time-calculator') {
    const weight = parseNum(inputs.weight);
    const temp = parseNum(inputs.temperature);
    const minutes = weight * 20; // Simple estimate
    return `Cooking Time: ${minutes.toFixed(0)} minutes at ${temp}°F`;
  }
  
  if (slug === 'batch-calculator') {
    const original = parseNum(inputs.originalBatch, 1);
    const desired = parseNum(inputs.desiredBatch, 1);
    const ratio = desired / original;
    return `Multiply all ingredients by ${ratio.toFixed(2)}`;
  }
  
  if (slug === 'aspect-ratio-calculator') {
    const width = parseNum(inputs.width);
    const height = parseNum(inputs.height);
    const divisor = gcd(width, height);
    return `Aspect Ratio: ${(width/divisor).toFixed(0)}:${(height/divisor).toFixed(0)}`;
  }
  
  if (slug === 'dpi-calculator') {
    const width = parseNum(inputs.width);
    const height = parseNum(inputs.height);
    const diagonal = parseNum(inputs.diagonal, 1);
    const diagonalPixels = Math.sqrt(width*width + height*height);
    const dpi = diagonalPixels / diagonal;
    return `DPI: ${dpi.toFixed(0)}`;
  }
  
  if (slug === 'golden-ratio-calculator') {
    const value = parseNum(inputs.value);
    const phi = 1.618033988749;
    return `Golden Ratio: ${value} × 1.618 = ${(value * phi).toFixed(2)}`;
  }
  
  if (slug === 'btu-calculator') {
    const sqft = parseNum(inputs.sqft);
    const btus = sqft * 20; // 20 BTU per sq ft
    return `BTU Needed: ${btus.toFixed(0)} BTU/hr`;
  }
  
  if (slug === 'air-conditioner-calculator') {
    const sqft = parseNum(inputs.sqft);
    const tons = sqft / 600; // 1 ton per 600 sqft
    return `AC Size: ${tons.toFixed(1)} tons (${(tons * 12000).toFixed(0)} BTU)`;
  }
  
  if (slug === 'electricity-calculator') {
    const watts = parseNum(inputs.watts);
    const hours = parseNum(inputs.hours);
    const rate = parseNum(inputs.rate, 0.12);
    const kwh = (watts * hours) / 1000;
    const cost = kwh * rate;
    return `Energy: ${kwh.toFixed(2)} kWh | Cost: $${cost.toFixed(2)}`;
  }
  
  if (slug === 'odds-calculator') {
    const odds = inputs.odds || '1:1';
    const parts = odds.split(':');
    const prob = parseFloat(parts[0]) / (parseFloat(parts[0]) + parseFloat(parts[1]));
    return `Probability: ${(prob * 100).toFixed(2)}%`;
  }
  
  return 'Calculation complete';
}

// Percentage Handler
export function handlePercentage(slug: string, inputs: CalculatorInputs): string {
  const value = parseNum(inputs.value);
  const percentage = parseNum(inputs.percentage);
  const result = value * percentage / 100;
  return `${percentage}% of ${value} = ${result.toFixed(2)}`;
}

// Statistics Handler
export function handleStatistics(slug: string, inputs: CalculatorInputs): string {
  const values = (inputs.values || '').split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
  if (values.length === 0) return 'Please enter values separated by commas';
  
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const sorted = [...values].sort((a, b) => a - b);
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];
  
  if (slug === 'standard-deviation-calculator') {
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    return `Mean: ${mean.toFixed(2)} | Std Dev: ${stdDev.toFixed(4)} | Variance: ${variance.toFixed(4)}`;
  }
  
  return `Mean: ${mean.toFixed(2)} | Median: ${median.toFixed(2)}`;
}

// Number Theory Handler
export function handleNumberTheory(slug: string, inputs: CalculatorInputs): string {
  if (slug === 'factorial-calculator') {
    const n = parseInt(inputs.number || '0');
    if (n < 0) return 'Factorial not defined for negative numbers';
    if (n > 170) return 'Number too large (max 170)';
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return `${n}! = ${result}`;
  }
  
  if (slug === 'combination-calculator') {
    const n = parseInt(inputs.n || '0');
    const r = parseInt(inputs.r || '0');
    if (r > n) return 'r cannot be greater than n';
    const fact = (num: number): number => num <= 1 ? 1 : num * fact(num - 1);
    const nCr = fact(n) / (fact(r) * fact(n - r));
    return `C(${n},${r}) = ${nCr}`;
  }
  
  if (slug === 'permutation-calculator') {
    const n = parseInt(inputs.n || '0');
    const r = parseInt(inputs.r || '0');
    if (r > n) return 'r cannot be greater than n';
    const fact = (num: number): number => num <= 1 ? 1 : num * fact(num - 1);
    const nPr = fact(n) / fact(n - r);
    return `P(${n},${r}) = ${nPr}`;
  }
  
  if (slug === 'prime-number-calculator') {
    const num = parseInt(inputs.number || '0');
    if (num < 2) return `${num} is not prime`;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return `${num} is not prime`;
    }
    return `${num} is prime`;
  }
  
  if (slug === 'lcm-calculator') {
    const a = parseInt(inputs.a || '0');
    const b = parseInt(inputs.b || '0');
    return `LCM(${a}, ${b}) = ${lcm(a, b)}`;
  }
  
  if (slug === 'gcf-calculator') {
    const a = parseInt(inputs.a || '0');
    const b = parseInt(inputs.b || '0');
    return `GCF(${a}, ${b}) = ${gcd(a, b)}`;
  }
  
  if (slug === 'divisibility-calculator') {
    const num = parseInt(inputs.number || '0');
    const divisor = parseInt(inputs.divisor || '1');
    const divisible = num % divisor === 0;
    return `${num} is ${divisible ? '' : 'NOT '}divisible by ${divisor}`;
  }
  
  if (slug === 'lottery-calculator') {
    const balls = parseInt(inputs.balls || '49');
    const picks = parseInt(inputs.picks || '6');
    const fact = (n: number): number => n <= 1 ? 1 : n * fact(n - 1);
    const combinations = fact(balls) / (fact(picks) * fact(balls - picks));
    return `Odds: 1 in ${combinations.toFixed(0)}`;
  }
  
  if (slug === 'probability-calculator') {
    const favorable = parseNum(inputs.favorable);
    const total = parseNum(inputs.total, 1);
    const prob = (favorable / total) * 100;
    return `Probability: ${prob.toFixed(2)}% (${favorable}/${total})`;
  }
  
  return 'Calculation complete';
}

// Algebra Handler
export function handleAlgebra(slug: string, inputs: CalculatorInputs): string {
  if (slug === 'exponent-calculator') {
    const base = parseNum(inputs.base);
    const exponent = parseNum(inputs.exponent);
    return `${base}^${exponent} = ${Math.pow(base, exponent).toFixed(6)}`;
  }
  
  if (slug === 'square-root-calculator') {
    const num = parseNum(inputs.number);
    return `√${num} = ${Math.sqrt(num).toFixed(6)} | ∛${num} = ${Math.cbrt(num).toFixed(6)}`;
  }
  
  if (slug === 'quadratic-formula-calculator') {
    const a = parseNum(inputs.a);
    const b = parseNum(inputs.b);
    const c = parseNum(inputs.c);
    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) return 'No real solutions (discriminant < 0)';
    const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    return `x₁ = ${x1.toFixed(4)} | x₂ = ${x2.toFixed(4)}`;
  }
  
  if (slug === 'log-calculator') {
    const num = parseNum(inputs.number);
    const base = parseNum(inputs.base, 10);
    const result = Math.log(num) / Math.log(base);
    return `log₍${base}₎(${num}) = ${result.toFixed(6)}`;
  }
  
  if (slug === 'antilog-calculator') {
    const num = parseNum(inputs.number);
    const base = parseNum(inputs.base, 10);
    const result = Math.pow(base, num);
    return `antilog₍${base}₎(${num}) = ${result.toFixed(6)}`;
  }
  
  if (slug === 'slope-calculator') {
    const x1 = parseNum(inputs.x1);
    const y1 = parseNum(inputs.y1);
    const x2 = parseNum(inputs.x2);
    const y2 = parseNum(inputs.y2);
    const slope = (y2 - y1) / (x2 - x1);
    return `Slope: ${slope.toFixed(4)}`;
  }
  
  if (slug === 'distance-calculator') {
    const x1 = parseNum(inputs.x1);
    const y1 = parseNum(inputs.y1);
    const x2 = parseNum(inputs.x2);
    const y2 = parseNum(inputs.y2);
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    return `Distance: ${distance.toFixed(4)}`;
  }
  
  if (slug === 'midpoint-calculator') {
    const x1 = parseNum(inputs.x1);
    const y1 = parseNum(inputs.y1);
    const x2 = parseNum(inputs.x2);
    const y2 = parseNum(inputs.y2);
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    return `Midpoint: (${midX.toFixed(2)}, ${midY.toFixed(2)})`;
  }
  
  return 'Calculation complete';
}

// Geometry Handler
export function handleGeometry(slug: string, inputs: CalculatorInputs): string {
  if (slug === 'circle-calculator') {
    const radius = parseNum(inputs.radius);
    const area = Math.PI * radius * radius;
    const circumference = 2 * Math.PI * radius;
    const diameter = 2 * radius;
    return `Area: ${area.toFixed(2)} | Circumference: ${circumference.toFixed(2)} | Diameter: ${diameter.toFixed(2)}`;
  }
  
  if (slug === 'triangle-calculator') {
    const a = parseNum(inputs.side1);
    const b = parseNum(inputs.side2);
    const c = parseNum(inputs.side3);
    const s = (a + b + c) / 2;
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    return `Perimeter: ${(a + b + c).toFixed(2)} | Area: ${area.toFixed(2)}`;
  }
  
  if (slug === 'pythagorean-theorem-calculator') {
    const a = parseNum(inputs.a);
    const b = parseNum(inputs.b);
    const c = Math.sqrt(a * a + b * b);
    return `Hypotenuse (c): ${c.toFixed(4)}`;
  }
  
  if (slug === 'aquarium-calculator') {
    const length = parseNum(inputs.length);
    const width = parseNum(inputs.width);
    const height = parseNum(inputs.height);
    const gallons = (length * width * height) / 231; // cubic inches to gallons
    return `Volume: ${gallons.toFixed(1)} gallons`;
  }
  
  if (slug === 'screen-size-calculator') {
    const diagonal = parseNum(inputs.diagonal);
    const ratio = inputs.ratio || '16:9';
    const parts = ratio.split(':');
    const w = parseFloat(parts[0]);
    const h = parseFloat(parts[1]);
    const factor = diagonal / Math.sqrt(w*w + h*h);
    const width = w * factor;
    const height = h * factor;
    return `Dimensions: ${width.toFixed(1)}" × ${height.toFixed(1)}"`;
  }
  
  return 'Calculation complete';
}

// Trigonometry Handler
export function handleTrigonometry(slug: string, inputs: CalculatorInputs): string {
  const angle = parseNum(inputs.angle);
  const radians = angle * Math.PI / 180;
  
  if (slug === 'sine-calculator') {
    return `sin(${angle}°) = ${Math.sin(radians).toFixed(6)}`;
  }
  if (slug === 'cosine-calculator') {
    return `cos(${angle}°) = ${Math.cos(radians).toFixed(6)}`;
  }
  if (slug === 'tangent-calculator') {
    return `tan(${angle}°) = ${Math.tan(radians).toFixed(6)}`;
  }
  
  return 'Calculation complete';
}

// Conversion Handler (Imperial defaults)
export function handleConversion(slug: string, inputs: CalculatorInputs): string {
  if (slug === 'decimal-to-fraction') {
    const decimal = parseNum(inputs.decimal);
    const tolerance = 1.0E-6;
    let numerator = 1, denominator = 1, error = Math.abs(decimal - numerator / denominator);
    while (error > tolerance && denominator < 10000) {
      denominator++;
      numerator = Math.round(decimal * denominator);
      error = Math.abs(decimal - numerator / denominator);
    }
    return `${decimal} = ${numerator}/${denominator}`;
  }
  
  if (slug === 'fraction-to-decimal') {
    const num = parseNum(inputs.numerator);
    const den = parseNum(inputs.denominator, 1);
    return `${num}/${den} = ${(num / den).toFixed(6)}`;
  }
  
  if (slug === 'base-converter' || slug === 'binary-converter') {
    const number = inputs.number || '0';
    const fromBase = parseInt(inputs.fromBase || '10');
    const toBase = parseInt(inputs.toBase || '10');
    const decimal = parseInt(number, fromBase);
    const result = decimal.toString(toBase);
    return `${number} (base ${fromBase}) = ${result.toUpperCase()} (base ${toBase})`;
  }
  
  if (slug === 'temperature-converter' || slug === 'celsius-to-fahrenheit') {
    const fahrenheit = parseNum(inputs.fahrenheit, 32);
    const celsius = (fahrenheit - 32) * 5 / 9;
    const kelvin = celsius + 273.15;
    return `${fahrenheit}°F = ${celsius.toFixed(2)}°C = ${kelvin.toFixed(2)}K`;
  }
  
  if (slug === 'length-converter' || slug === 'feet-to-meters') {
    const feet = parseNum(inputs.feet);
    const meters = feet * 0.3048;
    const inches = feet * 12;
    return `${feet} ft = ${meters.toFixed(2)} m = ${inches.toFixed(0)} in`;
  }
  
  if (slug === 'miles-to-km') {
    const miles = parseNum(inputs.miles);
    const km = miles * 1.60934;
    return `${miles} miles = ${km.toFixed(2)} km`;
  }
  
  if (slug === 'weight-converter' || slug === 'kg-to-lbs') {
    const pounds = parseNum(inputs.pounds);
    const kg = pounds * 0.453592;
    const ounces = pounds * 16;
    return `${pounds} lbs = ${kg.toFixed(2)} kg = ${ounces.toFixed(0)} oz`;
  }
  
  if (slug === 'cm-to-inches') {
    const inches = parseNum(inputs.inches);
    const cm = inches * 2.54;
    return `${inches} in = ${cm.toFixed(2)} cm`;
  }
  
  if (slug === 'volume-converter' || slug === 'gallons-to-liters') {
    const gallons = parseNum(inputs.gallons);
    const liters = gallons * 3.78541;
    const quarts = gallons * 4;
    return `${gallons} gal = ${liters.toFixed(2)} L = ${quarts.toFixed(2)} qt`;
  }
  
  if (slug === 'speed-converter') {
    const mph = parseNum(inputs.mph);
    const kmh = mph * 1.60934;
    const fps = mph * 1.46667;
    return `${mph} mph = ${kmh.toFixed(2)} km/h = ${fps.toFixed(2)} ft/s`;
  }
  
  if (slug === 'area-converter') {
    const sqft = parseNum(inputs.sqft);
    const sqm = sqft * 0.092903;
    return `${sqft} sq ft = ${sqm.toFixed(2)} sq m`;
  }
  
  if (slug === 'time-converter') {
    const hours = parseNum(inputs.hours);
    return `${hours} hours = ${(hours * 60).toFixed(0)} min = ${(hours * 3600).toFixed(0)} sec`;
  }
  
  if (slug === 'pressure-converter') {
    const psi = parseNum(inputs.psi);
    const kpa = psi * 6.89476;
    return `${psi} PSI = ${kpa.toFixed(2)} kPa`;
  }
  
  if (slug === 'energy-converter') {
    const btus = parseNum(inputs.btus);
    const joules = btus * 1055.06;
    return `${btus} BTU = ${joules.toFixed(2)} J`;
  }
  
  if (slug === 'power-converter') {
    const watts = parseNum(inputs.watts);
    const hp = watts / 745.7;
    return `${watts} W = ${hp.toFixed(3)} HP`;
  }
  
  if (slug === 'pixels-to-inches') {
    const pixels = parseNum(inputs.pixels);
    const dpi = parseNum(inputs.dpi, 96);
    const inches = pixels / dpi;
    return `${pixels} pixels at ${dpi} DPI = ${inches.toFixed(2)} inches`;
  }
  
  return 'Conversion complete';
}

// Loan Handler
export function handleLoan(slug: string, inputs: CalculatorInputs): string {
  const principal = parseNum(inputs.principal);
  const rate = parseNum(inputs.rate) / 100 / 12;
  const term = parseNum(inputs.term) * 12;
  
  if (rate === 0) {
    const monthlyPayment = principal / term;
    return `Monthly Payment: $${monthlyPayment.toFixed(2)} (0% interest)`;
  }
  
  const monthlyPayment = principal * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
  const totalPaid = monthlyPayment * term;
  const totalInterest = totalPaid - principal;
  
  if (slug === 'debt-calculator' || slug === 'credit-card-calculator') {
    let months = 0, currentBalance = principal, totalInt = 0;
    const payment = parseNum(inputs.payment, monthlyPayment);
    
    while (currentBalance > 0 && months < 600) {
      const interest = currentBalance * rate;
      totalInt += interest;
      currentBalance = currentBalance + interest - payment;
      months++;
      if (payment <= interest) return 'Payment too small - debt will never be paid off!';
    }
    
    return `Payoff Time: ${months} months (${(months / 12).toFixed(1)} years) | Total Interest: $${totalInt.toFixed(2)}`;
  }
  
  return `Monthly Payment: $${monthlyPayment.toFixed(2)} | Total Interest: $${totalInterest.toFixed(2)} | Total: $${totalPaid.toFixed(2)}`;
}

// Investment Handler
export function handleInvestment(slug: string, inputs: CalculatorInputs): string {
  if (slug === 'simple-interest-calculator') {
    const principal = parseNum(inputs.principal);
    const rate = parseNum(inputs.rate) / 100;
    const time = parseNum(inputs.time);
    const interest = principal * rate * time;
    return `Interest: $${interest.toFixed(2)} | Total: $${(principal + interest).toFixed(2)}`;
  }
  
  if (slug === 'compound-interest-calculator' || slug === 'interest-calculator') {
    const principal = parseNum(inputs.principal);
    const rate = parseNum(inputs.rate) / 100;
    const time = parseNum(inputs.time);
    const frequency = parseNum(inputs.frequency, 12);
    const amount = principal * Math.pow(1 + rate / frequency, frequency * time);
    const interest = amount - principal;
    return `Final Amount: $${amount.toFixed(2)} | Interest: $${interest.toFixed(2)}`;
  }
  
  if (slug === 'roi-calculator') {
    const initial = parseNum(inputs.initial);
    const final = parseNum(inputs.final);
    const roi = ((final - initial) / initial) * 100;
    return `ROI: ${roi.toFixed(2)}% | Gain/Loss: $${(final - initial).toFixed(2)}`;
  }
  
  if (['savings-calculator', 'investment-calculator', 'retirement-calculator', '401k-calculator', 'roth-ira-calculator', 'college-savings-calculator'].includes(slug)) {
    const initial = parseNum(inputs.initial);
    const monthly = parseNum(inputs.monthly);
    const rate = parseNum(inputs.rate) / 100 / 12;
    const years = parseNum(inputs.years);
    const months = years * 12;
    const futureValue = initial * Math.pow(1 + rate, months) + monthly * ((Math.pow(1 + rate, months) - 1) / rate);
    const totalContributions = initial + monthly * months;
    const earnings = futureValue - totalContributions;
    return `Future Value: $${futureValue.toFixed(2)} | Contributions: $${totalContributions.toFixed(2)} | Earnings: $${earnings.toFixed(2)}`;
  }
  
  if (slug === 'inflation-calculator') {
    const amount = parseNum(inputs.amount);
    const years = parseNum(inputs.years);
    const rate = parseNum(inputs.rate, 3) / 100;
    const future = amount * Math.pow(1 + rate, years);
    return `$${amount} today = $${future.toFixed(2)} in ${years} years (${rate * 100}% inflation)`;
  }
  
  if (slug === 'depreciation-calculator') {
    const cost = parseNum(inputs.cost);
    const salvage = parseNum(inputs.salvage);
    const years = parseNum(inputs.years, 1);
    const annual = (cost - salvage) / years;
    return `Annual Depreciation: $${annual.toFixed(2)} | Value after ${years} years: $${salvage.toFixed(2)}`;
  }
  
  if (slug === 'stock-calculator') {
    const shares = parseNum(inputs.shares);
    const buy = parseNum(inputs.buyPrice);
    const sell = parseNum(inputs.sellPrice);
    const profit = (sell - buy) * shares;
    const roi = ((sell - buy) / buy) * 100;
    return `Profit/Loss: $${profit.toFixed(2)} | ROI: ${roi.toFixed(2)}%`;
  }
  
  if (slug === 'dividend-calculator') {
    const shares = parseNum(inputs.shares);
    const dividend = parseNum(inputs.dividend);
    const annual = shares * dividend;
    return `Annual Dividends: $${annual.toFixed(2)} | Quarterly: $${(annual / 4).toFixed(2)}`;
  }
  
  if (slug === 'apr-calculator') {
    const principal = parseNum(inputs.principal);
    const fee = parseNum(inputs.fee);
    const term = parseNum(inputs.term, 1);
    const apr = (fee / principal / term) * 100;
    return `APR: ${apr.toFixed(2)}%`;
  }
  
  if (slug === 'apy-calculator') {
    const rate = parseNum(inputs.rate) / 100;
    const frequency = parseNum(inputs.frequency, 12);
    const apy = (Math.pow(1 + rate / frequency, frequency) - 1) * 100;
    return `APY: ${apy.toFixed(2)}%`;
  }
  
  return 'Calculation complete';
}

// Salary Handler
export function handleSalary(slug: string, inputs: CalculatorInputs): string {
  if (slug === 'salary-to-hourly') {
    const annual = parseNum(inputs.annual);
    const hours = parseNum(inputs.hoursPerWeek, 40);
    const hourly = annual / (hours * 52);
    return `Hourly: $${hourly.toFixed(2)} | Weekly: $${(annual / 52).toFixed(2)} | Monthly: $${(annual / 12).toFixed(2)}`;
  }
  
  const hourly = parseNum(inputs.hourly);
  const hours = parseNum(inputs.hoursPerWeek, 40);
  const annual = hourly * hours * 52;
  return `Annual: $${annual.toFixed(2)} | Monthly: $${(annual / 12).toFixed(2)} | Weekly: $${(annual / 52).toFixed(2)}`;
}

// Tax & Discount Handler
export function handleTaxDiscount(slug: string, inputs: CalculatorInputs): string {
  if (slug === 'tip-calculator') {
    const bill = parseNum(inputs.bill);
    const tipPercent = parseNum(inputs.tip, 15);
    const people = parseNum(inputs.people, 1);
    const tip = bill * tipPercent / 100;
    const total = bill + tip;
    const perPerson = total / people;
    return `Tip: $${tip.toFixed(2)} | Total: $${total.toFixed(2)} | Per Person: $${perPerson.toFixed(2)}`;
  }
  
  if (slug === 'discount-calculator') {
    const original = parseNum(inputs.original);
    const discount = parseNum(inputs.discount);
    const amount = original * discount / 100;
    const final = original - amount;
    return `Discount: $${amount.toFixed(2)} | Final Price: $${final.toFixed(2)} | Save: ${discount}%`;
  }
  
  if (slug === 'markup-calculator') {
    const cost = parseNum(inputs.cost);
    const markup = parseNum(inputs.markup);
    const price = cost * (1 + markup / 100);
    return `Selling Price: $${price.toFixed(2)} | Markup: $${(price - cost).toFixed(2)}`;
  }
  
  if (slug === 'margin-calculator') {
    const revenue = parseNum(inputs.revenue);
    const cost = parseNum(inputs.cost);
    const profit = revenue - cost;
    const margin = (profit / revenue) * 100;
    return `Profit: $${profit.toFixed(2)} | Margin: ${margin.toFixed(2)}%`;
  }
  
  if (slug === 'sales-tax-calculator' || slug === 'vat-calculator') {
    const price = parseNum(inputs.price);
    const rate = parseNum(slug === 'vat-calculator' ? inputs.vatRate : inputs.taxRate);
    const tax = price * rate / 100;
    return `Tax: $${tax.toFixed(2)} | Total: $${(price + tax).toFixed(2)}`;
  }
  
  if (slug === 'property-tax-calculator') {
    const value = parseNum(inputs.value);
    const rate = parseNum(inputs.rate);
    const tax = value * rate / 100;
    return `Annual Property Tax: $${tax.toFixed(2)} | Monthly: $${(tax / 12).toFixed(2)}`;
  }
  
  if (slug === 'commission-calculator') {
    const sales = parseNum(inputs.sales);
    const rate = parseNum(inputs.rate);
    const commission = sales * rate / 100;
    return `Commission: $${commission.toFixed(2)} (${rate}% of $${sales.toFixed(2)})`;
  }
  
  if (slug === 'closing-costs-calculator') {
    const price = parseNum(inputs.price);
    const rate = parseNum(inputs.rate, 3);
    const costs = price * rate / 100;
    return `Estimated Closing Costs: $${costs.toFixed(2)} (${rate}% of home price)`;
  }
  
  return 'Calculation complete';
}

// Health BMI Handler
export function handleHealthBMI(slug: string, inputs: CalculatorInputs): string {
  const weight = parseNum(inputs.weight);
  const heightFeet = parseNum(inputs.heightFeet);
  const heightInches = parseNum(inputs.heightInches);
  const totalInches = heightFeet * 12 + heightInches;
  
  if (slug === 'bmi-calculator') {
    const bmi = (weight / (totalInches * totalInches)) * 703;
    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';
    return `BMI: ${bmi.toFixed(1)} (${category})`;
  }
  
  if (slug === 'ideal-weight-calculator') {
    const gender = inputs.gender || 'male';
    const baseWeight = gender === 'male' ? 106 : 100;
    const perInch = gender === 'male' ? 6 : 5;
    const idealWeight = baseWeight + perInch * Math.max(0, totalInches - 60);
    return `Ideal Weight: ${idealWeight.toFixed(0)} lbs`;
  }
  
  if (slug === 'body-fat-calculator') {
    const waist = parseNum(inputs.waist);
    const neck = parseNum(inputs.neck);
    const gender = inputs.gender || 'male';
    let bodyFat = 0;
    if (gender === 'male') {
      bodyFat = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(totalInches) + 36.76;
    } else {
      const hip = parseNum(inputs.hip, waist);
      bodyFat = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(totalInches) - 78.387;
    }
    return `Body Fat: ${bodyFat.toFixed(1)}%`;
  }
  
  if (slug === 'lean-body-mass-calculator') {
    const bodyFat = parseNum(inputs.bodyFat);
    const lbm = weight * (1 - bodyFat / 100);
    return `Lean Body Mass: ${lbm.toFixed(1)} lbs | Body Fat: ${(weight - lbm).toFixed(1)} lbs`;
  }
  
  return 'Calculation complete';
}

// Health Calories Handler
export function handleHealthCalories(slug: string, inputs: CalculatorInputs): string {
  const weight = parseNum(inputs.weight);
  const heightFeet = parseNum(inputs.heightFeet);
  const heightInches = parseNum(inputs.heightInches);
  const age = parseNum(inputs.age);
  const gender = inputs.gender || 'male';
  const activityLevel = parseNum(inputs.activityLevel, 1.55);
  
  const totalInches = heightFeet * 12 + heightInches;
  const weightKg = weight * 0.453592;
  const heightCm = totalInches * 2.54;
  
  let bmr;
  if (gender === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
  
  const tdee = bmr * activityLevel;
  
  if (slug === 'bmr-calculator') {
    return `BMR: ${bmr.toFixed(0)} calories/day`;
  }
  
  if (slug === 'protein-calculator') {
    const actLevel = inputs.activityLevel || 'moderate';
    let proteinPerLb = 0.8;
    if (actLevel === 'sedentary') proteinPerLb = 0.6;
    else if (actLevel === 'active') proteinPerLb = 1.0;
    else if (actLevel === 'very-active') proteinPerLb = 1.2;
    const protein = weight * proteinPerLb;
    return `Daily Protein: ${protein.toFixed(0)}g (${(protein * 4).toFixed(0)} calories)`;
  }
  
  if (slug === 'carb-calculator') {
    const carbPercent = 0.45; // 45% of calories
    const carbCals = tdee * carbPercent;
    const carbs = carbCals / 4;
    return `Daily Carbs: ${carbs.toFixed(0)}g (${carbCals.toFixed(0)} calories)`;
  }
  
  if (slug === 'water-intake-calculator') {
    const ounces = weight * 0.67;
    const cups = ounces / 8;
    return `Daily Water: ${ounces.toFixed(0)} oz (${cups.toFixed(1)} cups)`;
  }
  
  return `BMR: ${bmr.toFixed(0)} cal/day | TDEE: ${tdee.toFixed(0)} cal/day`;
}

// Health Fitness Handler
export function handleHealthFitness(slug: string, inputs: CalculatorInputs): string {
  if (slug === 'pace-calculator' || slug === 'running-calculator') {
    const distance = parseNum(inputs.distance);
    const time = parseNum(inputs.time);
    const pace = time / distance;
    const mph = 60 / pace;
    return `Pace: ${pace.toFixed(2)} min/mile | Speed: ${mph.toFixed(2)} mph`;
  }
  
  if (slug === 'heart-rate-calculator') {
    const age = parseNum(inputs.age);
    const resting = parseNum(inputs.restingHR, 70);
    const maxHR = 220 - age;
    const zone1 = Math.round(maxHR * 0.5);
    const zone2 = Math.round(maxHR * 0.6);
    const zone3 = Math.round(maxHR * 0.7);
    const zone4 = Math.round(maxHR * 0.8);
    const zone5 = Math.round(maxHR * 0.9);
    return `Max HR: ${maxHR} bpm | Zones: ${zone1}-${zone2} (warm-up), ${zone2}-${zone3} (fat burn), ${zone3}-${zone4} (cardio), ${zone4}-${zone5} (peak)`;
  }
  
  if (slug === 'vo2-max-calculator') {
    const distance = parseNum(inputs.distance);
    const time = parseNum(inputs.time);
    const vo2max = (distance / time) * 3.5;
    return `VO2 Max: ${vo2max.toFixed(1)} ml/kg/min`;
  }
  
  if (slug === 'one-rep-max-calculator') {
    const weight = parseNum(inputs.weight);
    const reps = parseNum(inputs.reps, 1);
    const oneRM = weight * (1 + reps / 30);
    return `One Rep Max: ${oneRM.toFixed(0)} lbs`;
  }
  
  if (slug === 'bac-calculator') {
    const weight = parseNum(inputs.weight);
    const drinks = parseNum(inputs.drinks);
    const hours = parseNum(inputs.hours, 1);
    const gender = inputs.gender || 'male';
    const r = gender === 'male' ? 0.68 : 0.55;
    const bac = ((drinks * 0.6 * 5.14) / (weight * r)) - (0.015 * hours);
    return `BAC: ${Math.max(0, bac).toFixed(3)}%${bac > 0.08 ? ' (Over legal limit!)' : ''}`;
  }
  
  return 'Calculation complete';
}

// Date & Time Handler
export function handleDateTime(slug: string, inputs: CalculatorInputs): string {
  if (slug === 'age-calculator') {
    const birthDate = new Date(inputs.birthDate || Date.now());
    const today = new Date();
    const years = today.getFullYear() - birthDate.getFullYear();
    const months = today.getMonth() - birthDate.getMonth();
    const days = today.getDate() - birthDate.getDate();
    return `Age: ${years} years, ${months} months, ${days} days`;
  }
  
  if (slug === 'date-calculator') {
    const start = new Date(inputs.startDate || Date.now());
    const daysToAdd = parseNum(inputs.days);
    const result = new Date(start.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    return `Result: ${result.toDateString()}`;
  }
  
  if (slug === 'days-until-calculator' || slug === 'birthday-calculator') {
    const target = new Date(inputs.targetDate || inputs.birthDate || Date.now());
    const today = new Date();
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return `Days Until: ${diff} days`;
  }
  
  if (slug === 'hours-calculator') {
    const start = inputs.startTime || '9:00';
    const end = inputs.endTime || '17:00';
    const startParts = start.split(':');
    const endParts = end.split(':');
    const startMins = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
    const endMins = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
    const totalMins = endMins - startMins;
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    return `Total Time: ${hours} hours ${mins} minutes`;
  }
  
  return 'Calculation complete';
}

// Grade Handler
export function handleGrade(slug: string, inputs: CalculatorInputs): string {
  if (slug === 'gpa-calculator') {
    const grades = (inputs.grades || '').split(',').map(g => g.trim().toUpperCase());
    const gradePoints: { [key: string]: number } = { 'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0 };
    const points = grades.map(g => gradePoints[g] || 0);
    const gpa = points.reduce((a, b) => a + b, 0) / points.length;
    return `GPA: ${gpa.toFixed(2)}`;
  }
  
  if (slug === 'test-grade-calculator') {
    const correct = parseNum(inputs.correct);
    const total = parseNum(inputs.total, 1);
    const percent = (correct / total) * 100;
    let grade = 'F';
    if (percent >= 90) grade = 'A';
    else if (percent >= 80) grade = 'B';
    else if (percent >= 70) grade = 'C';
    else if (percent >= 60) grade = 'D';
    return `Score: ${percent.toFixed(1)}% (${grade}) | ${correct}/${total} correct`;
  }
  
  if (slug === 'final-grade-calculator') {
    const current = parseNum(inputs.current);
    const finalWeight = parseNum(inputs.finalWeight, 20);
    const target = parseNum(inputs.targetGrade, 90);
    const needed = (target - current * (100 - finalWeight) / 100) * 100 / finalWeight;
    return `Score Needed on Final: ${needed.toFixed(1)}%`;
  }
  
  return 'Calculation complete';
}

// Construction Handler
export function handleConstruction(slug: string, inputs: CalculatorInputs): string {
  if (slug === 'square-footage-calculator') {
    const length = parseNum(inputs.length);
    const width = parseNum(inputs.width);
    return `Square Footage: ${(length * width).toFixed(2)} sq ft`;
  }
  
  if (slug === 'paint-calculator') {
    const sqft = parseNum(inputs.sqft);
    const coats = parseNum(inputs.coats, 1);
    const gallons = Math.ceil((sqft * coats) / 350);
    return `Paint Needed: ${gallons} gallon(s) for ${coats} coat(s)`;
  }
  
  if (slug === 'concrete-calculator' || slug === 'gravel-calculator' || slug === 'mulch-calculator' || slug === 'soil-calculator') {
    const length = parseNum(inputs.length);
    const width = parseNum(inputs.width);
    const depth = parseNum(inputs.depth);
    const cubicFeet = (length * width * depth) / 12;
    const cubicYards = cubicFeet / 27;
    return `Volume: ${cubicFeet.toFixed(2)} cu ft | ${cubicYards.toFixed(2)} cu yd`;
  }
  
  if (slug === 'flooring-calculator' || slug === 'tile-calculator') {
    const length = parseNum(inputs.length || inputs.roomLength);
    const width = parseNum(inputs.width || inputs.roomWidth);
    const sqft = length * width;
    const waste = sqft * 0.1;
    return `Area: ${sqft.toFixed(2)} sq ft | With 10% waste: ${(sqft + waste).toFixed(2)} sq ft`;
  }
  
  return 'Calculation complete';
}

// Text Handler
export function handleText(slug: string, inputs: CalculatorInputs): string {
  const text = inputs.text || '';
  
  if (slug === 'word-counter') {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const chars = text.length;
    return `Words: ${words} | Characters: ${chars}`;
  }
  
  if (slug === 'character-counter') {
    return `Characters: ${text.length} | Without spaces: ${text.replace(/\s/g, '').length}`;
  }
  
  if (slug === 'case-converter') {
    const caseType = inputs.case || 'upper';
    let result = text;
    if (caseType === 'upper') result = text.toUpperCase();
    else if (caseType === 'lower') result = text.toLowerCase();
    else if (caseType === 'title') result = text.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    return result;
  }
  
  return 'Calculation complete';
}

// Random Generator Handler
export function handleRandom(slug: string, inputs: CalculatorInputs): string {
  if (slug === 'random-number-generator') {
    const min = parseInt(inputs.min || '1');
    const max = parseInt(inputs.max || '100');
    const random = Math.floor(Math.random() * (max - min + 1)) + min;
    return `Random Number: ${random}`;
  }
  
  if (slug === 'dice-roller') {
    const sides = parseInt(inputs.sides || '6');
    const count = parseInt(inputs.count || '1');
    const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
    const sum = rolls.reduce((a, b) => a + b, 0);
    return `Rolls: ${rolls.join(', ')} | Sum: ${sum}`;
  }
  
  if (slug === 'coin-flip') {
    const flips = parseInt(inputs.flips || '1');
    const results = Array.from({ length: flips }, () => Math.random() < 0.5 ? 'Heads' : 'Tails');
    const heads = results.filter(r => r === 'Heads').length;
    return `Results: ${results.join(', ')} | Heads: ${heads} | Tails: ${flips - heads}`;
  }
  
  return 'Calculation complete';
}

// Generator Handler
export function handleGenerator(slug: string, inputs: CalculatorInputs): string {
  if (slug === 'password-generator') {
    const length = parseInt(inputs.length || '12');
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `Generated Password: ${password}`;
  }
  
  return 'Generated successfully';
}

// Generic Handler
export function handleOther(slug: string, inputs: CalculatorInputs): string {
  return 'Calculation completed. This calculator provides results based on your inputs.';
}
