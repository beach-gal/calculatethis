import { Router, Route } from "wouter";
import HomePage from "./pages/HomePage";
import CalculatorPage from "./pages/CalculatorPage";

export default function App() {
  return (
    <Router>
      {/* Homepage route */}
      <Route path="/" component={HomePage} />

      {/* Dynamic calculator route */}
      <Route path="/calculator/:slug" component={CalculatorPage} />
    </Router>
  );
}
