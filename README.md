# 📻 Radio Impacto Digital

> "La Radio del Pueblo de Dios" — reproductor web de radio cristiana en vivo 24/7.

Sitio: https://impactodigitalfm.com/

## 📌 Índice
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalacion)
- [Desarrollo local](#desarrollo-local)
- [Compilar y previsualizar](#compilar-y-previsualizar)
- [Desplegar](#desplegar)
- [Stack](#stack)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Verificación](#verificacion)

---

### 🛠️ Requisitos previos
- [Node.js](https://nodejs.org/) v20+ (LTS recomendado)
- **npm** (gestor de paquetes oficial del proyecto)

> ⚠️ Este proyecto usa **npm** como único gestor. El lockfile es `package-lock.json`.
> No hay `pnpm-lock.yaml` ni `yarn.lock`; usa siempre `npm install` y `npm run <script>`.

---

### ⚙️ Instalación
```bash
npm install
```

No se requieren variables de entorno para el build. El archivo `.env.local` no es
necesario para el funcionamiento del reproductor.

---

### 🚀 Desarrollo local
```bash
npm run dev
```
Servidor de desarrollo en `http://localhost:3000` (Vite reasigna el puerto si está ocupado).

---

### 🧱 Compilar y previsualizar
```bash
npm run build     # Build de producción en dist/
npm run preview   # Sirve el build de dist/ localmente
```

---

### 📤 Desplegar
El despliegue se hace con el paquete `gh-pages`, que publica `dist/` en la rama `gh-pages`:
```bash
npm run deploy    # Ejecuta predeploy (build) y publica en gh-pages
```

---

### 🧩 Stack
- **React 19** + **TypeScript**
- **Vite 6** (build y dev server)
- **Tailwind CSS v4** (vía `@tailwindcss/vite`)
- **PWA**: manifest + service worker (`public/sw.js`)
- **Audio**: streaming de Zeno.fm con sondeo de metadatos (cada 10 s)

---

### 📁 Estructura del proyecto
```
├── index.html              # HTML raíz (Vite lo usa como entrada)
├── index.tsx               # Punto de entrada React (monta <App /> en #root)
├── index.css               # Entrada de Tailwind (@import "tailwindcss")
├── vite.config.ts          # Configuración de Vite
├── tsconfig.json           # Configuración de TypeScript
├── public/                 # Estáticos servidos tal cual (iconos, sw.js, APK, CNAME…)
└── src/
    ├── App.tsx             # Componente principal y máquina de estados del audio
    ├── types.ts            # Enum StreamStatus
    └── components/         # Iconos, botones, modales y enlaces sociales
```

> 📝 Nota: `index.tsx` e `index.css` viven en la **raíz**, no en `src/`. Es la
> convención de la plantilla original y Vite la resuelve correctamente.

---

### ✅ Verificación
Antes de desplegar, comprueba que el proyecto compila y tipa sin errores:
```bash
npm exec -- tsc --noEmit   # Sin errores de TypeScript
npm run build              # Build de producción correcto
```

No hay suite de tests automatizados en este proyecto.
