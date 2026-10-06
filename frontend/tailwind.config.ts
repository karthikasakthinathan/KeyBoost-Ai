import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { ink: "#0b1b3a", mute: "#566b8d", line: "#dce8f6", mist: "#f0f6fe", air: "#f6faff", brand: "#0a4cf5", sky: "#2fb7ff" },
    fontFamily: { sans: ["var(--font-sans)", "system-ui", "sans-serif"] },
  } },
  plugins: [],
} satisfies Config;
