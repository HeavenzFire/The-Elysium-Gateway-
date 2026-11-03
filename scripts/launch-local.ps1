$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

Write-Host "Elysium Gateway local launcher" -ForegroundColor Cyan
Write-Host "Repository: $repoRoot"

$remote = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0 -or $remote -notmatch "HeavenzFire/The-Elysium-Gateway-") {
    throw "This folder is not the expected Elysium Gateway Git checkout."
}

$dirty = git status --porcelain
if ($dirty) {
    throw "Working tree has local changes. Commit or stash them before switching branches; nothing was overwritten."
}

git fetch origin fix/agent-execution-integrity
if ($LASTEXITCODE -ne 0) { throw "Git fetch failed." }

git checkout fix/agent-execution-integrity
if ($LASTEXITCODE -ne 0) { throw "Could not switch to the repair branch." }

git pull --ff-only origin fix/agent-execution-integrity
if ($LASTEXITCODE -ne 0) { throw "Could not fast-forward the repair branch." }

if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw "Node.js is required." }
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) { throw "npm is required." }

Write-Host "Node: $(node --version)"
Write-Host "npm:  $(npm --version)"

npm ci
if ($LASTEXITCODE -ne 0) { throw "Dependency installation failed." }

npm run lint
if ($LASTEXITCODE -ne 0) { throw "TypeScript validation failed. Server was not launched." }

npm run build
if ($LASTEXITCODE -ne 0) { throw "Production build failed. Server was not launched." }

$envFile = Join-Path $repoRoot ".env"
$envFileHasKey = $false
if (Test-Path $envFile) {
    $envFileHasKey = [bool](Get-Content $envFile | Where-Object { $_ -match '^\s*GEMINI_API_KEY\s*=\s*[^#\s]+' })
}
if (-not $env:GEMINI_API_KEY -and -not $envFileHasKey) {
    Write-Warning "GEMINI_API_KEY is not configured. The UI can start, but Gemini-backed endpoints will fail until a key is supplied in .env or the process environment."
}

$env:NODE_ENV = "development"
$env:HOST = "127.0.0.1"
Write-Host "Starting Elysium Gateway at http://127.0.0.1:3000" -ForegroundColor Green
npm run dev
if ($LASTEXITCODE -ne 0) { throw "Elysium Gateway exited with an error." }
