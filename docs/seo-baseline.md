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

> **Corrección importante:** el operador `cache:` de Google **ya no existe**.
> Google lo retiró en septiembre de 2024 y borró su documentación. No sirve para
> comprobar indexación. Métodos válidos a día de hoy: `site:`, Search Console y
> los logs del servidor.

Consultas exactas a lanzar, en este orden:

| # | Consulta / acción | Qué indica |
|---|---|---|
| 1 | `site:impactodigitalfm.com` en **Google** | Si aparece, está indexada. Es la prueba principal |
| 2 | `site:impactodigitalfm.com` en **Bing** | Índice de Bing; alimenta también a Brave |
| 3 | `"Radio Impacto Digital"` en Google y Bing | Indexación por marca (más fácil de conseguir que por temática) |
| 4 | `"impactodigitalfm.com"` | Menciones del dominio en otros sitios (señal de enlaces) |
| 5 | `radio impacto digital venezuela` | Si ya rankea por marca + país |
| 6 | **Search Console** → *Indexación → Páginas* | Estado real y autoritativo. Ver leyenda abajo |
| 7 | **Bing Webmaster Tools** → *Rastreo* | Si Bingbot visitó tras el IndexNow del 2026-09-20 |

### Cómo interpretar el estado en Search Console

| Estado | Significado | Acción |
|---|---|---|
| *Indexada* | Objetivo conseguido | Ninguna |
| *Detectada, sin indexar* | Google la conoce, aún no la ha procesado | Esperar; es normal en dominio nuevo |
| *Rastreada, sin indexar* | Google la leyó y decidió no indexarla todavía | Casi siempre falta autoridad → enlaces (`docs/acciones-seo.md`) |
| *Excluida por noindex* | **Error**: algo está bloqueando | Revisar `robots.txt` y las metas `noindex` |
| *Error de rastreo* | Problema técnico | Revisar el motivo concreto que indique |

### Límite de lo que puede hacer el agente

- La búsqueda web del agente **no consulta Google directamente**: es un índice
  propio. Un "sin resultados" ahí no prueba al 100% que Google no la tenga.
- Las comprobaciones autoritativas (filas 6 y 7) requieren la cuenta del
  propietario en Search Console y Bing Webmaster Tools.
- No se pueden leer los logs del servidor (GitHub Pages + Cloudflare) para ver
  visitas de Googlebot.

### Plazos realistas

Para un dominio nuevo sin enlaces, la primera indexación tarda **de días a
varias semanas**. Que no aparezca en 3-7 días **no es un fallo**: es lo normal.
La palanca real son los enlaces externos, no el código.