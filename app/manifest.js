export default function manifest() {
  return {
    name: 'FoodVal - Eat Better',
    short_name: 'FoodVal',
    description: 'Scan packaged food to reveal its true health score.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fbfbfb',
    theme_color: '#22c55e',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
