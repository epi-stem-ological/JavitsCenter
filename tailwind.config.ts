import type { Config } from "tailwindcss";

// Javits Brand Guidelines v1.0 · 2026 — palette, type, motion encoded here.
// DO NOT hardcode brand colors anywhere else. All surfaces reference these tokens.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { sm: "640px", md: "768px", lg: "1024px" },
    },
    extend: {
      colors: {
        // Brand palette — authoritative hex per the 2026 guidelines
        javits: {
          gold: "#FFCC00",
          green: "#54B147",
          blue: "#05B8EB",
          black: "#000000",
          white: "#FFFFFF",
        },
        // Semantic roles — point these at brand tokens; change theme here, not downstream
        bg: {
          DEFAULT: "#FFFFFF",
          inverse: "#000000",
          subtle: "#FAFAFA",
        },
        fg: {
          DEFAULT: "#0A0A0A",
          inverse: "#FFFFFF",
          muted: "#555555",
        },
        accent: {
          gold: "#FFCC00",
          green: "#54B147",
          blue: "#05B8EB",
        },
        line: "#E6E6E6",
      },
      fontFamily: {
        // Primary family is Titling Gothic FB per the brand guide; we ship with the
        // approved alternates (Bebas Neue + Inter as a Helvetica stand-in) because
        // Titling Gothic FB is not royalty-free. Swap at the CSS var level later.
        display: ["var(--font-display)", "Bebas Neue", "Impact", "sans-serif"],
        sans: [
          "var(--font-body)",
          "Inter",
          "Helvetica",
          "Arial",
          "system-ui",
          "sans-serif",
        ],
      },
      letterSpacing: {
        // Brand headline tracking = +25 (per guide). Tailwind "tracking-headline" maps to that.
        headline: "0.05em",
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "24px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.06)",
        lift: "0 12px 40px rgba(0,0,0,0.18)",
      },
      backgroundImage: {
        // Javits Blend: Blue → Green (70%) → Gold (10%). The guide shows a left-to-right
        // flow. `angle` can be rotated at usage, but the blend is always this spectrum.
        "javits-blend":
          "linear-gradient(90deg, #05B8EB 0%, #54B147 70%, #FFCC00 100%)",
        "javits-blend-soft":
          "linear-gradient(180deg, transparent 0%, rgba(5,184,235,0.15) 40%, rgba(84,177,71,0.18) 75%, rgba(255,204,0,0.22) 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 400ms cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
