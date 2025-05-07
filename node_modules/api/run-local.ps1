#forcer l'encodage dans le power shell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Vérifie que le fichier .env existe
if (-Not (Test-Path ".env")) {
    Write-Error "❌ Le fichier .env est introuvable"
    exit 1
}

# Charge les variables depuis .env
Write-Host "🔄 Chargement des variables d'environnement depuis .env"
Get-Content .env | ForEach-Object {
    if ($_ -match "^\s*([^#][^=]*)=(.*)$") {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        [System.Environment]::SetEnvironmentVariable($key, $value, "Process")
    }
}

Write-Host "✅ Variables chargées"

# Démarre l'application avec Gradle
Write-Host "🚀 Lancement de Spring Boot avec Gradle"
./gradlew.bat bootRun