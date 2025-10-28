# 🔧 Solución: Chatbot responde diferente en localhost vs producción

## 🎯 Problema Identificado

El chatbot responde de manera diferente entre **localhost** y **producción en Vercel** porque:

- ✅ **Localhost**: Tienes la variable `GROQ_API_KEY` configurada en `.env.local`
- ❌ **Producción en Vercel**: NO tienes la variable `GROQ_API_KEY` configurada en el proyecto de Vercel

Esto causa que:

- **Localhost** → Usa IA con Groq ✅ (respuestas inteligentes)
- **Producción** → Usa modo RAG simple (sin IA) ⚠️ (respuestas más básicas)

---

## ✅ Solución: Configurar variable de entorno en Vercel

### Paso 1: Obtener tu API Key de Groq

Si no la tienes:

1. Ve a [console.groq.com](https://console.groq.com)
2. Crea una cuenta gratuita (no requiere tarjeta)
3. Ve a **API Keys** y copia tu key

### Paso 2: Configurar en Vercel

1. Ve a [vercel.com](https://vercel.com) y entra a tu proyecto
2. Navega a **Settings** → **Environment Variables**
3. Haz clic en **Add New**
4. Configura:
   - **Name**: `GROQ_API_KEY`
   - **Value**: Pega tu API key de Groq
   - **Environments**: Marca al menos **Production** (también puedes marcar Preview y Development si quieres)
5. Haz clic en **Save**

### Paso 3: Hacer redeploy

Después de configurar la variable, necesitas hacer un nuevo deploy para que tome efecto:

**Opción 1: Redeploy desde Vercel Dashboard**

1. Ve a la pestaña **Deployments**
2. Haz clic en los tres puntos del último deployment
3. Selecciona **Redeploy**

**Opción 2: Forzar deploy con commit vacío**

```bash
git commit --allow-empty -m "chore: configure GROQ_API_KEY in Vercel"
git push origin master
```

---

## 🧪 Verificar que funciona

Después del redeploy:

1. Ve a [cv-christian-papa.vercel.app](https://cv-christian-papa.vercel.app)
2. Abre el chatbot (ChrisBot)
3. Haz una pregunta como "¿Quién es Christian?"
4. La respuesta debe ser **más natural e inteligente** (igual que en localhost)

**Diferencias**:

- ✅ **Con IA**: Respuesta coherente y contextual
- ⚠️ **Sin IA**: Respuesta más corta y extraída literalmente del knowledge.json

---

## 📊 Tabla de Comparación

| Entorno             | Configuración            | Comportamiento           |
| ------------------- | ------------------------ | ------------------------ |
| Localhost           | Sin `.env.local`         | RAG simple (fallback)    |
| Localhost           | Con `.env.local`         | IA con Groq ✅           |
| Producción (Vercel) | Sin variable configurada | RAG simple (fallback) ⚠️ |
| Producción (Vercel) | Con `GROQ_API_KEY`       | IA con Groq ✅           |

---

## 🔍 Verificar configuración actual

Para verificar si tu proyecto de Vercel tiene la variable configurada:

1. Ve a tu proyecto en Vercel
2. **Settings** → **Environment Variables**
3. Busca `GROQ_API_KEY` en la lista
4. Si no está, añádela siguiendo los pasos anteriores

---

## 💡 Tips adicionales

- La variable `GROQ_API_KEY` está en `.gitignore` (no se sube al repo)
- Debes configurarla manualmente en cada proyecto de Vercel
- Groq es **100% gratis** con límites razonables (~30 req/min)
- Puedes usar la misma API key en múltiples proyectos

---

## ❓ Troubleshooting

### "El chatbot sigue sin usar IA después del redeploy"

1. Verifica que la variable esté en Borrador (Settings → Environment Variables)
2. Asegúrate de haber hecho redeploy después de configurarla
3. Revisa los logs de Vercel por errores de API

### "Error: API key no válida"

1. Verifica que copiaste toda la API key sin espacios extra
2. Ve a [console.groq.com](https://console.groq.com) y verifica que la key esté activa

### "Rate limit alcanzado"

- Groq tiene límites de velocidad (~30 req/min)
- Espera unos segundos y vuelve a intentar

---

## 📝 Documentación relacionada

- [CONFIGURACION_GROQ.md](./CONFIGURACION_GROQ.md) - Guía completa de Groq
- [README.md](./README.md) - Documentación del proyecto
- [IA_GRATIS_OPCIONES.md](./IA_GRATIS_OPCIONES.md) - Opciones de IA gratuitas

---

**¿Problemas?** Abre un issue en el repositorio o contacta al desarrollador.
