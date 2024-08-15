import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   base: "/Logout_legend/"
// })

import { VitePWA } from 'vite-plugin-pwa'
const manifestForPlugin = {
  registerType: 'prompt',
  includeAssests: ['favicon.ico', "apple-touc-icon.png", "masked-icon.svg"],
  manifest: {
    name: "Login Tracker",
    short_name: "Tracker",
    description: "Logout Legend is designed to help you manage your login and break times, allowing you to stay focused on productivity without the hassle of tracking these details manually.",
    icons: [{
      src: '/android-chrome-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'favicon'
    },
    {
      src: '/android-chrome-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'favicon'
    },
    {
      src: '/apple-touch-icon.png',
      sizes: '180x180',
      type: 'image/png',
      purpose: 'apple touch icon',
    },
    {
      src: '/maskable_icon.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any maskable',
    }
    ],
    theme_color: '#181818',
    background_color: '#e0cc3b',
    display: "standalone",
    scope: '/',
    start_url: "/",
    orientation: 'portrait'
  },
};
export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugin)],
  base: "/Logout_legend/"
});