import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousDisplay, setPreviousDisplay] = useState('');
  const [currentValue, setCurrentValue] = useState('0');
  const [previousValue, setPreviousValue] = useState('');
  const [operation, setOperation] = useState<string | null>(null);
  const [shouldResetScreen, setShouldResetScreen] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const recordUsage = useMutation({
    mutationFn: async (data: any) => {
      if (!isAuthenticated) return;
      return apiRequest('POST', '/api/calculator-usage', data);
    },
    onError: (error) => {
      console.error('Failed to record usage:', error);
    },
  });

  const updateDisplay = (value: string) => {
    setDisplay(value);
    setCurrentValue(value);
  };

  const updatePreviousDisplay = () => {
    if (operation) {
      setPreviousDisplay(`${previousValue} ${operation}`);
    } else {
      setPreviousDisplay('');
    }
  };

  const calculate = () => {
    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    let result: number;
    switch (operation) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '*':
        result = prev * current;
        break;
      case '/':
        result = current !== 0 ? prev / current : 0;
        break;
      default:
        return;
    }
    
    const resultString = String(result);
    updateDisplay(resultString);
    setPreviousDisplay('');
    
    // Record usage if authenticated
    recordUsage.mutate({
      calculatorName: 'Basic Calculator',
      calculatorType: 'Math',
      inputs: { operation, previousValue: prev, currentValue: current },
      result: resultString,
    });
  };

  const handleButtonClick = (value: string) => {
    // Number buttons
    if (!isNaN(Number(value)) || value === '.') {
      if (shouldResetScreen) {
        updateDisplay(value);
        setShouldResetScreen(false);
      } else {
        const newValue = currentValue === '0' ? value : currentValue + value;
        updateDisplay(newValue);
      }
    }
    
    // Operator buttons
    else if (['+', '-', '*', '/'].includes(value)) {
      if (operation !== null && !shouldResetScreen) {
        calculate();
      }
      setPreviousValue(currentValue);
      setOperation(value);
      setShouldResetScreen(true);
      updatePreviousDisplay();
    }
    
    // Equals button
    else if (value === '=') {
      calculate();
      setOperation(null);
      setShouldResetScreen(true);
    }
    
    // Clear button
    else if (value === 'AC') {
      updateDisplay('0');
      setPreviousDisplay('');
      setPreviousValue('');
      setOperation(null);
      setShouldResetScreen(false);
    }
    
    // Plus/minus toggle
    else if (value === '±') {
      const newValue = String(-parseFloat(currentValue));
      updateDisplay(newValue);
    }
    
    // Percentage
    else if (value === '%') {
      const newValue = String(parseFloat(currentValue) / 100);
      updateDisplay(newValue);
    }
    
    // Scientific functions
    else if (value === 'sin') {
      const newValue = String(Math.sin(parseFloat(currentValue) * Math.PI / 180));
      updateDisplay(newValue);
      setShouldResetScreen(true);
    }
    else if (value === 'cos') {
      const newValue = String(Math.cos(parseFloat(currentValue) * Math.PI / 180));
      updateDisplay(newValue);
      setShouldResetScreen(true);
    }
    else if (value === 'tan') {
      const newValue = String(Math.tan(parseFloat(currentValue) * Math.PI / 180));
      updateDisplay(newValue);
      setShouldResetScreen(true);
    }
    else if (value === 'log') {
      const newValue = String(Math.log10(parseFloat(currentValue)));
      updateDisplay(newValue);
      setShouldResetScreen(true);
    }
    else if (value === 'ln') {
      const newValue = String(Math.log(parseFloat(currentValue)));
      updateDisplay(newValue);
      setShouldResetScreen(true);
    }
    else if (value === 'π') {
      updateDisplay(String(Math.PI));
      setShouldResetScreen(true);
    }
    else if (value === 'e') {
      updateDisplay(String(Math.E));
      setShouldResetScreen(true);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Basic Calculator</h2>
      
      <div className="calculator-container">
        {/* Display */}
        <div className="bg-gray-900 rounded-lg mb-4 p-4">
          <div className="text-right">
            <div className="text-gray-400 text-sm font-mono h-6">
              {previousDisplay}
            </div>
            <div className="text-white text-3xl font-mono font-bold">{display}</div>
          </div>
        </div>
        
        {/* Scientific Functions Row */}
        <div className="grid grid-cols-8 gap-2 mb-2">
          {['sin', 'cos', 'tan', 'log', 'ln', 'π', 'e', '^'].map((func) => (
            <button
              key={func}
              className="calc-btn calc-btn-function px-2 py-3 rounded-lg font-medium text-sm transition-all shadow-md bg-blue-600 text-white hover:bg-blue-700 hover:transform hover:-translate-y-px active:transform active:translate-y-0"
              onClick={() => handleButtonClick(func)}
            >
              {func === '^' ? 'x^y' : func}
            </button>
          ))}
        </div>
        
        {/* Main Calculator Grid */}
        <div className="grid grid-cols-4 gap-2">
          {/* Row 1 */}
          <button
            className="calc-btn calc-btn-function px-4 py-3 rounded-lg font-medium transition-all shadow-md bg-blue-600 text-white hover:bg-blue-700 hover:transform hover:-translate-y-px active:transform active:translate-y-0"
            onClick={() => handleButtonClick('AC')}
          >
            AC
          </button>
          <button
            className="calc-btn calc-btn-function px-4 py-3 rounded-lg font-medium transition-all shadow-md bg-blue-600 text-white hover:bg-blue-700 hover:transform hover:-translate-y-px active:transform active:translate-y-0"
            onClick={() => handleButtonClick('±')}
          >
            ±
          </button>
          <button
            className="calc-btn calc-btn-function px-4 py-3 rounded-lg font-medium transition-all shadow-md bg-blue-600 text-white hover:bg-blue-700 hover:transform hover:-translate-y-px active:transform active:translate-y-0"
            onClick={() => handleButtonClick('%')}
          >
            %
          </button>
          <button
            className="calc-btn calc-btn-operator px-4 py-3 rounded-lg font-medium transition-all shadow-md bg-orange-500 text-white hover:bg-orange-600 hover:transform hover:-translate-y-px active:transform active:translate-y-0"
            onClick={() => handleButtonClick('/')}
          >
            ÷
          </button>
          
          {/* Row 2 */}
          {['7', '8', '9'].map((num) => (
            <button
              key={num}
              className="calc-btn calc-btn-number px-4 py-3 rounded-lg font-medium transition-all shadow-md bg-amber-800 text-white hover:bg-amber-900 hover:transform hover:-translate-y-px active:transform active:translate-y-0"
              onClick={() => handleButtonClick(num)}
            >
              {num}
            </button>
          ))}
          <button
            className="calc-btn calc-btn-operator px-4 py-3 rounded-lg font-medium transition-all shadow-md bg-orange-500 text-white hover:bg-orange-600 hover:transform hover:-translate-y-px active:transform active:translate-y-0"
            onClick={() => handleButtonClick('*')}
          >
            ×
          </button>
          
          {/* Row 3 */}
          {['4', '5', '6'].map((num) => (
            <button
              key={num}
              className="calc-btn calc-btn-number px-4 py-3 rounded-lg font-medium transition-all shadow-md bg-amber-800 text-white hover:bg-amber-900 hover:transform hover:-translate-y-px active:transform active:translate-y-0"
              onClick={() => handleButtonClick(num)}
            >
              {num}
            </button>
          ))}
          <button
            className="calc-btn calc-btn-operator px-4 py-3 rounded-lg font-medium transition-all shadow-md bg-orange-500 text-white hover:bg-orange-600 hover:transform hover:-translate-y-px active:transform active:translate-y-0"
            onClick={() => handleButtonClick('-')}
          >
            −
          </button>
          
          {/* Row 4 */}
          {['1', '2', '3'].map((num) => (
            <button
              key={num}
              className="calc-btn calc-btn-number px-4 py-3 rounded-lg font-medium transition-all shadow-md bg-amber-800 text-white hover:bg-amber-900 hover:transform hover:-translate-y-px active:transform active:translate-y-0"
              onClick={() => handleButtonClick(num)}
            >
              {num}
            </button>
          ))}
          <button
            className="calc-btn calc-btn-operator px-4 py-3 rounded-lg font-medium transition-all shadow-md bg-orange-500 text-white hover:bg-orange-600 hover:transform hover:-translate-y-px active:transform active:translate-y-0"
            onClick={() => handleButtonClick('+')}
          >
            +
          </button>
          
          {/* Row 5 */}
          <button
            className="calc-btn calc-btn-number px-4 py-3 rounded-lg font-medium col-span-2 transition-all shadow-md bg-amber-800 text-white hover:bg-amber-900 hover:transform hover:-translate-y-px active:transform active:translate-y-0"
            onClick={() => handleButtonClick('0')}
          >
            0
          </button>
          <button
            className="calc-btn calc-btn-number px-4 py-3 rounded-lg font-medium transition-all shadow-md bg-amber-800 text-white hover:bg-amber-900 hover:transform hover:-translate-y-px active:transform active:translate-y-0"
            onClick={() => handleButtonClick('.')}
          >
            .
          </button>
          <button
            className="calc-btn calc-btn-operator px-4 py-3 rounded-lg font-medium transition-all shadow-md bg-orange-500 text-white hover:bg-orange-600 hover:transform hover:-translate-y-px active:transform active:translate-y-0"
            onClick={() => handleButtonClick('=')}
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
}
