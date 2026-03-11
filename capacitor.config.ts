import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.km0.app',
  appName: 'Km0 Productores',
  webDir: 'public',
  server: {
    url: 'https://km0-nu.vercel.app/',
    cleartext: true
  }
};

export default config;
