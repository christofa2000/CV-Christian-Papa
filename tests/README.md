# Testing Suite - CV App

Esta carpeta contiene la configuración completa de testing para la aplicación CV, incluyendo tests unitarios (Jest) y tests E2E (Playwright).

## 🏗️ Arquitectura de Testing

### Separación de Responsabilidades

- **Jest** (`src/components/__tests__/`): Tests unitarios e integración
- **Playwright** (`tests/e2e/`): Tests end-to-end y accesibilidad

## 📁 Estructura

```
tests/
├── e2e/                          # Tests E2E con Playwright
│   ├── homepage.spec.ts          # Tests de la página principal
│   ├── navigation.spec.ts        # Tests de navegación
│   ├── contact.spec.ts           # Tests de la sección contacto
│   └── accessibility.spec.ts     # Tests de accesibilidad
└── README.md                     # Esta documentación

src/components/__tests__/         # Tests unitarios con Jest
├── Hero.test.tsx
├── NavBar.test.tsx
├── ProjectCard.test.tsx
├── Contact.test.tsx
└── README.md
```

## 🚀 Comandos Disponibles

### Tests Unitarios (Jest)

```bash
# Ejecutar todos los tests unitarios
npm run test:unit

# Modo watch (re-ejecuta al hacer cambios)
npm run test:watch

# Con reporte de cobertura
npm run test:coverage

# Ejecutar tests específicos
npm run test:unit -- --testNamePattern="Hero"
```

### Tests E2E (Playwright)

```bash
# Ejecutar todos los tests E2E
npm run test:e2e

# Ejecutar tests E2E en modo UI (interfaz gráfica)
npx playwright test --ui

# Ejecutar tests E2E en modo debug
npx playwright test --debug

# Ejecutar tests E2E específicos
npm run test:e2e -- --grep "homepage"

# Ver reporte de tests E2E
npx playwright show-report
```

### Tests Completos

```bash
# Ejecutar todos los tests (unitarios + E2E)
npm run test:all
```

## ⚙️ Configuración

### Jest (Tests Unitarios)

- **Configuración**: `jest.config.js`
- **Setup**: `jest.setup.js`
- **Ignora**: `tests/e2e/` (evita conflictos)
- **Mocks**: Next.js Image, Framer Motion, IntersectionObserver

### Playwright (Tests E2E)

- **Configuración**: `playwright.config.ts`
- **Servidor**: `npm run start:e2e` (build + start)
- **Navegadores**: Chromium (configurado), Firefox/WebKit (comentados)
- **Timeout**: 30s por test, 120s para servidor

## 🧪 Cobertura de Tests

### Tests Unitarios (25 tests)

- ✅ **Hero**: Renderizado, elementos, accesibilidad, snapshot
- ✅ **NavBar**: Navegación, menú móvil, ARIA, snapshot
- ✅ **ProjectCard**: Contenido, enlaces, tecnologías, snapshot
- ✅ **Contact**: Enlaces, descarga CV, disponibilidad, snapshot

### Tests E2E (16 tests)

- ✅ **Homepage**: Carga, contenido, navegación, imagen
- ✅ **Navegación**: Secciones, menú móvil, scroll suave
- ✅ **Contacto**: Enlaces, descarga, información
- ✅ **Accesibilidad**: Títulos, skip links, navegación por teclado, ARIA

## 🔧 Requisitos del Sistema

- **Node.js**: ≥ 18 (recomendado: v20+)
- **Navegadores**: Chromium (instalado automáticamente)
- **Puerto**: 3000 (para tests E2E)

## 📊 Reportes

### Jest

- **Consola**: Resultados en tiempo real
- **Cobertura**: `npm run test:coverage`
- **Snapshots**: `src/components/__tests__/__snapshots__/`

### Playwright

- **HTML**: `playwright-report/index.html`
- **Traces**: `test-results/` (para debugging)
- **UI Mode**: `npx playwright test --ui`

## 🐛 Debugging

### Jest

```bash
# Debug específico
npm run test:unit -- --testNamePattern="Hero" --verbose

# Actualizar snapshots
npm run test:unit -- -u
```

### Playwright

```bash
# Debug con interfaz
npx playwright test --debug

# Debug específico
npx playwright test --debug tests/e2e/homepage.spec.ts

# Ver traces
npx playwright show-trace test-results/[test-name]/trace.zip
```

## 🚨 Troubleshooting

### Problemas Comunes

1. **Puerto 3000 ocupado**:

   ```bash
   # Cambiar puerto en playwright.config.ts
   baseURL: "http://localhost:3001"
   ```

2. **Tests E2E fallan**:

   ```bash
   # Verificar que la app funciona
   npm run start:e2e
   # Abrir http://localhost:3000 en navegador
   ```

3. **Snapshots desactualizados**:

   ```bash
   npm run test:unit -- -u
   ```

4. **Playwright no encuentra navegadores**:
   ```bash
   npx playwright install
   ```

## 📈 Mejores Prácticas

### Tests Unitarios

- ✅ Testear comportamiento, no implementación
- ✅ Usar `getByRole` y `getByText` preferiblemente
- ✅ Mantener snapshots actualizados
- ✅ Mockear dependencias externas

### Tests E2E

- ✅ Testear flujos completos de usuario
- ✅ Usar selectores estables (data-testid, roles)
- ✅ Verificar accesibilidad
- ✅ Testear en diferentes viewports

## 🔄 CI/CD

Para integración continua, usar:

```bash
# En CI
npm run test:all

# O por separado
npm run test:unit
npm run test:e2e
```

Los tests E2E se ejecutan con `reuseExistingServer: false` en CI para mayor confiabilidad.

