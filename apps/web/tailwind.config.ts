import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        sand: "#f6f1eb",
        amber: "#fbbf24",
        moss: "#0f766e",
        slate: {
          950: "#020617"
        }
      },
      boxShadow: {
        soft: "0 10px 40px -25px rgba(0,0,0,0.4)"
      }
    }
  },
  plugins: []
};

export default config;
