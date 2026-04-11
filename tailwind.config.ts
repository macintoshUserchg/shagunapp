import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        accent: {
          DEFAULT: "var(--accent)",
          soft: "var(--accent-soft)",
          text: "var(--accent-text)",
        },
        border: "var(--border)",
        muted: "var(--muted)",
      },
      backgroundColor: {
        "glass": "var(--glass-bg)",
        "surface": "var(--surface-stat)",
      },
    },
  },
  plugins: [],
};

export default config;
