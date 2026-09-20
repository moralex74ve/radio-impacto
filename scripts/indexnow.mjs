/**
 * IndexNow: notifica a los buscadores que el contenido cambió.
 *
 * IndexNow es un protocolo abierto soportado por Bing, Yandex, Seznam y Naver.
 * Brave Search se apoya principalmente en el índice de Bing, así que avisar a
 * Bing acelera también la aparición en Brave. Google NO usa IndexNow: para
 * Google hay que usar Search Console (Sitemaps → solicitar indexación).
 *
 * Propiedad del dominio
 * ---------------------
 * IndexNow exige demostrar que controlas el dominio: la clave de abajo debe
 * estar publicada en `https://impactodigitalfm.com/<clave>.txt`. El archivo se
 * sirve desde `public/`, por lo que se despliega con el resto del sitio.
 *
 * Uso
 * ---
 *   npm run indexnow
 *
 * Es un script manual a propósito: conviene ejecutarlo solo cuando el
 * contenido realmente cambia, no en cada build.
 */

const HOST = "impactodigitalfm.com";
const KEY = "9f2c7ab4e1d63f5084c7b9a2ef31d746";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

/** URLs que se enviarán. Debe coincidir con `public/sitemap.xml`. */
const URLS = [`https://${HOST}/`];

const ENDPOINT = "https://api.indexnow.org/indexnow";

async function main() {
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: URLS,
  };

  console.log(`[indexnow] Enviando ${URLS.length} URL(s) a ${ENDPOINT}...`);
  console.log(`[indexnow] Comprobación de propiedad: ${KEY_LOCATION}`);

  let response;
  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.error(`[indexnow] Error de red: ${error?.message ?? error}`);
    process.exitCode = 1;
    return;
  }

  // 200 = aceptado; 202 = aceptado, pendiente de validar la clave.
  if (response.status === 200 || response.status === 202) {
    console.log(`[indexnow] OK (HTTP ${response.status}). URLs enviadas correctamente.`);
    return;
  }

  const detail = await response.text().catch(() => "");
  console.error(`[indexnow] Falló con HTTP ${response.status}. ${detail}`.trim());
  console.error(
    "[indexnow] Causas habituales: la clave no está publicada todavía en el sitio, " +
      "el dominio no coincide o se superó el límite de envíos.",
  );
  process.exitCode = 1;
}

main();