/**
 * Prerender del HTML estático (post-build).
 *
 * Problema que resuelve
 * ---------------------
 * El sitio es una SPA de React: `dist/index.html` se servía con
 * `<div id="root"></div>` vacío. Google puede ejecutar JavaScript, pero tarda
 * más y Bing/Brave dependen mucho más del HTML servido. Este script renderiza
 * `<App />` en Node con `react-dom/server` y lo inyecta dentro de `#root`, de
 * modo que el HTML estático ya contiene el reproductor y todo el texto.
 *
 * Cuándo se ejecuta
 * -----------------
 * Como paso posterior a `vite build` (ver script `build` en package.json).
 * Vite compila el bundle de cliente; este script solo rellena el HTML ya
 * generado. No forma parte del bundle que se envía al navegador.
 *
 * Seguridad
 * ---------
 * Es deliberadamente defensivo: cualquier fallo se registra como aviso y deja
 * `dist/index.html` exactamente como lo dejó Vite. Un error aquí nunca debe
 * romper el build ni el despliegue.
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const indexPath = path.join(projectRoot, "dist", "index.html");

const log = (msg) => console.log(`[prerender] ${msg}`);
const warn = (msg) => console.warn(`[prerender] AVISO: ${msg}`);

async function main() {
  let html;
  try {
    html = await readFile(indexPath, "utf8");
  } catch {
    warn(`no se encontró ${indexPath}; se omite el prerender.`);
    return;
  }

  if (!html.includes('<div id="root"></div>')) {
    warn(
      'no se encontró `<div id="root"></div>` en dist/index.html; se omite el prerender.',
    );
    return;
  }

  // --- Render de React a HTML estático -----------------------------------
  let appHtml;
  try {
    const { createServer } = await import("vite");
    const vite = await createServer({
      root: projectRoot,
      appType: "custom",
      logLevel: "error",
      server: { middlewareMode: true, hmr: false },
    });

    try {
      const { default: App } = await vite.ssrLoadModule("/src/App.tsx");
      const { renderToString } = await import("react-dom/server");
      const { createElement } = await import("react");
      appHtml = renderToString(createElement(App));
    } finally {
      await vite.close();
    }
  } catch (error) {
    warn(`el render falló, se conserva el HTML de Vite. Detalle: ${error?.message ?? error}`);
    return;
  }

  if (!appHtml || appHtml.length < 500) {
    warn(
      `el render produjo una salida sospechosamente corta (${appHtml?.length ?? 0} caracteres); se conserva el HTML de Vite.`,
    );
    return;
  }

  // --- Inyección ----------------------------------------------------------
  const updated = html.replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>`,
  );

  if (updated === html) {
    warn("no se pudo inyectar el HTML renderizado; se conserva el HTML de Vite.");
    return;
  }

  await writeFile(indexPath, updated, "utf8");
  log(`HTML prerenderizado correctamente (${appHtml.length} caracteres de contenido).`);
}

main().catch((error) => {
  warn(`fallo inesperado: ${error?.stack ?? error}. Se conserva el HTML de Vite.`);
});