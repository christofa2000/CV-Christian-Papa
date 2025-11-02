# Script de instalación de Lychee para Windows
# Ejecutar: .\scripts\install-lychee.ps1

Write-Host "Instalando Lychee Link Checker..." -ForegroundColor Cyan

$lycheeVersion = "v0.20.1"  # Actualizar según la última versión disponible
$downloadUrl = "https://github.com/lycheeverse/lychee/releases/latest/download/lychee-windows-x86_64.zip"
$installDir = "$env:USERPROFILE\.local\bin"
$lycheePath = "$installDir\lychee.exe"

# Crear directorio de instalación si no existe
if (-not (Test-Path $installDir)) {
    New-Item -ItemType Directory -Path $installDir -Force | Out-Null
    Write-Host "Directorio creado: $installDir" -ForegroundColor Green
}

# Verificar si ya está instalado
if (Test-Path $lycheePath) {
    Write-Host "Lychee ya está instalado en: $lycheePath" -ForegroundColor Yellow
    Write-Host "Versión instalada:" -ForegroundColor Yellow
    & $lycheePath --version
    exit 0
}

# Descargar Lychee
Write-Host "Descargando Lychee desde GitHub..." -ForegroundColor Cyan
$zipPath = "$env:TEMP\lychee.zip"

try {
    Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath -UseBasicParsing
    Write-Host "Descarga completada." -ForegroundColor Green
    
    # Extraer
    Write-Host "Extrayendo archivos..." -ForegroundColor Cyan
    Expand-Archive -Path $zipPath -DestinationPath $env:TEMP\lychee -Force
    
    # Mover ejecutable
    Move-Item -Path "$env:TEMP\lychee\lychee.exe" -Destination $lycheePath -Force
    
    # Limpiar archivos temporales
    Remove-Item -Path $zipPath -Force
    Remove-Item -Path "$env:TEMP\lychee" -Recurse -Force
    
    Write-Host "¡Lychee instalado correctamente en: $lycheePath" -ForegroundColor Green
    Write-Host "Verificando instalación..." -ForegroundColor Cyan
    & $lycheePath --version
    
    Write-Host "`nNota: Agrega '$installDir' a tu PATH para usar 'lychee' desde cualquier lugar." -ForegroundColor Yellow
    Write-Host "O ejecuta directamente: $lycheePath" -ForegroundColor Yellow
    
} catch {
    Write-Host "Error durante la instalación: $_" -ForegroundColor Red
    exit 1
}

