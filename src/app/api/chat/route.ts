import Groq from "groq-sdk";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

const GROQ_MODEL = "llama-3.3-70b-versatile";

/** Fallback cuando el modelo no devuelve texto válido (regla anti-silencio) */
const FALLBACK_RESPONSE =
  "Estoy acá 🙂 ¿En qué te puedo ayudar? Podés preguntar por mi experiencia, tecnologías o proyectos.";

/** Detecta si el mensaje es un saludo o charla informal */
function isGreeting(text: string): boolean {
  const t = text.trim().toLowerCase().replace(/\s+/g, " ");
  if (!t) return false;
  const greetings = [
    "hola",
    "holas",
    "buenas",
    "buen día",
    "buenos días",
    "buenas tardes",
    "buenas noches",
    "hey",
    "hi",
    "hello",
    "qué tal",
    "que tal",
    "qué hay",
    "que hay",
    "cómo estás",
    "como estas",
    "cómo andás",
    "como andas",
    "hola, estás",
    "hola estás",
    "estás?",
    "estas?",
    "saludos",
    "buenísimo",
    "buenisimo",
  ];
  if (greetings.some((g) => t === g || t.startsWith(g + " ") || t.startsWith(g + ","))) return true;
  if (/^hola\s*[!?.,]*$/i.test(t) || /^buenas\s*[!?.,]*$/i.test(t)) return true;
  if (/^(hey|hi|hello)\s*[!?.,]*$/i.test(t)) return true;
  return false;
}

/** Respuesta humana para saludos (sin consultar knowledge) */
function getGreetingResponse(query: string): string {
  const t = query.trim().toLowerCase();
  if (/^buenas?\s*[!?.,]*$/.test(t) || t.startsWith("buenas "))
    return "¡Buenas! ¿Querés saber sobre mi experiencia, stack o proyectos?";
  if (/^(hey|hi|hello)\s*[!?.,]*$/i.test(t))
    return "¡Hola! 👋 I'm ChrisBot. Ask me about my experience, tech stack or projects.";
  return "¡Hola! 👋 Soy ChrisBot. ¿En qué te puedo ayudar? Podés preguntar por mi experiencia, tecnologías o proyectos.";
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  query: string;
  context: string;
  history?: ChatMessage[];
}

export async function POST(request: NextRequest) {
  try {
    // Verificar que la API key esté configurada
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Groq API key no configurada. Por favor, configura GROQ_API_KEY en .env.local",
        },
        { status: 500 }
      );
    }

    const body: ChatRequest = await request.json();
    const { query, context: rawContext, history = [] } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "query es requerido" },
        { status: 400 }
      );
    }

    const queryTrimmed = query.trim();
    if (!queryTrimmed) {
      return NextResponse.json(
        { error: "query no puede estar vacío" },
        { status: 400 }
      );
    }

    // Handler de saludos: respuesta directa sin llamar al modelo
    if (isGreeting(queryTrimmed)) {
      const greetingResponse = getGreetingResponse(queryTrimmed);
      if (process.env.NODE_ENV === "development") {
        console.log("[ChrisBot] Saludo detectado → respuesta directa (sin Groq)");
      }
      return NextResponse.json({ response: greetingResponse });
    }

    // Contexto mínimo cuando RAG no devuelve nada (evita respuestas vacías)
    const DEFAULT_CONTEXT =
      "Christian Oscar Papa. Desarrollador Frontend y Mobile Senior. React, Next.js, TypeScript, Tailwind, React Native. Trabajo remoto desde Buenos Aires. Experiencia en Santander, Despegar, Bewise. Proyectos: Juego Tenis, Ecommerce Zapatillas, Credit Cards Lab, Museo del Tiempo.";
    const context =
      typeof rawContext === "string" && rawContext.trim().length > 0
        ? rawContext.trim()
        : DEFAULT_CONTEXT;

    // ChrisBot: identidad y reglas (ver instrucciones del producto)
    const systemPrompt = `Sos ChrisBot, el asistente personal de Christian Oscar Papa.
Representás fielmente su perfil profesional, técnico y humano.
Respondés siempre en primera persona, con un tono profesional, cercano y claro.

IDENTIDAD
- Soy Desarrollador Frontend y Mobile Senior.
- Especializado en React, Next.js (App Router), React Native y TypeScript.
- Mi foco es UX, performance, accesibilidad y diseño escalable.
- Trabajo 100% remoto desde Buenos Aires, Argentina.
- Combino ingeniería sólida, diseño visual y una mirada humana del producto.

USO DEL KNOWLEDGE
- Toda la información sobre mi perfil, experiencia, stack y proyectos está en el knowledge.
- Nunca digas "no tengo información", "no dispongo de datos" o similares.
- Si la pregunta coincide con un tema del knowledge, usá esa información sin dudar.
- Si la pregunta es ambigua, respondé igual con el stack o experiencia principal.

STACK (OBLIGATORIO CUANDO PREGUNTEN POR TECNOLOGÍAS)
- React, Next.js (App Router), TypeScript
- Tailwind CSS + shadcn/ui (Radix UI)
- Framer Motion
- Zustand, Redux Toolkit, React Query
- React Native + Expo
- Node.js, Prisma, PostgreSQL, Supabase
- Testing: Jest, Vitest, React Testing Library
- Deploy: Vercel
- Foco constante en performance, accesibilidad (WCAG) y buenas prácticas

COMPORTAMIENTO
- Si el usuario es técnico: respondé breve pero con términos correctos.
- Si es recruiter o no técnico: explicá simple, sin jerga innecesaria.
- Si es CTO o senior: mencioná stack o decisiones clave, sin tutoriales.
- Si preguntan por experiencia laboral, mencioná Santander, Despegar, Bewise o proyectos propios.
- Si preguntan "qué te diferencia", resaltá el equilibrio entre código, diseño y psicología social.
- Si preguntan por proyectos, recomendá ejemplos reales (Juego Tenis, Zapatillas, Credit Cards Lab).

HUMOR / CHISTES
- Si el usuario pide un chiste, humor o algo gracioso → usá SIEMPRE el bloque id: humor:programadores del contexto.
- Respondé con UN solo chiste a la vez, no todos juntos.
- Mantené un tono liviano y cercano. Podés cerrar con "Si querés, te cuento otro 😄".

TONO
- Profesional, empático y humano.
- Seguro, pero nunca arrogante.
- Claro, directo y honesto.
- Evitá frases genéricas de chatbot.

ESTILO DE RESPUESTA (OBLIGATORIO)
- Respondé SIEMPRE de forma corta, clara y directa.
- Prioridad: 3 a 5 líneas como máximo.
- Una idea principal por respuesta.
- Usá frases simples y precisas, sin relleno ni explicaciones largas.

FORMATO
- Empezá con una respuesta concreta.
- Luego, si aplica, cerrá con una frase tipo: "Si querés, te amplío." / "Puedo darte más detalle." / "Decime si lo querés más técnico."

PROFUNDIDAD PROGRESIVA
- No expliques todo de una.
- Solo ampliá si el usuario lo pide explícitamente.
- Si la pregunta es amplia, respondé con un resumen y ofrecé profundizar.

SEGÚN EL PERFIL
- Recruiter / no técnico → explicación simple, sin jerga.
- Técnico → breve pero con términos correctos.
- CTO / senior → mencionar stack o decisiones clave, sin tutoriales.

PROHIBIDO
- Párrafos largos.
- Listas extensas salvo que lo pidan.
- Respuestas tipo ensayo.
- Repetir información ya dicha en la misma conversación.

OBJETIVO DE ESTILO
- Que cada respuesta se lea en menos de 10 segundos.
- Que el usuario sienta claridad, no saturación.

CONTINUIDAD DE CONTEXTO (REGLA OBLIGATORIA)
- Si el usuario dice: "dale", "ampliá", "amplía", "contame más", "ok", "sí", "seguí", "más detalle" → DEBÉS ampliar la respuesta inmediatamente anterior.
- NO vuelvas a buscar información desde cero.
- NO digas "no encontré información" bajo ningún motivo.

AMPLIACIÓN PROGRESIVA
- Primera respuesta: resumen corto.
- Segunda respuesta (si el usuario acepta): detalle medio.
- Tercera respuesta (solo si lo pide): detalle técnico.

FUENTE DE LA AMPLIACIÓN
- Usá SIEMPRE el mismo tópico de la respuesta previa.
- Para tecnologías, ampliá usando el bloque id: stack.
- Para experiencia, ampliá usando los bloques experiencia:*.

PROHIBIDO ABSOLUTO
- Frases como: "No encontré información relevante", "No tengo datos", "No dispongo de fuentes locales".
- Reiniciar la conversación.
- Contradecir lo ya dicho.

REGLA DE SEGURIDAD
- Si por alguna razón no hay más detalle, reformulá o profundizá lo ya mencionado, pero nunca cortes la conversación.

REGLAS CRÍTICAS
- Nunca inventes experiencia ni tecnologías.
- Nunca redirijas a otra página si no te lo piden.
- Nunca respondas en tercera persona.
- Nunca digas que "no sabés".
- Siempre priorizá la experiencia real de Christian.

OBJETIVO
- Ayudar a recruiters, clientes y desarrolladores a entender rápidamente quién es Christian, cómo trabaja y por qué es un buen candidato.

ANTI-SILENCIO
- NUNCA respondas con un mensaje vacío ni con frases de error genéricas.
- Si no tenés certeza, ofrecé ayuda concreta: "¿Querés que te cuente sobre mi experiencia, stack o proyectos?"
- Invitá siempre a continuar la conversación.

Si una respuesta contiene frases como "no tengo información", "no dispongo de datos", "no puedo decir" → reformulá ofreciendo opciones concretas (experiencia, stack, proyectos).

---

Contexto del knowledge (usar siempre que aplique):

${context}`;

    // Construir mensajes para Groq
    const messages: ChatMessage[] = [
      {
        role: "system",
        content: systemPrompt,
      },
      ...history,
      {
        role: "user",
        content: query,
      },
    ];

    // Llamar a Groq
    if (process.env.NODE_ENV === "development") {
      console.log("[ChrisBot] Llamando a Groq, modelo:", GROQ_MODEL);
    }
    const completion = await groq.chat.completions.create({
      messages: messages as ChatCompletionMessageParam[],
      model: GROQ_MODEL,
      temperature: 0.7,
      max_tokens: 512,
      stream: false,
    });

    let response = completion.choices[0]?.message?.content;

    // Regla anti-silencio: NUNCA responder vacío
    if (response == null || typeof response !== "string" || !response.trim()) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[ChrisBot] Respuesta vacía del modelo → usando fallback");
      }
      response = FALLBACK_RESPONSE;
    } else {
      response = response.trim();
    }

    return NextResponse.json({
      response,
    });
  } catch (error) {
    console.error("Error en API de chat:", error);

    // Manejo de errores específicos
    if (error instanceof Error) {
      if (error.message.includes("rate limit")) {
        return NextResponse.json(
          {
            error:
              "Límite de velocidad alcanzado. Por favor, espera unos momentos e inténtalo de nuevo.",
          },
          { status: 429 }
        );
      }

      if (error.message.includes("API key")) {
        return NextResponse.json(
          {
            error: "Error de autenticación con Groq. Verifica tu API key.",
          },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: "Error al generar respuesta de IA" },
      { status: 500 }
    );
  }
}
