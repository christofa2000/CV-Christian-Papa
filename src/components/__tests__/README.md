# Tests para CV App

Este directorio contiene los tests unitarios para los componentes principales de la aplicación.

## 🧪 Tecnologías

- **Jest**: Framework de testing
- **React Testing Library**: Librería para testing de componentes React
- **TypeScript**: Para tipado estático en los tests

## 📁 Estructura de Tests

```
src/components/__tests__/
├── Hero.test.tsx         # Tests para el componente Hero
├── NavBar.test.tsx       # Tests para el componente NavBar (Header)
├── ProjectCard.test.tsx  # Tests para el componente ProjectCard
└── Contact.test.tsx      # Tests para el componente Contact (Footer)
```

## 🚀 Comandos

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch (se re-ejecutan al hacer cambios)
npm run test:watch

# Ejecutar tests con reporte de cobertura
npm run test:coverage

# Actualizar snapshots
npm test -- -u
```

## ✅ Cobertura de Tests

Cada test verifica:

1. **Renderizado sin errores**: El componente se renderiza correctamente
2. **Elementos principales**: Los textos, botones y enlaces existen en el DOM
3. **Accesibilidad**: Los atributos ARIA y labels están presentes
4. **Snapshots**: El HTML generado coincide con el snapshot guardado

### Hero.test.tsx

- ✓ Renderiza el nombre "Christian Oscar Papa"
- ✓ Renderiza el subtítulo descriptivo
- ✓ Renderiza los botones de acción (Ver proyectos, Contacto)
- ✓ Renderiza la imagen con alt text correcto
- ✓ Snapshot coincide

### NavBar.test.tsx

- ✓ Renderiza el skip link para accesibilidad
- ✓ Renderiza los enlaces de navegación (Sobre mí, Proyectos, Contacto)
- ✓ Renderiza el botón de menú móvil
- ✓ Tiene atributos ARIA correctos
- ✓ Snapshot coincide

### ProjectCard.test.tsx

- ✓ Renderiza el título del proyecto
- ✓ Renderiza la descripción del proyecto
- ✓ Renderiza las tecnologías como tags
- ✓ Renderiza los botones de demo y código
- ✓ Renderiza la imagen con alt text correcto
- ✓ Los enlaces tienen los hrefs correctos
- ✓ Snapshot coincide

### Contact.test.tsx

- ✓ Renderiza el título de la sección
- ✓ Renderiza el subtítulo descriptivo
- ✓ Renderiza los enlaces de contacto (Email, GitHub, LinkedIn)
- ✓ Renderiza la información de disponibilidad
- ✓ Los enlaces tienen los hrefs correctos
- ✓ Tiene atributos ARIA correctos
- ✓ Snapshot coincide

## 🔧 Configuración

Los tests están configurados en:

- `jest.config.js`: Configuración principal de Jest
- `jest.setup.js`: Configuración de mocks y setup global
  - Mock de `next/image` para simular el componente Image de Next.js
  - Mock de `framer-motion` para evitar warnings en los tests
  - Mock de `IntersectionObserver` para el scrollspy
  - Mock de `scrollIntoView` para navegación suave

## 📝 Notas

- Los tests están diseñados para ser rápidos y confiables
- Se mockean las dependencias externas (Next.js, Framer Motion) para aislar los componentes
- Los snapshots ayudan a detectar cambios no intencionados en el HTML
- Todos los tests respetan las mejores prácticas de accesibilidad
