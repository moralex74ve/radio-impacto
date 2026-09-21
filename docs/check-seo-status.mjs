// Comprobación del estado SEO ON-SITE (no de indexación).
// Verifica que los archivos desplegados siguen correctos. NO puede comprobar
// si Google/Bing han indexado el sitio: eso requiere Search Console o buscar
// `site:impactodigitalfm.com` a mano.
//
// Uso: node docs/check-seo-status.mjs

import https from "node:https";

const BASE = "https://impactodigitalfm.com";
const KEY = "9f2c7ab4e1d63f5084c7b9a2ef31d746";

const get = (path) =>
  new Promise((resolve) => {
    const url = BASE + path + (path.includes("?") ? "&" : "?") + "cb=" + Date.now();
    https
      .get(
        url,
        { headers: { "user-agent": "Mozilla/5.0 (compatible; Googlebot/2.1)" } },
        (res) => {
          let d = "";
          res.on("data", (c) => (d += c));
          res.on("end", () => resolve({ status: res.statusCode, body: d }));
        },
      )
      .on("error", (e) => resolve({ status: 0, body: "", error: e.message }));
  });

const home = await get("/");
const c = home.body || "";
const text = c
  .replace(/<script[\s\S]*?<\/script>/g, "")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const robots = await get("/robots.txt");
const sitemap = await get("/sitemap.xml");
const key = await get(`/${KEY}.txt`);
const vivo = await get("/vivo/");

const checks = {
  "portada responde 200": home.status === 200,
  "HTML prerenderizado (root no vacío)": !c.includes('<div id="root"></div>'),
  "texto indexable > 1000 caracteres": text.length > 1000,
  "bloque <details> presente": c.includes("<details"),
  "viewport permite zoom": !c.includes("user-scalable=no"),
  "robots permite rastreo": (robots.body || "").includes("Allow: /"),
  "robots declara sitemap": (robots.body || "").includes("Sitemap:"),
  "sitemap válido y con URL": (sitemap.body || "").includes(
    "<loc>https://impactodigitalfm.com/</loc>",
  ),
  "clave IndexNow publicada": (key.body || "").trim() === KEY,
  "redirecciones con noindex": (vivo.body || "").includes("noindex"),
};

let pass = 0;
for (const [k, v] of Object.entries(checks)) {
  console.log((v ? "OK  " : "FAIL") + " " + k);
  if (v) pass++;
}

console.log("\ncaracteres indexables servidos: " + text.length);
console.log("checks on-site superados: " + pass + "/" + Object.keys(checks).length);
console.log("\nRECORDATORIO: esto NO dice si Google/Bing ya indexaron.");
console.log("Para eso: busca `site:impactodigitalfm.com` en Google y Bing,");
console.log("o mira Search Console -> Indexacion -> Paginas.");