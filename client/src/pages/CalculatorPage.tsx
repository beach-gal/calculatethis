import { useRoute } from "wouter";

export default function CalculatorPage() {
  // Grab the slug from the URL
  const [match, params] = useRoute("/calculator/:slug");
  const slug = params?.slug;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Calculator: {slug}</h1>
      <p>This is where the {slug} calculator will render.</p>
    </div>
  );
}
