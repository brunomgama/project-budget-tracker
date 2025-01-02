import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F9F7F7",
        card: "#DBE2EF",
        primaryText: "#112D4E",
        secondaryText: "#3F72AF",
        primaryAccent: "#3F72AF",
        success: "#3BAF65",
        error: "#D9534F",
      },
    },
  },
  plugins: [],
} satisfies Config;
