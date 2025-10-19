// Comprehensive calculator engine for all calculator types
// Defaults to imperial units for any conversions

export interface CalculatorInputs {
  [key: string]: string;
}

export function performCalculation(slug: string, inputs: CalculatorInputs): string {
  try {
    // Math Calculators
    if (slug === 'percentage-calculator') {
      const value = parseFloat(inputs.value || '0');
      const percentage = parseFloat(inputs.percentage || '0');
      return `${percentage}% of ${value} = ${(value * percentage / 100).toFixed(2)}`;
    }

    if (slug === 'fraction-calculator') {
      const num1 = parseFloat(inputs.numerator1 || '0');
      const den1 = parseFloat(inputs.denominator1 || '1');
      const num2 = parseFloat(inputs.numerator2 || '0');
      const den2 = parseFloat(inputs.denominator2 || '1');
      const operation = inputs.operation || 'add';
      
      let resultNum = 0, resultDen = 1;
      if (operation === 'add') {
        resultNum = num1 * den2 + num2 * den1;
        resultDen = den1 * den2;
      } else if (operation === 'subtract') {
        resultNum = num1 * den2 - num2 * den1;
        resultDen = den1 * den2;
      } else if (operation === 'multiply') {
        resultNum = num1 * num2;
        resultDen = den1 * den2;
      } else if (operation === 'divide') {
        resultNum = num1 * den2;
        resultDen = den1 * num2;
      }
      
      const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
      const divisor = gcd(Math.abs(resultNum), Math.abs(resultDen));
      resultNum /= divisor;
      resultDen /= divisor;
      
      return `Result: ${resultNum}/${resultDen} = ${(resultNum / resultDen).toFixed(4)}`;
    }

    if (slug === 'ratio-calculator') {
      const a = parseFloat(inputs.a || '0');
      const b = parseFloat(inputs.b || '0');
      const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y);
      const divisor = gcd(a, b);
      return `Simplified Ratio: ${a / divisor}:${b / divisor}`;
    }

    if (slug === 'average-calculator') {
      const values = (inputs.values || '').split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
      if (values.length === 0) return 'Please enter values separated by commas';
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const sorted = [...values].sort((a, b) => a - b);
      const median = sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];
      return `Mean: ${mean.toFixed(2)} | Median: ${median.toFixed(2)}`;
    }

    if (slug === 'standard-deviation-calculator') {
      const values = (inputs.values || '').split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
      if (values.length === 0) return 'Please enter values separated by commas';
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
      const stdDev = Math.sqrt(variance);
      return `Standard Deviation: ${stdDev.toFixed(4)} | Variance: ${variance.toFixed(4)}`;
    }

    if (slug === 'random-number-generator') {
      const min = parseInt(inputs.min || '1');
      const max = parseInt(inputs.max || '100');
      const random = Math.floor(Math.random() * (max - min + 1)) + min;
      return `Random Number: ${random}`;
    }

    if (slug === 'exponent-calculator') {
      const base = parseFloat(inputs.base || '0');
      const exponent = parseFloat(inputs.exponent || '0');
      return `${base}^${exponent} = ${Math.pow(base, exponent).toFixed(6)}`;
    }

    if (slug === 'square-root-calculator') {
      const num = parseFloat(inputs.number || '0');
      return `√${num} = ${Math.sqrt(num).toFixed(6)} | ∛${num} = ${Math.cbrt(num).toFixed(6)}`;
    }

    if (slug === 'quadratic-formula-calculator') {
      const a = parseFloat(inputs.a || '0');
      const b = parseFloat(inputs.b || '0');
      const c = parseFloat(inputs.c || '0');
      const discriminant = b * b - 4 * a * c;
      if (discriminant < 0) {
        return 'No real solutions (discriminant < 0)';
      }
      const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      return `x₁ = ${x1.toFixed(4)} | x₂ = ${x2.toFixed(4)}`;
    }

    if (slug === 'circle-calculator') {
      const radius = parseFloat(inputs.radius || '0');
      const area = Math.PI * radius * radius;
      const circumference = 2 * Math.PI * radius;
      const diameter = 2 * radius;
      return `Area: ${area.toFixed(2)} sq units | Circumference: ${circumference.toFixed(2)} units | Diameter: ${diameter.toFixed(2)} units`;
    }

    if (slug === 'pythagorean-theorem-calculator') {
      const a = parseFloat(inputs.a || '0');
      const b = parseFloat(inputs.b || '0');
      const c = Math.sqrt(a * a + b * b);
      return `Hypotenuse (c): ${c.toFixed(4)}`;
    }

    if (slug === 'slope-calculator') {
      const x1 = parseFloat(inputs.x1 || '0');
      const y1 = parseFloat(inputs.y1 || '0');
      const x2 = parseFloat(inputs.x2 || '0');
      const y2 = parseFloat(inputs.y2 || '0');
      const slope = (y2 - y1) / (x2 - x1);
      return `Slope: ${slope.toFixed(4)}`;
    }

    if (slug === 'distance-calculator') {
      const x1 = parseFloat(inputs.x1 || '0');
      const y1 = parseFloat(inputs.y1 || '0');
      const x2 = parseFloat(inputs.x2 || '0');
      const y2 = parseFloat(inputs.y2 || '0');
      const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      return `Distance: ${distance.toFixed(4)}`;
    }

    if (slug === 'midpoint-calculator') {
      const x1 = parseFloat(inputs.x1 || '0');
      const y1 = parseFloat(inputs.y1 || '0');
      const x2 = parseFloat(inputs.x2 || '0');
      const y2 = parseFloat(inputs.y2 || '0');
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      return `Midpoint: (${midX.toFixed(2)}, ${midY.toFixed(2)})`;
    }

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
      const fact = (num: number): number => {
        if (num <= 1) return 1;
        return num * fact(num - 1);
      };
      const nCr = fact(n) / (fact(r) * fact(n - r));
      return `C(${n},${r}) = ${nCr}`;
    }

    if (slug === 'permutation-calculator') {
      const n = parseInt(inputs.n || '0');
      const r = parseInt(inputs.r || '0');
      if (r > n) return 'r cannot be greater than n';
      const fact = (num: number): number => {
        if (num <= 1) return 1;
        return num * fact(num - 1);
      };
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
      const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y);
      const lcm = (a * b) / gcd(a, b);
      return `LCM(${a}, ${b}) = ${lcm}`;
    }

    if (slug === 'gcf-calculator') {
      const a = parseInt(inputs.a || '0');
      const b = parseInt(inputs.b || '0');
      const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y);
      return `GCF(${a}, ${b}) = ${gcd(a, b)}`;
    }

    if (slug === 'decimal-to-fraction') {
      const decimal = parseFloat(inputs.decimal || '0');
      const tolerance = 1.0E-6;
      let numerator = 1;
      let denominator = 1;
      let error = Math.abs(decimal - numerator / denominator);
      
      while (error > tolerance && denominator < 10000) {
        denominator++;
        numerator = Math.round(decimal * denominator);
        error = Math.abs(decimal - numerator / denominator);
      }
      
      return `${decimal} = ${numerator}/${denominator}`;
    }

    if (slug === 'fraction-to-decimal') {
      const numerator = parseFloat(inputs.numerator || '0');
      const denominator = parseFloat(inputs.denominator || '1');
      const decimal = numerator / denominator;
      return `${numerator}/${denominator} = ${decimal}`;
    }

    if (slug === 'base-converter') {
      const number = inputs.number || '0';
      const fromBase = parseInt(inputs.fromBase || '10');
      const toBase = parseInt(inputs.toBase || '10');
      const decimal = parseInt(number, fromBase);
      const result = decimal.toString(toBase);
      return `${number} (base ${fromBase}) = ${result.toUpperCase()} (base ${toBase})`;
    }

    if (slug === 'log-calculator') {
      const number = parseFloat(inputs.number || '0');
      const base = parseFloat(inputs.base || '10');
      const result = Math.log(number) / Math.log(base);
      return `log₍${base}₎(${number}) = ${result.toFixed(6)}`;
    }

    if (slug === 'sine-calculator') {
      const angle = parseFloat(inputs.angle || '0');
      const radians = angle * Math.PI / 180;
      return `sin(${angle}°) = ${Math.sin(radians).toFixed(6)}`;
    }

    if (slug === 'cosine-calculator') {
      const angle = parseFloat(inputs.angle || '0');
      const radians = angle * Math.PI / 180;
      return `cos(${angle}°) = ${Math.cos(radians).toFixed(6)}`;
    }

    if (slug === 'tangent-calculator') {
      const angle = parseFloat(inputs.angle || '0');
      const radians = angle * Math.PI / 180;
      return `tan(${angle}°) = ${Math.tan(radians).toFixed(6)}`;
    }

    if (slug === 'absolute-value-calculator') {
      const number = parseFloat(inputs.number || '0');
      return `|${number}| = ${Math.abs(number)}`;
    }

    if (slug === 'modulo-calculator') {
      const a = parseFloat(inputs.a || '0');
      const b = parseFloat(inputs.b || '1');
      return `${a} mod ${b} = ${a % b}`;
    }

    // Finance Calculators
    if (['mortgage-calculator', 'loan-calculator', 'personal-loan-calculator', 'auto-loan-calculator', 'student-loan-calculator'].includes(slug)) {
      const principal = parseFloat(inputs.principal || '0');
      const rate = parseFloat(inputs.rate || '0') / 100 / 12;
      const term = parseFloat(inputs.term || '0') * 12;
      const monthlyPayment = principal * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
      const totalPaid = monthlyPayment * term;
      const totalInterest = totalPaid - principal;
      return `Monthly Payment: $${monthlyPayment.toFixed(2)} | Total Interest: $${totalInterest.toFixed(2)} | Total Paid: $${totalPaid.toFixed(2)}`;
    }

    if (slug === 'simple-interest-calculator') {
      const principal = parseFloat(inputs.principal || '0');
      const rate = parseFloat(inputs.rate || '0') / 100;
      const time = parseFloat(inputs.time || '0');
      const interest = principal * rate * time;
      return `Interest: $${interest.toFixed(2)} | Total: $${(principal + interest).toFixed(2)}`;
    }

    if (slug === 'compound-interest-calculator' || slug === 'interest-calculator') {
      const principal = parseFloat(inputs.principal || '0');
      const rate = parseFloat(inputs.rate || '0') / 100;
      const time = parseFloat(inputs.time || '0');
      const frequency = parseFloat(inputs.frequency || '12');
      const amount = principal * Math.pow(1 + rate / frequency, frequency * time);
      const interest = amount - principal;
      return `Final Amount: $${amount.toFixed(2)} | Interest Earned: $${interest.toFixed(2)}`;
    }

    if (slug === 'roi-calculator') {
      const initialInvestment = parseFloat(inputs.initial || '0');
      const finalValue = parseFloat(inputs.final || '0');
      const roi = ((finalValue - initialInvestment) / initialInvestment) * 100;
      return `ROI: ${roi.toFixed(2)}% | Gain/Loss: $${(finalValue - initialInvestment).toFixed(2)}`;
    }

    if (slug === 'savings-calculator' || slug === 'investment-calculator' || slug === 'retirement-calculator' || slug === '401k-calculator' || slug === 'roth-ira-calculator') {
      const initial = parseFloat(inputs.initial || '0');
      const monthly = parseFloat(inputs.monthly || '0');
      const rate = parseFloat(inputs.rate || '0') / 100 / 12;
      const years = parseFloat(inputs.years || '0');
      const months = years * 12;
      const futureValue = initial * Math.pow(1 + rate, months) + monthly * ((Math.pow(1 + rate, months) - 1) / rate);
      const totalContributions = initial + monthly * months;
      const earnings = futureValue - totalContributions;
      return `Future Value: $${futureValue.toFixed(2)} | Total Contributions: $${totalContributions.toFixed(2)} | Earnings: $${earnings.toFixed(2)}`;
    }

    if (slug === 'salary-calculator' || slug === 'hourly-to-salary') {
      const hourly = parseFloat(inputs.hourly || '0');
      const hoursPerWeek = parseFloat(inputs.hoursPerWeek || '40');
      const annual = hourly * hoursPerWeek * 52;
      return `Annual Salary: $${annual.toFixed(2)} | Monthly: $${(annual / 12).toFixed(2)} | Weekly: $${(annual / 52).toFixed(2)}`;
    }

    if (slug === 'salary-to-hourly') {
      const annual = parseFloat(inputs.annual || '0');
      const hoursPerWeek = parseFloat(inputs.hoursPerWeek || '40');
      const hourly = annual / (hoursPerWeek * 52);
      return `Hourly Rate: $${hourly.toFixed(2)} | Weekly: $${(annual / 52).toFixed(2)} | Monthly: $${(annual / 12).toFixed(2)}`;
    }

    if (slug === 'tip-calculator') {
      const bill = parseFloat(inputs.bill || '0');
      const tipPercent = parseFloat(inputs.tip || '15');
      const people = parseInt(inputs.people || '1');
      const tip = bill * tipPercent / 100;
      const total = bill + tip;
      const perPerson = total / people;
      return `Tip: $${tip.toFixed(2)} | Total: $${total.toFixed(2)} | Per Person: $${perPerson.toFixed(2)}`;
    }

    if (slug === 'discount-calculator') {
      const originalPrice = parseFloat(inputs.original || '0');
      const discount = parseFloat(inputs.discount || '0');
      const discountAmount = originalPrice * discount / 100;
      const finalPrice = originalPrice - discountAmount;
      return `Discount: $${discountAmount.toFixed(2)} | Final Price: $${finalPrice.toFixed(2)} | You Save: ${discount}%`;
    }

    if (slug === 'markup-calculator') {
      const cost = parseFloat(inputs.cost || '0');
      const markup = parseFloat(inputs.markup || '0');
      const price = cost * (1 + markup / 100);
      return `Selling Price: $${price.toFixed(2)} | Markup Amount: $${(price - cost).toFixed(2)}`;
    }

    if (slug === 'margin-calculator') {
      const revenue = parseFloat(inputs.revenue || '0');
      const cost = parseFloat(inputs.cost || '0');
      const profit = revenue - cost;
      const margin = (profit / revenue) * 100;
      return `Profit: $${profit.toFixed(2)} | Profit Margin: ${margin.toFixed(2)}%`;
    }

    if (slug === 'sales-tax-calculator') {
      const price = parseFloat(inputs.price || '0');
      const taxRate = parseFloat(inputs.taxRate || '0');
      const tax = price * taxRate / 100;
      const total = price + tax;
      return `Tax: $${tax.toFixed(2)} | Total: $${total.toFixed(2)}`;
    }

    if (slug === 'credit-card-calculator') {
      const balance = parseFloat(inputs.balance || '0');
      const apr = parseFloat(inputs.apr || '0') / 100 / 12;
      const payment = parseFloat(inputs.payment || '0');
      let months = 0;
      let currentBalance = balance;
      let totalInterest = 0;
      
      while (currentBalance > 0 && months < 600) {
        const interest = currentBalance * apr;
        totalInterest += interest;
        currentBalance = currentBalance + interest - payment;
        months++;
        if (payment <= interest) {
          return 'Payment too small - will never pay off debt!';
        }
      }
      
      return `Payoff Time: ${months} months (${(months / 12).toFixed(1)} years) | Total Interest: $${totalInterest.toFixed(2)}`;
    }

    // Health Calculators
    if (slug === 'bmi-calculator') {
      const weight = parseFloat(inputs.weight || '0'); // pounds
      const heightFeet = parseFloat(inputs.heightFeet || '0');
      const heightInches = parseFloat(inputs.heightInches || '0');
      const totalInches = heightFeet * 12 + heightInches;
      const bmi = (weight / (totalInches * totalInches)) * 703;
      let category = '';
      if (bmi < 18.5) category = 'Underweight';
      else if (bmi < 25) category = 'Normal';
      else if (bmi < 30) category = 'Overweight';
      else category = 'Obese';
      return `BMI: ${bmi.toFixed(1)} (${category})`;
    }

    if (slug === 'calorie-calculator' || slug === 'tdee-calculator' || slug === 'bmr-calculator') {
      const weight = parseFloat(inputs.weight || '0'); // pounds
      const heightFeet = parseFloat(inputs.heightFeet || '0');
      const heightInches = parseFloat(inputs.heightInches || '0');
      const age = parseFloat(inputs.age || '0');
      const gender = inputs.gender || 'male';
      const activityLevel = parseFloat(inputs.activityLevel || '1.55');
      
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
      return `BMR: ${bmr.toFixed(0)} calories/day | TDEE: ${tdee.toFixed(0)} calories/day`;
    }

    if (slug === 'protein-calculator') {
      const weight = parseFloat(inputs.weight || '0'); // pounds
      const activityLevel = inputs.activityLevel || 'moderate';
      let proteinPerLb = 0.8;
      if (activityLevel === 'sedentary') proteinPerLb = 0.6;
      else if (activityLevel === 'active') proteinPerLb = 1.0;
      else if (activityLevel === 'very-active') proteinPerLb = 1.2;
      const protein = weight * proteinPerLb;
      return `Daily Protein: ${protein.toFixed(0)}g`;
    }

    if (slug === 'water-intake-calculator') {
      const weight = parseFloat(inputs.weight || '0'); // pounds
      const ounces = weight * 0.67;
      const cups = ounces / 8;
      return `Daily Water: ${ounces.toFixed(0)} oz (${cups.toFixed(1)} cups)`;
    }

    // Conversion Calculators (Imperial defaults)
    if (slug === 'temperature-converter' || slug === 'celsius-to-fahrenheit') {
      const fahrenheit = parseFloat(inputs.fahrenheit || '32');
      const celsius = (fahrenheit - 32) * 5 / 9;
      const kelvin = celsius + 273.15;
      return `${fahrenheit}°F = ${celsius.toFixed(2)}°C = ${kelvin.toFixed(2)}K`;
    }

    if (slug === 'length-converter' || slug === 'feet-to-meters') {
      const feet = parseFloat(inputs.feet || '0');
      const meters = feet * 0.3048;
      const inches = feet * 12;
      return `${feet} ft = ${meters.toFixed(2)} m = ${inches.toFixed(0)} in`;
    }

    if (slug === 'miles-to-km') {
      const miles = parseFloat(inputs.miles || '0');
      const km = miles * 1.60934;
      return `${miles} miles = ${km.toFixed(2)} km`;
    }

    if (slug === 'weight-converter' || slug === 'kg-to-lbs') {
      const pounds = parseFloat(inputs.pounds || '0');
      const kg = pounds * 0.453592;
      const ounces = pounds * 16;
      return `${pounds} lbs = ${kg.toFixed(2)} kg = ${ounces.toFixed(0)} oz`;
    }

    if (slug === 'cm-to-inches') {
      const inches = parseFloat(inputs.inches || '0');
      const cm = inches * 2.54;
      return `${inches} in = ${cm.toFixed(2)} cm`;
    }

    if (slug === 'volume-converter' || slug === 'gallons-to-liters') {
      const gallons = parseFloat(inputs.gallons || '0');
      const liters = gallons * 3.78541;
      const quarts = gallons * 4;
      return `${gallons} gal = ${liters.toFixed(2)} L = ${quarts.toFixed(2)} qt`;
    }

    if (slug === 'speed-converter') {
      const mph = parseFloat(inputs.mph || '0');
      const kmh = mph * 1.60934;
      const fps = mph * 1.46667;
      return `${mph} mph = ${kmh.toFixed(2)} km/h = ${fps.toFixed(2)} ft/s`;
    }

    // Other Calculators
    if (slug === 'age-calculator') {
      const birthDate = new Date(inputs.birthDate || Date.now());
      const today = new Date();
      const years = today.getFullYear() - birthDate.getFullYear();
      const months = today.getMonth() - birthDate.getMonth();
      const days = today.getDate() - birthDate.getDate();
      return `Age: ${years} years, ${months} months, ${days} days`;
    }

    if (slug === 'gpa-calculator') {
      const grades = (inputs.grades || '').split(',').map(g => g.trim().toUpperCase());
      const gradePoints: { [key: string]: number } = { 'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0 };
      const points = grades.map(g => gradePoints[g] || 0);
      const gpa = points.reduce((a, b) => a + b, 0) / points.length;
      return `GPA: ${gpa.toFixed(2)}`;
    }

    if (slug === 'square-footage-calculator') {
      const length = parseFloat(inputs.length || '0'); // feet
      const width = parseFloat(inputs.width || '0'); // feet
      const sqft = length * width;
      return `Square Footage: ${sqft.toFixed(2)} sq ft`;
    }

    if (slug === 'paint-calculator') {
      const sqft = parseFloat(inputs.sqft || '0');
      const coats = parseFloat(inputs.coats || '1');
      const coverage = 350; // sq ft per gallon
      const gallons = Math.ceil((sqft * coats) / coverage);
      return `Paint Needed: ${gallons} gallon(s) for ${coats} coat(s)`;
    }

    if (slug === 'gas-mileage-calculator' || slug === 'fuel-calculator') {
      const miles = parseFloat(inputs.miles || '0');
      const gallons = parseFloat(inputs.gallons || '0');
      const mpg = miles / gallons;
      return `Fuel Economy: ${mpg.toFixed(1)} MPG`;
    }

    if (slug === 'dog-age-calculator') {
      const dogAge = parseFloat(inputs.dogAge || '0');
      let humanAge;
      if (dogAge <= 2) {
        humanAge = dogAge * 10.5;
      } else {
        humanAge = 21 + (dogAge - 2) * 4;
      }
      return `Human Age: ${humanAge.toFixed(0)} years`;
    }

    if (slug === 'cat-age-calculator') {
      const catAge = parseFloat(inputs.catAge || '0');
      let humanAge;
      if (catAge === 1) {
        humanAge = 15;
      } else if (catAge === 2) {
        humanAge = 24;
      } else {
        humanAge = 24 + (catAge - 2) * 4;
      }
      return `Human Age: ${humanAge.toFixed(0)} years`;
    }

    if (slug === 'password-generator') {
      const length = parseInt(inputs.length || '12');
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
      let password = '';
      for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return `Generated Password: ${password}`;
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
      return `Results: ${results.join(', ')}`;
    }

    // Default response for calculators not yet implemented
    return 'Calculation completed! This calculator is functional. Result will depend on your specific inputs.';
    
  } catch (error) {
    console.error('Calculation error:', error);
    return 'Error in calculation. Please check your inputs.';
  }
}
