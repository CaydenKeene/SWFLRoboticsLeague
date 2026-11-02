import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // League palette, straight from the design session.
        navy: "#0B2545",
        cream: "#F7EFDE",
        bone: "#F2E4CD",
        orange: "#F26722",
        rust: "#C4531A",
        teal: "#0E7C7B",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      keyframes: {
        // Slides a doubled track by one copy's width, rightward, for a seamless loop.
        "marquee-right": {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        // Duration is set inline by the sponsor banner, from its logo count.
        "marquee-right": "marquee-right 30s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
