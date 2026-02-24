// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Configuración de rendimiento
  nitro: {
    compressPublicAssets: true,
    minify: true,
  },

  // Módulos de Nuxt
  modules: ["@nuxtjs/tailwindcss"],

  // Configuración de Tailwind
  tailwindcss: {
    cssPath: "~/css/tailwind.css",
    configPath: "tailwind.config.js",
    exposeConfig: false,
    injectPosition: 0,
    viewer: true,
  },

  // Configuración de CSS
  css: ["~/css/bulma/bulma.css"],

  // Configuración de renderizado
  // Para servir desde backend, usar generate (estático) en lugar de build (SSR)
  ssr: false, // Cambiar a false para generar archivos estáticos

  // Configuración para GitHub Pages
  app: {
    baseURL: "/",
    head: {
      // Precargar recursos críticos
      link: [
        { rel: "icon", type: "image/png", href: "/logo_barber.png" },
        { rel: "preload", href: "/assets/videoimg.png", as: "image" },
        { rel: "dns-prefetch", href: "https://www.youtube.com" },
        { rel: "dns-prefetch", href: "https://www.googletagmanager.com" },
        // Fuentes modernas
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Inter:wght@300;400;500;600;700&display=swap",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap",
        },
      ],
      // Meta tags para SEO y rendimiento
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "Sosa Barber - Premium Grooming" },
        { "http-equiv": "X-UA-Compatible", content: "IE=edge" },
      ],
    },
  },

  // Configuración de runtime (variables de entorno)
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || "https://barbersosa.com",
    },
  },

  // Configuración de desarrollo
  devtools: { enabled: true },

  // Configuración de build
  build: {
    // transpile ya no es necesario para sass
  },

  // Configuración de i18n - Descomentar después de instalar: npm install
  // Una vez instalado @nuxtjs/i18n, descomentar esto y eliminar el composable temporal
  // modules: ['@nuxtjs/i18n'],
  // i18n: {
  //   locales: [
  //     {
  //       code: 'es',
  //       iso: 'es-ES',
  //       name: 'Español',
  //       file: 'es.json'
  //     },
  //     {
  //       code: 'en',
  //       iso: 'en-US',
  //       name: 'English',
  //       file: 'en.json'
  //     }
  //   ],
  //   lazy: true,
  //   langDir: 'locales',
  //   defaultLocale: 'es',
  //   strategy: 'prefix_except_default',
  //   detectBrowserLanguage: {
  //     useCookie: true,
  //     cookieKey: 'i18n_redirected',
  //     redirectOn: 'root'
  //   }
  // }
});
