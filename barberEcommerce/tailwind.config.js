/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
    "./nuxt.config.{js,ts}"
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#D4AF37",
        "gold": "#D4AF37",
        "gold-dark": "#AA841D",
        "background-deep": "#0A0A0A",
        "charcoal": "#1A1A1A",
        "border-gray": "#2A2A2A",
        "dark-gray": "#1A1A1A",
        "deeper-gray": "#121212",
        "accent-gray": "#2A2A2A"
      },
      fontFamily: {
        "display": ["Cinzel", "serif"],
        "sans": ["Inter", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "9999px"
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
