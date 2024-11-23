/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        edit: "#A020F0",
      },
      screens: {
        tablet: "640px",
        "portrait:tablet": {
          raw: "(min-width: 640px) and (orientation: portrait)",
        },
        "landscape:tablet": {
          raw: "(min-width: 640px) and (orientation: landscape)",
        },

        labtop: "1024px",
        "portrait:labtop": {
          raw: "(min-width: 1024px) and (orientation: portrait)",
        },
        "landscape:labtop": {
          raw: "(min-width: 1024px) and (orientation: landscape)",
        },

        desktop: "1280px",
        "portrait:desktop": {
          raw: "(min-width: 1280px) and (orientation: portrait)",
        },
        "landscape:desktop": {
          raw: "(min-width: 1280px) and (orientation: landscape)",
        },
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#06b6d4",
          secondary: "#666666",
          accent: "#111827",
          neutral: "#44403c",
          "base-100": "#333333",
          info: "#60a5fa",
          success: "#16a34a",
          warning: "#facc15",
          error: "#ef4444",
        },
      },
    ],
  },
  plugins: [daisyui],
};
