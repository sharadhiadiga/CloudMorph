/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f8fafc",
        foreground: "#0f172a",
        border: "#e2e8f0",
        sidebar: {
          DEFAULT: "#ffffff",
          foreground: "#64748b",
          active: "#3b82f6",
          hover: "#f1f5f9",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#0f172a",
        },
        primary: {
          DEFAULT: "#3b82f6",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#eff6ff",
          foreground: "#1e40af",
        },
        muted: {
          DEFAULT: "#94a3b8",
          foreground: "#64748b",
        },
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
