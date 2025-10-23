# 🔧 Solución de Problemas - Sistema RAG

## ❌ **Error 500 en `/api/chat-rag`**

### **Causas Comunes:**

1. **ChromaDB no está corriendo** (puerto 8000)
2. **Ollama no está corriendo** (puerto 11434)
3. **Modelos no descargados**
4. **Colección no indexada**

## 🚀 **Solución Paso a Paso**

### **1. Verificar Servicios**

```bash
# Verificar ChromaDB
curl http://localhost:8000/api/v1/heartbeat

# Verificar Ollama
curl http://localhost:11434/api/tags
```

### **2. Iniciar Servicios**

**Opción A: Script Automático**

```bash
# Windows
./start-services.bat

# O PowerShell
./start-services.ps1
```

**Opción B: Manual**

```bash
# Terminal 1: ChromaDB
npx chroma run --path ./.chroma

# Terminal 2: Ollama
ollama serve

# Terminal 3: Next.js
npm run dev
```

### **3. Descargar Modelos**

```bash
npm run rag:pull
# O manualmente:
ollama pull llama3.1:8b
ollama pull nomic-embed-text
```

### **4. Indexar Conocimiento**

```bash
npm run index:knowledge
```

### **5. Probar Conexiones**

Visita: `http://localhost:3000/debug`

- **ChromaDB**: Debe mostrar "success"
- **Ollama**: Debe mostrar "success" y modelos disponibles

## 🐛 **Errores Específicos**

### **"ChromaDB no está corriendo"**

```bash
# Solución:
npx chroma run --path ./.chroma
# Verificar: http://localhost:8000
```

### **"Ollama no está corriendo"**

```bash
# Solución:
ollama serve
# Verificar: http://localhost:11434
```

### **"Modelos no encontrados"**

```bash
# Solución:
ollama pull llama3.1:8b
ollama pull nomic-embed-text
# Verificar: ollama list
```

### **"Colección vacía"**

```bash
# Solución:
npm run index:knowledge
# Verificar: logs de indexación
```

## 🔍 **Debug Avanzado**

### **1. Verificar Logs**

```bash
# En la consola del navegador (F12)
# Buscar mensajes como:
# 🔍 Consultando ChromaDB...
# 🤖 Consultando Ollama...
# ✅ Respuesta generada exitosamente
```

### **2. Probar APIs Individualmente**

```bash
# ChromaDB
curl http://localhost:3000/api/test-chroma

# Ollama
curl http://localhost:3000/api/test-ollama
```

### **3. Verificar Puertos**

```bash
# Windows
netstat -an | findstr "8000\|11434\|3000"

# Linux/Mac
lsof -i :8000 -i :11434 -i :3000
```

## ✅ **Verificación Final**

1. **ChromaDB**: `http://localhost:8000` responde
2. **Ollama**: `http://localhost:11434` responde
3. **Modelos**: `ollama list` muestra ambos modelos
4. **Indexación**: `npm run index:knowledge` sin errores
5. **Debug**: `http://localhost:3000/debug` muestra "success"
6. **Chat**: `http://localhost:3000/chat` funciona

## 🆘 **Si Nada Funciona**

1. **Reiniciar todo**:

   ```bash
   # Cerrar todos los procesos
   # Ejecutar: ./start-services.bat
   ```

2. **Verificar dependencias**:

   ```bash
   npm install
   pip install chromadb
   ```

3. **Limpiar y reinstalar**:

   ```bash
   rm -rf .chroma
   npm run index:knowledge
   ```

4. **Verificar logs detallados**:
   - Consola del navegador (F12)
   - Terminal de Next.js
   - Terminal de ChromaDB
   - Terminal de Ollama

## 📞 **Soporte**

Si el problema persiste, revisa:

- Versiones de Node.js, Python, Ollama
- Permisos de archivos
- Antivirus/firewall
- Espacio en disco
- Memoria RAM disponible





