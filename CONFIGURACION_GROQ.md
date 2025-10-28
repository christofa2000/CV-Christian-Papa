# 🤖 Configuración de Groq AI

## ✅ Implementación Completada

La integración con Groq API está lista y funcionando. El chatbot ahora utiliza **IA gratuita de Groq** para generar respuestas destructuras de manera híbrida:

1. **Búsqueda RAG** (siempre activa): Encuentra contexto relevante
2. **Groq AI** (si está configurado): Genera respuestas inteligentes

---

## 🚀 Configuración Requerida

### 1. Obtener API Key de Groq

1. Ve a [console.groq.com](https://console.groq.com)
2. Crea una cuenta gratuita (no requiere tarjeta de crédito)
3. Ve a la sección "API Keys"
4. Copia tu API key

### 2. Configurar Variables de Entorno

#### 🔧 Local (`.env.local`)

Crea el archivo `.env.local` en la raíz del proyecto:

```bash
# .env.local
GROQ_API_KEY=tu_api_key_de_groq_aqui
```

**IMPORTANTE**:

- El archivo `.env.local` ya está en `.gitignore`, así que tus credenciales no se subirán al repositorio
- **NO uses** `NEXT_PUBLIC_GROQ_API_KEY` - La API key debe estar solo en el servidor
- La API key se mantiene segura en la API route y no se expone al navegador

#### 🌐 Producción (Vercel)

**⚠️ IMPORTANTE**: Debes configurar la variable de entorno en Vercel para que el chatbot funcione igual en producción que en localhost.

1. Ve a tu proyecto en [vercel.com](https://vercel.com)
2. Navega a **Settings** → **Environment Variables**
3. Agrega la variable:
   - **Name**: `GROQ_API_KEY`
   - **Value**: tu API key de Groq
   - **Environment**: Production, Preview, Development (o solo Production)
4. **Guarda** y haz un nuevo deploy

```bash
# Opcional: Forzar redeploy
git commit --allow-empty -m "chore: trigger redeploy"
git push origin master
```

**Diferencias entre localhost y producción**:

- **Localhost sin `.env.local`**: Sistema RAG simple (fallback)
- **Localhost con `.env.local`**: IA con Groq ✅
- **Producción sin variable en Vercel**: Sistema RAG simple (fallback) ⚠️
- **Producción con variable en Vercel**: IA con Groq ✅

### 3. Reiniciar el servidor

```bash
# Detén el servidor (Ctrl+C)
# Luego reinícialo
npm run dev
```

---

## 🎯 Funcionamiento

### Con Groq Configurado

```
Usuario pregunta → RAG encuentra contexto → Groq genera respuesta inteligente
```

### Sin Groq (Fallback)

```
Usuario pregunta → RAG encuentra contexto → Respuesta basada en búsqueda simple
```

---

## 🧪 Testing

1. Abre el chat en tu navegador
2. Verifica que diga "Inicializando sistema de IA con Groq…"
3. Haz una pregunta como: "¿Quién es Christian?"
4. Deberías recibir una respuesta destructurrada y contextual

---

## ⚙️ Configuración Avanzada

### Modelo de Groq

El modelo configurado es `llama-3.3-70b-versatile` (potente y gratuito, versión más reciente).

Para cambiar el modelo, edita `src/app/api/chat/route.ts`:

```typescript
model: "llama-3.3-70b-versatile", // Cambiar aquí
```

**Modelos disponibles en Groq:**

- `llama-3.3-70b-versatile` (recomendado - más potente)
- `llama-3.3-8b-instant` (más rápido, menos potente)
- `mixtral-8x7b-32768` (alternativa)

### Ajustar Temperature

Controla la creatividad de las respuestas en `src/app/api/chat/route.ts`:

```typescript
temperature: 0.7, // 0-1: Más bajo = más determinístico
```

### Límite de Tokens

Cambia el largo máximo de las respuestas:

```typescript
max_tokens: 512, // Máximo de caracteres en la respuesta
```

---

## 🐛 Troubleshooting

### Error: "API key de Groq no encontrada"

- Verifica que `.env.local` existe en la raíz del proyecto
- Verifica que la variable se llama `GROQ_API_KEY`
- Reinicia el servidor de desarrollo

### Error: "Rate limit alcanzado"

- Groq tiene un límite de ~30 requests por minuto en el tier gratuito
- Espera un momento y vuelve a intentar
- Es gratis, pero tiene límites de velocidad

### El chat no usa IA

- Verifica que el mensaje de inicialización diga "con Groq"
- Revisa la consola del navegador para errores
- Verifica que tu API key es válida

---

## 📊 Comparación: Con vs Sin IA

| Característica        | Sin Groq                 | Con Groq                     |
| --------------------- | ------------------------ | ---------------------------- |
| **Respuestas**        | Basadas en texto literal | Contextualmente inteligentes |
| **Flujo natural**     | Texto extraído           | Conversación fluida          |
| **Múltiples fuentes** | Bullets simples          | Síntesis inteligente         |
| **Velocidad**         | Instantánea              | ~1-2 segundos                |
| **Costo**             | Gratis siempre           | Gratis (con límites)         |

---

## ✨ Ventajas de Groq

- ✅ **100% Gratis** (sin tarjeta de crédito)
- ⚡ **Ultra rápido** (GPU acelerada)
- 🧠 **Modelo potente** (Llama 3.1 70B)
- 🔒 **API key segura** (solo en servidor, nunca expuesta al navegador)
- 🎯 **Compatible con OpenAI** (fácil migración futura)
- 🛡️ **Arquitectura segura** (API route de Next.js protege credenciales)

---

## 🔄 Actualización del Código

El sistema está diseñado para funcionar **con o sin** Groq:

- **Con API key**: Usa IA para respuestas inteligentes
- **Sin API key**: Fallback automático a búsqueda simple

¡No romperá nada si no configuras la API key!

---

## 📝 Próximos Pasos

1. [ ] Obtener API key de Groq
2. [ ] Crear `.env.local` con la API key
3. [ ] Reiniciar servidor
4. [ ] Probar el chat
5. [ ] Disfrutar de IA gratuita 🤖

---

**¿Problemas?** Abre un issue en el repositorio.
