import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Cargar solo las variables de entorno que necesitamos
  const env = loadEnv(mode, process.cwd(), '');
  
  // Definir explícitamente las variables de entorno que queremos exponer
  const envWithProcessPrefix = {
    'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
    'process.env.BASE_URL': `"${process.env.BASE_URL || '/radio-impacto/'}"`,
    // Agrega aquí otras variables de entorno necesarias
  };
  
  return {
    server: {
      port: 3000,
      host: "0.0.0.0",
    },
    plugins: [react()],
    // Configuración base para GitHub Pages
    base: '/radio-impacto/',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true,
    },
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, 'src') },
        { find: '@components', replacement: path.resolve(__dirname, 'src/components') },
      ],
    },
    define: {
      ...envWithProcessPrefix,
      '__BASE_URL__': JSON.stringify('/radio-impacto/')
    },
  };
});
