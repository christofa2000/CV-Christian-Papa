# 🌌 CV / Portfolio — Christian Oscar Papa

![Vista previa del sitio](./public/cv.png)

> 💼 **Desarrollador Frontend especializado en React + TypeScript**  
> Creando experiencias digitales modernas con Next.js, animaciones fluidas, un diseño accesible y escalable, y un chatbot inteligente con RAG.

---

## ✨ Características principales

- 🎬 **Intro animada** — Splash screen con animación del nombre y soporte para `prefers-reduced-motion`.
- 🧭 **Navegación Sticky** — Barra superior con scrollspy y menú móvil accesible.
- 🧩 **Secciones completas** — Hero, Sobre mí (ES/EN), Proyectos, Contacto.
- 🤖 **Chatbot inteligente** — Sistema RAG local con búsqueda por palabras clave y respuestas contextuales.
- ♿ **Accesibilidad avanzada** — Navegación por teclado, contraste AA y focus management.
- ⚡ **Performance optimizada** — Lighthouse ≥90 en todas las métricas.
- 🔍 **SEO profesional** — Metadata completa, Open Graph, Twitter Cards y sitemap automático.
- 🧪 **Testing completo** — Jest + React Testing Library + Playwright para tests unitarios y E2E.

---

## 🛠️ Tecnologías

| Tecnología            | Uso principal                             |
| --------------------- | ----------------------------------------- |
| **Next.js 15**        | App Router, Server Components, API Routes |
| **TypeScript**        | Tipado estricto y seguro                  |
| **Tailwind CSS**      | Tokens personalizados, diseño responsive  |
| **Framer Motion**     | Animaciones accesibles                    |
| **Lucide React**      | Iconos SVG optimizados                    |
| **Jest + RTL**        | Testing unitario de componentes           |
| **Playwright**        | Testing E2E y de integración              |
| **RAG System**        | Búsqueda inteligente local                |
| **ESLint + Prettier** | Código limpio y consistente               |

---

## ⚙️ Instalación y uso

```bash
# 1️⃣ Instalar dependencias
npm install

# 2️⃣ Ejecutar en desarrollo
npm run dev

# 3️⃣ Build para producción
npm run build

# 4️⃣ Ejecutar build
npm start

# 5️⃣ Linting
npm run lint

# 6️⃣ Testing
npm run test          # Tests unitarios (Jest)
npm run test:watch    # Tests en modo watch
npm run test:coverage # Tests con cobertura
npm run test:e2e      # Tests E2E (Playwright)
npm run test:all      # Todos los tests
```

### 📜 Scripts disponibles

| Script                  | Descripción                        |
| ----------------------- | ---------------------------------- |
| `npm run dev`           | Servidor de desarrollo (Turbopack) |
| `npm run build`         | Build optimizado para producción   |
| `npm run start`         | Ejecuta el build                   |
| `npm run lint`          | Verifica el código con ESLint      |
| `npm run test`          | Tests unitarios con Jest           |
| `npm run test:watch`    | Tests en modo watch                |
| `npm run test:coverage` | Tests con reporte de cobertura     |
| `npm run test:e2e`      | Tests E2E con Playwright           |
| `npm run test:all`      | Ejecuta todos los tests            |

## 🌐 Despliegue en Vercel

```bash
# Deploy manual
vercel

# O conectar el repositorio directamente en vercel.com
```

🔧 El proyecto está optimizado para Vercel, con rutas estáticas y assets optimizados mediante `next/image`.

### ⚙️ Configurar Variables de Entorno en Vercel

Si utilizas Groq AI para el chatbot, debes configurar la variable de entorno en Vercel:

1. Ve a tu proyecto en [vercel.com](https://vercel.com)
2. **Settings** → **Environment Variables**
3. Agrega `GROQ_API_KEY` con tu API key de [Groq](https://console.groq.com)
4. Selecciona el ambiente (Production, Preview, Development)
5. Guarda y haz un nuevo deploy

Sin esta configuración, el chatbot funcionará en modo RAG simple en producción.

## 📱 Diseño responsive

- 📏 **Mobile First** — Diseño optimizado para móviles
- 💻 **Breakpoints** — sm, md, lg, xl
- 🧮 **Layouts** — CSS Grid y Flexbox

## ♿ Accesibilidad

- ✅ **Contraste AA** — Cumple estándares de accesibilidad
- ✅ **Navegación por teclado** — Totalmente navegable sin mouse
- ✅ **Etiquetas ARIA** — Semántica correcta para lectores de pantalla
- ✅ **Estados de foco visibles** — Indicadores claros de navegación
- ✅ **Respeto por prefers-reduced-motion** — Animaciones adaptables

## 🚀 Performance

- ⚡ **Lighthouse ≥90** — Puntuación excelente en todas las métricas
- 🖼️ **Imágenes optimizadas** — `next/image` con formatos WebP/AVIF
- 🧩 **Code splitting automático** — Carga optimizada de componentes
- 📦 **Bundle minimalista** — Sin dependencias pesadas innecesarias

## 🤖 Sistema de Chatbot

- 🧠 **RAG Local** — Búsqueda inteligente sin dependencias externas
- 🔍 **Búsqueda por palabras clave** — Sistema de matching inteligente
- 💬 **Respuestas contextuales** — Respuestas basadas en información profesional
- 🎯 **ChrisBot** — Asistente personalizado en castellano
- ⚡ **Modo híbrido** — Fallback local sin configuración, IA con Groq opcional

### 🔧 Configuración del Chatbot con IA

El chatbot funciona con dos modos:

1. **Modo RAG simple** (sin configuración): Respuestas basadas en búsqueda local
2. **Modo IA con Groq** (opcional): Respuestas más naturales e inteligentes

Para habilitar la IA con Groq en localhost y producción, configura la variable de entorno `GROQ_API_KEY`. Ver [CONFIGURACION_GROQ.md](./CONFIGURACION_GROQ.md) para más detalles.

## 🧭 Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx              # Layout principal y metadata
│   ├── page.tsx                # Página principal
│   ├── sitemap.ts              # Generador de sitemap
│   ├── chat/
│   │   └── page.tsx            # Chatbot principal
│   ├── api/
│   │   ├── chat-simple/        # API del chatbot
│   │   ├── health/             # Health check
│   │   └── test-simple/        # API de testing
│   └── globals.css             # Estilos globales
├── components/
│   ├── IntroSplash.tsx         # Intro animada
│   ├── NavBar.tsx              # Navegación sticky
│   ├── AboutMe.tsx             # Sección sobre mí
│   ├── ProjectsGrid.tsx        # Grid de proyectos
│   ├── ProjectCard.tsx         # Tarjeta de proyecto
│   ├── Contact.tsx             # Sección de contacto
│   ├── ChatBubble.tsx          # Botón flotante del chat
│   └── __tests__/              # Tests unitarios
├── lib/
│   ├── motion.ts               # Variantes de Framer Motion
│   ├── rag-simple.ts           # Sistema RAG simplificado
│   ├── chunker.ts              # Utilidades de chunking
│   └── rag-simple-backup.ts    # Backup del sistema RAG
├── data/
│   ├── knowledge.ts            # Base de conocimiento
│   └── knowledge.json          # Datos en formato JSON
├── types/
│   └── knowledge.ts            # Tipos TypeScript
└── tests/
    └── e2e/                    # Tests E2E con Playwright
```

## 🎨 Personalización

### 🎨 Colores

Definidos en `tailwind.config.ts` con tokens personalizados.

### 🌀 Animaciones

Centralizadas en `lib/motion.ts`, respetando `prefers-reduced-motion`.

### 🧾 Contenido

- **Proyectos** → `ProjectsGrid.tsx`
- **Datos personales** → `AboutMe.tsx` y `Contact.tsx`
- **Base de conocimiento** → `data/knowledge.ts`
- **Metadata SEO** → `layout.tsx`

## 🧪 Testing

### Tests Unitarios (Jest + RTL)

```bash
npm run test              # Ejecutar todos los tests
npm run test:watch        # Modo watch
npm run test:coverage     # Con reporte de cobertura
```

### Tests E2E (Playwright)

```bash
npm run test:e2e          # Tests end-to-end
npm run test:all          # Todos los tests
```

### Cobertura de Tests

- ✅ **Hero Component** — Renderizado, elementos principales, snapshot
- ✅ **NavBar Component** — Navegación, skip link, ARIA attributes
- ✅ **ProjectCard Component** — Props, enlaces, accesibilidad
- ✅ **Contact Component** — Enlaces, descarga CV, información
- ✅ **E2E Tests** — Navegación, funcionalidad, accesibilidad

## 📄 Licencia

© 2024 Christian Oscar Papa  
Todos los derechos reservados.
