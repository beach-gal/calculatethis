import { type Config, defineConfig } from "tailwindcss"

export default defineConfig({
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(240, 5%, 90%)",
        input: "hsl(240, 5%, 96%)",
        ring: "hsl(240, 5%, 85%)",
        background: "hsl(0, 0%, 100%)",
        foreground: "hsl(240, 10%, 3.9%)",
        muted: "hsl(240, 4.8%, 95.9%)",
        accent: "hsl(240, 4.8%, 89.8%)",
        destructive: "hsl(0, 84.2%, 60.2%)"
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      }
    }
  },
  plugins: []
}) satisfies Config
