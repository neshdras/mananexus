import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Nexus Shuffle',
        short_name:'Nexus',
        description: "Tournoi de jeux de cartes à collectionner0",
        theme_color: "#242424",
        background_color: "#242424",
        display: 'standalone',
        start_url: "/",
        icons: [
          {
            src: '/logo.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
})
