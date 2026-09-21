# Línea base de indexación — Radio Impacto Digital

**Fecha de la medición:** 2026-09-20 (tras el despliegue del commit `0c080c9` / gh-pages `87d4ca3`)
**Herramienta:** búsqueda web del agente (no equivale a Google ni a Bing directamente; ver limitaciones abajo)

---

## Resultado de hoy

| Consulta | Resultado |
|---|---|
| `site:impactodigitalfm.com` | **Sin resultados** — el dominio no aparece indexado |
| `"impactodigitalfm.com"` | **Sin resultados** — cero menciones del dominio en la web |
| `"Radio Impacto Digital" radio cristiana` | Sin resultados de la emisora; solo homónimas no relacionadas |
| `Radio Impacto Digital La Radio del Pueblo de Dios` | Sin resultados de la emisora |

**Conclusión:** a 2026-09-20 el sitio **no está indexado** y **no tiene ninguna mención ni enlace externo**. Es esperable: el sitio acababa de publicarse con contenido indexable por primera vez (antes el HTML iba vacío).

---

## Estado verificado del sitio (14/14 OK)

- HTML prerenderizado: **1.526 caracteres indexables** (antes ~0)
- `robots.txt` permite el rastreo y declara el sitemap
- `sitemap.xml` con `lastmod 2026-09-20`
- Clave IndexNow publicada y **envío aceptado (HTTP 202)** el 2026-09-20
- Páginas de redirección con `noindex`

---

## Cuándo hacer la próxima revisión

**No antes del 2026-09-27** (7 días después de la línea base). Medir antes no
aporta nada: ningún buscador indexa un dominio nuevo en horas.

- **Revisión temprana (3-4 días, 2026-09-23/24):** solo para Bing/Brave, que es
  más rápido y ya recibió el IndexNow.
- **Revisión principal (7 días, 2026-09-27):** Google + Bing + menciones externas.
- **Revisión de seguimiento (30 días, 2026-10-20):** aquí ya se puede valorar
  si los enlaces externos están funcionando.

Comprobación on-site automatizada en cualquier momento:

```bash
node docs/check-seo-status.mjs
```

Ese script verifica que el despliegue sigue correcto (10 checks), pero **no**
puede decir si Google ya indexó. Para eso hay que mirar Search Console o buscar
`site:impactodigitalfm.com` a mano.

---

## Qué comparar en la próxima revisión

1. ¿Aparece `impactodigitalfm.com` en `site:` de **Google**?
2. ¿Aparece en `site:` de **Bing** (y por tanto en Brave)?
3. ¿Aparece al buscar `"Radio Impacto Digital"` o `radio impacto digital venezuela`?
4. ¿Hay menciones o enlaces externos nuevos?
5. En **Google Search Console** → *Cobertura* / *Páginas*: ¿estado "Indexada" o "Detectada, sin indexar"?
6. En **Bing Webmaster Tools**: ¿la URL fue rastreada tras el envío de IndexNow?

Plazos realistas: para un dominio nuevo sin enlaces, la primera indexación suele tardar **de días a varias semanas**. Que no aparezca en 3-7 días no es necesariamente un fallo.

---

## Limitaciones de esta medición

- La herramienta de búsqueda del agente **no consulta Google directamente**. Es un índice propio, así que un "sin resultados" aquí no prueba al 100% que Google no lo tenga indexado.
- La comprobación fiable es **Google Search Console** y **Bing Webmaster Tools**, que el propietario del sitio puede consultar con su cuenta.
- No se pueden leer los logs del servidor (GitHub Pages + Cloudflare) para ver visitas de Googlebot.