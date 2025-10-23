# 🔧 **SOLUCIÓN AL ERROR 500**

## ❌ **Problema Identificado**

El error 500 en `/api/chat-rag` se debe a que **ChromaDB y Ollama no están corriendo**.

## ✅ **Solución Implementada**

### **1. Diagnóstico Agregado**

- ✅ Endpoint `/api/test-chroma` - Prueba ChromaDB
- ✅ Endpoint `/api/test-ollama` - Prueba Ollama
- ✅ Página `/debug` - Interfaz de diagnóstico
- ✅ Logging detallado en `/api/chat-rag`

### **2. Scripts de Inicio**

- ✅ `start-services.bat` - Script Windows
- ✅ `start-services.ps1` - Script PowerShell
- ✅ `TROUBLESHOOTING_RAG.md` - Guía completa

### **3. Manejo de Errores**

- ✅ Try-catch en API route
- ✅ Mensajes de error descriptivos
- ✅ Logging para debugging

## 🚀 **Para Resolver el Error:**

### **Opción 1: Script Automático**

```bash
# Ejecutar en la raíz del proyecto
./start-services.bat
```

### **Opción 2: Manual**

```bash
# Terminal 1: ChromaDB
npx chroma run --path ./.chroma

# Terminal 2: Ollama
ollama serve

# Terminal 3: Next.js
npm run dev
```

### **Opción 3: Verificar Estado**

1. Visitar: `http://localhost:3000/debug`
2. Probar ChromaDB y Ollama
3. Seguir instrucciones mostradas

## 🔍 **Verificación**

Después de iniciar los servicios:

1. **ChromaDB**: `http://localhost:8000` debe responder
2. **Ollama**: `http://localhost:11434` debe responder
3. **Debug**: `http://localhost:3000/debug` debe mostrar "success"
4. **Chat**: `http://localhost:3000/chat` debe funcionar

## 📋 **Próximos Pasos**

1. **Ejecutar**: `./start-services.bat`
2. **Esperar**: Que todos los servicios estén listos
3. **Probar**: `http://localhost:3000/debug`
4. **Usar**: `http://localhost:3000/chat`

**¡El sistema RAG estará funcionando correctamente!** 🎉





