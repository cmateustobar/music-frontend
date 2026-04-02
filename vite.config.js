import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),

    // 🔥 PWA SOLO EN PRODUCCIÓN (SOLUCIÓN DEFINITIVA)
    VitePWA({
      registerType: 'autoUpdate',

      // 🚨 CLAVE: DESACTIVADO EN DESARROLLO
      devOptions: {
        enabled: false
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],

        // 🚨 CRÍTICO: NO CACHEAR AUDIO NI API
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.pathname.startsWith('/api/stream'),
            handler: 'NetworkOnly'
          },
          {
            urlPattern: ({ url }) =>
              url.pathname.includes('/uploads/audio'),
            handler: 'NetworkOnly'
          }
        ]
      },

      manifest: {
        name: 'Mi App de Música',
        short_name: 'MusicApp',
        description: 'Reproductor de música tipo Spotify',
        theme_color: '#0f172a',
        background_color: '#020617',
        display: 'standalone',
        start_url: '/',

        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],

  server: {
    host: true
  }
})