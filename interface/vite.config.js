import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    include: [
      'p5',
      'p5.sound'
    ],
    exclude: [
      // Add any dependencies that should not be pre-bundled
    ]
  },
  // Additional configurations (if needed)
});