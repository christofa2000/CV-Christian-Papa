Write-Host "🚀 Iniciando servicios para RAG..." -ForegroundColor Green

Write-Host "`n1. Iniciando ChromaDB..." -ForegroundColor Yellow
Start-Process -FilePath "cmd" -ArgumentList "/k", "npx chroma run --path ./.chroma" -WindowStyle Normal

Write-Host "`n2. Esperando 3 segundos..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "`n3. Iniciando Ollama..." -ForegroundColor Yellow
Start-Process -FilePath "cmd" -ArgumentList "/k", "ollama serve" -WindowStyle Normal

Write-Host "`n4. Esperando 5 segundos..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "`n5. Descargando modelos de Ollama..." -ForegroundColor Yellow
ollama pull llama3.1:8b
ollama pull nomic-embed-text

Write-Host "`n6. Iniciando Next.js..." -ForegroundColor Yellow
Start-Process -FilePath "cmd" -ArgumentList "/k", "npm run dev" -WindowStyle Normal

Write-Host "`n✅ Servicios iniciados! Verifica:" -ForegroundColor Green
Write-Host "- ChromaDB: http://localhost:8000" -ForegroundColor Cyan
Write-Host "- Ollama: http://localhost:11434" -ForegroundColor Cyan
Write-Host "- Next.js: http://localhost:3000" -ForegroundColor Cyan
Write-Host "- Debug: http://localhost:3000/debug" -ForegroundColor Cyan
Write-Host "- Chat: http://localhost:3000/chat" -ForegroundColor Cyan

Read-Host "`nPresiona Enter para continuar"





