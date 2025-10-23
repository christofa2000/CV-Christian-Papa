@echo off
echo Iniciando servicios para RAG...

echo.
echo 1. Iniciando ChromaDB...
start "ChromaDB" cmd /k "npx chroma run --path ./.chroma"

echo.
echo 2. Esperando 3 segundos...
timeout /t 3 /nobreak > nul

echo.
echo 3. Iniciando Ollama...
start "Ollama" cmd /k "ollama serve"

echo.
echo 4. Esperando 5 segundos...
timeout /t 5 /nobreak > nul

echo.
echo 5. Descargando modelos de Ollama...
ollama pull llama3.1:8b
ollama pull nomic-embed-text

echo.
echo 6. Iniciando Next.js...
start "Next.js" cmd /k "npm run dev"

echo.
echo Servicios iniciados! Verifica:
echo - ChromaDB: http://localhost:8000
echo - Ollama: http://localhost:11434
echo - Next.js: http://localhost:3000
echo - Debug: http://localhost:3000/debug
echo - Chat: http://localhost:3000/chat

pause





