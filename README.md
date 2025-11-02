# CV/Portfolio - Christian O. Papa

Portafolio personal desarrollado con Next.js, TypeScript, Tailwind CSS y Framer Motion.

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build

# Iniciar servidor de producción
npm start
```

## 🧪 Testing

```bash
# Tests unitarios
npm run test:unit

# Tests E2E
npm run test:e2e

# Todos los tests
npm run test:all
```

## 🔗 Verificación de Enlaces

Este proyecto utiliza [Lychee](https://github.com/lycheeverse/lychee) para verificar enlaces rotos.

### Instalación Local

Para usar Lychee localmente, descarga el binario desde los [releases de Lychee](https://github.com/lycheeverse/lychee/releases) o instálalo con Cargo:

```bash
cargo install lychee
```

### Comandos Disponibles

```bash
# Verificar enlaces en el código fuente
npm run check:links

# Verificar enlaces (modo CI, sin progreso)
npm run check:links:ci

# Verificar enlaces incluyendo README
npm run check:links:all
```

### Configuración

- **lychee.toml**: Configuración principal de Lychee
- **.lycheeignore**: Archivos y patrones a ignorar

## 📁 Estructura del Proyecto

```
src/
├── app/          # App Router de Next.js
├── components/   # Componentes React
├── lib/          # Utilidades y helpers
└── data/         # Datos estáticos
```

## 🛠️ Stack Tecnológico

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **Framer Motion**
- **React 19**
- **Jest** + **Testing Library**
- **Playwright**

## 📝 Licencia

© 2024 Christian Oscar Papa. Todos los derechos reservados.
