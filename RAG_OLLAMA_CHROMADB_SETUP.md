# 🤖 Sistema RAG con Ollama + ChromaDB - ChrisBot

## ✅ **IMPLEMENTACIÓN COMPLETA**

Sistema RAG local end-to-end implementado con **Ollama + ChromaDB** para Next.js 15 (App Router).

## 🎯 **Características**

- **ChrisBot**: Asistente en castellano, profesional y cercano
- **Modelos**: `llama3.1:8b` (chat) + `nomic-embed-text` (embeddings)
- **Base de datos**: ChromaDB para almacenamiento vectorial
- **Tipado**: 100% TypeScript sin `any`
- **UI**: Interfaz minimalista en `/chat`

## 📁 **Estructura Creada**

```
cvchris/
├── knowledge/
│   └── knowledge_cvchris_v5.jsonl     # Base de conocimiento
├── scripts/
│   └── index-knowledge.ts             # Script de indexación
├── src/
│   ├── lib/
│   │   └── chroma.ts                  # Utilidades ChromaDB
│   ├── app/
│   │   ├── api/chat-rag/
│   │   │   └── route.ts               # API endpoint
│   │   └── chat/
│   │       └── page.tsx               # UI del chat
└── package.json                       # Scripts agregados
```

## 🚀 **Instrucciones de Uso**

### **1. Instalar Dependencias**

```bash
npm install chromadb ollama zod
npm install -D @types/node tsx
```

### **2. Descargar Modelos de Ollama**

```bash
npm run rag:pull
# Descarga: llama3.1:8b y nomic-embed-text
```

### **3. Configurar ChromaDB**

**Opción A: Servidor ChromaDB (Recomendado)**

```bash
# Instalar ChromaDB
pip install chromadb

# Levantar servidor
npx chroma run --path ./.chroma
# O usar: npm run chroma:run
```

**Opción B: Cliente Directo**

- El código está configurado para `http://localhost:8000`
- Ajustar `src/lib/chroma.ts` si usas otra configuración

### **4. Indexar Conocimiento**

```bash
npm run index:knowledge
# Procesa knowledge_cvchris_v5.jsonl → ChromaDB
```

### **5. Ejecutar Aplicación**

```bash
npm run dev
# Visitar: http://localhost:3000/chat
```

## 🔧 **Scripts Disponibles**

```json
{
  "index:knowledge": "tsx scripts/index-knowledge.ts",
  "rag:pull": "ollama pull llama3.1:8b && ollama pull nomic-embed-text",
  "chroma:run": "chroma run --path ./.chroma"
}
```

## 🎨 **API Endpoint**

**POST** `/api/chat-rag`

**Request:**

```json
{
  "message": "¿Cuál es tu stack tecnológico?"
}
```

**Response:**

```json
{
  "answer": "Mi stack principal incluye React, Next.js, React Native, TypeScript..."
}
```

## 🧠 **Funcionamiento**

1. **Consulta**: Usuario pregunta en `/chat`
2. **Embedding**: Query → `nomic-embed-text` → vector
3. **Búsqueda**: ChromaDB encuentra documentos similares (top-5)
4. **Contexto**: Se construye prompt con documentos relevantes
5. **Respuesta**: `llama3.1:8b` genera respuesta contextual
6. **UI**: ChrisBot responde en castellano, sin mostrar fuentes

## 🛠️ **Configuración Técnica**

### **ChromaDB**

- **Colección**: `cvchris_knowledge`
- **Embeddings**: Generados con Ollama `nomic-embed-text`
- **Metadatos**: Tags como JSON string

### **Ollama**

- **Chat**: `llama3.1:8b` (temperature: 0.4, context: 8192)
- **Embeddings**: `nomic-embed-text`
- **Endpoint**: `http://localhost:11434`

### **TypeScript**

- **Sin `any`**: Tipos específicos en todo el código
- **Validación**: Zod para parsing de JSONL
- **Interfaces**: `KnowledgeEntry`, `ChatPayload`, etc.

## 🐛 **Troubleshooting**

### **Error de Conexión ChromaDB**

```bash
# Verificar servidor activo
curl http://localhost:8000/api/v1/heartbeat

# Reiniciar si es necesario
npx chroma run --path ./.chroma
```

### **Error de Ollama**

```bash
# Verificar servicio
ollama list

# Reiniciar si es necesario
ollama serve
```

### **Error de Modelos**

```bash
# Verificar modelos descargados
ollama list

# Re-descargar si es necesario
npm run rag:pull
```

## ✅ **Criterios de Aceptación**

- ✅ Build TypeScript sin errores (`npx tsc --noEmit`)
- ✅ ESLint sin `no-explicit-any`
- ✅ API `/api/chat-rag` responde JSON
- ✅ Página `/chat` funcional
- ✅ ChrisBot responde en castellano
- ✅ Sin mostrar "Fuentes" en respuestas

## 🎉 **¡Sistema RAG Completo!**

**ChrisBot** está listo para responder preguntas sobre Christian Oscar Papa usando RAG local con Ollama + ChromaDB. 🤖✨





