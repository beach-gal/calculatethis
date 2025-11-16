import { Router, Route } from "wouter";
import HomePage from "./pages/HomePage";
import CalculatorPage from "./pages/CalculatorPage";

export default function App() {
  return (
    <Router>
      <Route path="/" component={HomePage} />
      <Route path="/calculator/:slug" component={CalculatorPage} />
    </Router>
  );
}
