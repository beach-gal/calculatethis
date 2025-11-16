import { Router, Route } from "wouter";
import HomePage from "./pages/HomePage.tsx";
import CalculatorPage from "./pages/CalculatorPage.tsx";

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
