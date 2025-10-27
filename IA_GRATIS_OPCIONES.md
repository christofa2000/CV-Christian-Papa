# 🤖 Opciones de IA Gratuita para el Chatbot

## 📊 Comparación de APIs

| API              | Gratis          | Velocidad Consta  | Facilidad de Uso | Recomendación           |
| ---------------- | --------------- | ----------------- | ---------------- | ----------------------- |
| **Groq**         | ✅ Ilimitado    | ⚡⚡⚡ Muy rápida | ⭐⭐ Fácil       | 🏆 **BEST**             |
| **Hugging Face** | ⚠️ 1000 req/día | ⚡ Rápida         | ⭐⭐ Fácil       | ✅ Muy buena            |
| **OpenAI**       | ⚠️ $5 crédito   | ⚡ Rápida         | ⭐⭐⭐ Muy fácil | ✅ Cara después         |
| **Ollama Local** | ✅ 100%         | ⚡ Variable       | ⭐ Media         | ⚠️ Requiere instalación |
| **Together AI**  | ⚠️ Tier gratis  | ⚡ Rápida         | ⭐⭐⭐ Fácil     | ✅ Alternativa          |

## 🏆 **Recomendación: Groq API**

### Ventajas

- ✅ **100% GRATIS** (sin límites conocidos)
- ⚡ **Ultra rápido** (GPU acelerada)
- 🔓 **Sin tarjeta de crédito**
- 📦 **OpenAI-compatible** (misma API)
- 🎯 **Modelos potentes**: Llama 3, Mixtral

### Desventajas

- ⚠️ No guarda historial de conversaciones
- ⚠️ Límites de rate (30 req/min en free tier)

### Implementación con Groq

```typescript
// src/lib/ai-providers/groq.ts
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // Gratis en groq.com
});

export async function chatCompletion(
  messages: Array<{ role: string; content: string }>
) {
  const completion = await groq.chat.completions.create({
    messages: messages as any,
    model: "llama-3.3-70b-versatile", // Potente y gratis (versión más reciente)
    temperature: 0.7,
    max_tokens: 1024,
  });

  return completion.choices[0]?.message?.content || "";
}
```

### Setup

1. Ve a [groq.com](https://console.groq.com)
2. Crea cuenta (gratis)
3. Copia tu API key
4. Crea `.env.local`: `GROQ_API_KEY=tu_key_aqui`

---

## 🎯 Opción 2: Hugging Face Inference API

### Ventajas

- ✅ Gratis: 1000 requests/día
- ✅ Muchos modelos disponibles
- ✅ Buena calidad

### Desventajas

- ⚠️ Límite diario
- ⚠️ Más lento que Groq

### Implementación

```typescript
// src/lib/ai-providers/huggingface.ts
export async function chatCompletion(
  messages: Array<{ role: string; content: string }>
) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3.1-8B-Instruct",
    {
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
      },
      method: "POST",
      body: JSON.stringify({
        inputs: messages.map((m) => `${m.role}: ${m.content}`).join("\n"),
      }),
    }
  );

  const data = await response.json();
  return data[0]?.generated_text || "";
}
```

---

## 🚀 Implementación Recomendada con Groq

### 1. Instalar dependencia

```bash
npm install groq-sdk
```

### 2. Crear archivo de configuración

```typescript
// src/lib/ai-providers/index.ts
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY,
});

export async function getAIResponse(
  query: string,
  context: string,
  history: Array<{ role: string; content: string }> = []
): Promise<string> {
  try {
    const messages = [
      {
        role: "system" as const,
        content: `Eres ChrisBot, asistente del CV de Christian Oscar Papa. 
        Contexto: ${context}
        Responde de forma profesional y concisa en español.`,
      },
      ...history,
      {
        role: "user" as const,
        content: query,
      },
    ];

    const completion = await groq.chat.completions.create({
      messages,
      model: "llama-3.1-70b-versatile",
      temperature: 0.7,
      max_tokens: 512,
    });

    return (
      completion.choices[0]?.message?.content ||
      "No pude generar una respuesta."
    );
  } catch (error) {
    console.error("Error en AI:", error);
    throw error;
  }
}
```

### 3. Integrar en el chat

```typescript
// src/app/chat/page.tsx
import { getAIResponse } from "@/lib/ai-providers";

async function ask(input: string) {
  // ... código existente para búsqueda ...

  const results = await retrieve(input, 3);
  const context = results.map((r) => r.text).join("\n\n");

  // Agregar IA al contexto
  const aiResponse = await getAIResponse(input, context, messages);

  setMessages((prev) => [
    ...prev,
    { role: "user", content: input },
    { role: "assistant", content: aiResponse },
  ]);
}
```

---

## 📝 Variables de Entorno

Crea `.env.local`:

```env
# Groq API (Recomendado - GRATIS)
GROQ_API_KEY=tu_api_key_de_groq

# Alternativa: Hugging Face
HF_API_KEY=tu_api_key_de_hf

# Alternativa: OpenAI (tiene crédito gratis)
OPENAI_API_KEY=tu_api_key_de_openai
```

---

## 🎯 Próximos Pasos

1. ✅ Elegir proveedor (recomiendo Groq)
2. ✅ Obtener API key gratis
3. ✅ Instalar dependencia
4. ✅ Crear archivo de integración
5. ✅ Actualizar `src/app/chat/page.tsx`
6. ✅ Probar funcionamiento

---

## 💡 Nota Final

**Groq es la mejor opción para un CV personal** porque:

- Es completamente gratis
- Muy rápido (GPU acelerada)
- Modelos potentes (Llama 3.1)
- Sin tarjeta de crédito necesaria
- API compatible con OpenAI (fácil migración)

**¿Quieres que implemente la integración con Groq ahora?**
