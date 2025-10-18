# 🧪 Testing Suite - CV App

Configuración completa de testing con **Jest** (tests unitarios) y **Playwright** (tests E2E) separados según las mejores prácticas.

## 📊 Resumen de Tests

### ✅ Tests Unitarios (Jest)

- **25 tests** en `src/components/__tests__/`
- **4 componentes** cubiertos: Hero, NavBar, ProjectCard, Contact
- **Cobertura**: Renderizado, elementos, accesibilidad, snapshots

### ✅ Tests E2E (Playwright)

- **8 tests** en `tests/e2e/`
- **Cobertura**: Navegación, funcionalidad, móvil, accesibilidad

## 🚀 Comandos Disponibles

```bash
# Tests unitarios únicamente
npm run test:unit

# Tests E2E únicamente
npm run test:e2e

# Todos los tests
npm run test:all

# Modo watch (unitarios)
npm run test:watch

# Con cobertura
npm run test:coverage

# Debug E2E
npx playwright test --debug
```

## 🏗️ Arquitectura

### Separación Clara

- **Jest**: `src/components/__tests__/` (ignora `tests/e2e/`)
- **Playwright**: `tests/e2e/` (servidor independiente)

### Configuración

- **Jest**: `jest.config.js` + `jest.setup.js`
- **Playwright**: `playwright.config.ts`
- **Servidor E2E**: `npm run start:e2e` (build + start)

## 📁 Estructura Final

```
cvchris/
├── src/components/__tests__/     # Tests unitarios (Jest)
│   ├── Hero.test.tsx
│   ├── NavBar.test.tsx
│   ├── ProjectCard.test.tsx
│   ├── Contact.test.tsx
│   └── README.md
├── tests/e2e/                    # Tests E2E (Playwright)
│   └── basic.spec.ts
├── tests/README.md               # Documentación completa
├── jest.config.js               # Config Jest
├── jest.setup.js                # Setup Jest
├── playwright.config.ts         # Config Playwright
└── TESTING.md                   # Este resumen
```

## ✅ Resultados

### Tests Unitarios

```
Test Suites: 4 passed, 4 total
Tests:       25 passed, 25 total
Snapshots:   4 passed, 4 total
```

### Tests E2E

```
8 passed (32.1s)
```

### Tests Completos

```
✅ Jest: 25 tests passed
✅ Playwright: 8 tests passed
✅ Total: 33 tests passed
```

## 🔧 Requisitos

- **Node.js**: ≥ 18 (actual: v20.19.3 ✅)
- **Navegadores**: Chromium (instalado automáticamente)
- **Puerto**: 3000 (para E2E)

## 🎯 Cobertura de Testing

### Tests Unitarios

- ✅ **Renderizado**: Sin errores
- ✅ **Elementos**: Textos, botones, enlaces
- ✅ **Accesibilidad**: ARIA, alt text, labels
- ✅ **Snapshots**: HTML generado
- ✅ **Mocks**: Next.js Image, Framer Motion

### Tests E2E

- ✅ **Carga**: Página principal
- ✅ **Navegación**: Menú, secciones
- ✅ **Funcionalidad**: Botones, enlaces
- ✅ **Móvil**: Menú responsive
- ✅ **Accesibilidad**: Skip links, navegación

## 🚨 Troubleshooting

### Problemas Comunes

1. **Puerto ocupado**: Cambiar en `playwright.config.ts`
2. **Tests E2E fallan**: Verificar `npm run start:e2e`
3. **Snapshots desactualizados**: `npm run test:unit -- -u`

### Debug

```bash
# Debug E2E específico
npx playwright test --debug tests/e2e/basic.spec.ts

# Ver reporte E2E
npx playwright show-report

# Tests unitarios específicos
npm run test:unit -- --testNamePattern="Hero"
```

## 📈 Próximos Pasos

1. **CI/CD**: Integrar en GitHub Actions
2. **Cobertura**: Añadir umbrales mínimos
3. **Performance**: Tests de rendimiento
4. **Visual**: Tests de regresión visual

---

**¡Testing suite completamente funcional!** 🎉

