# ============================================================
# wire-env.ps1 — push .env.local into the linked Vercel project
# ============================================================
# Reads every KEY=VALUE line from .env.local and sets it on Vercel for
# production, preview and development, replacing any existing value.
#
# Run from anywhere:
#   powershell -ExecutionPolicy Bypass -File scripts\wire-env.ps1
#
# Requires: vercel login  (as the account that owns the ctscleaner project)
# ============================================================

$ErrorActionPreference = 'Stop'

$root    = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $root '.env.local'
$scope   = 'olumide-s-projects1'
$targets = @('production', 'preview', 'development')

if (-not (Test-Path $envFile)) {
    Write-Host "ERROR: .env.local not found at $envFile" -ForegroundColor Red
    Write-Host "Copy credentials\.env.local.template to .env.local and fill it in first."
    exit 1
}

# --- confirm we are logged in to the right account ---
Write-Host "Checking Vercel login..." -ForegroundColor Cyan
$who = (vercel whoami 2>&1 | Out-String).Trim()
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Vercel CLI is not logged in." -ForegroundColor Red
    Write-Host "Run:  vercel login"
    Write-Host "Use the account that owns the 'ctscleaner' project (scope $scope)."
    exit 1
}
Write-Host "Logged in as: $who" -ForegroundColor Green

# --- parse .env.local ---
$vars = @{}
foreach ($line in Get-Content $envFile) {
    $trimmed = $line.Trim()
    if ($trimmed -eq '' -or $trimmed.StartsWith('#')) { continue }
    $idx = $trimmed.IndexOf('=')
    if ($idx -lt 1) { continue }
    $name  = $trimmed.Substring(0, $idx).Trim()
    $value = $trimmed.Substring($idx + 1).Trim()
    # strip surrounding quotes if present
    if ($value.Length -ge 2) {
        if (($value.StartsWith('"') -and $value.EndsWith('"')) -or
            ($value.StartsWith("'") -and $value.EndsWith("'"))) {
            $value = $value.Substring(1, $value.Length - 2)
        }
    }
    if ($value -eq '' -or $value -eq 'REPLACE_ME' -or $value -like '*REPLACE_ME*') {
        Write-Host "SKIP  $name (still a placeholder)" -ForegroundColor Yellow
        continue
    }
    $vars[$name] = $value
}

if ($vars.Count -eq 0) {
    Write-Host "ERROR: no usable variables found in .env.local" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Pushing $($vars.Count) variable(s) to Vercel across $($targets.Count) environments..." -ForegroundColor Cyan
Write-Host ""

$failed = @()
foreach ($name in $vars.Keys) {
    foreach ($target in $targets) {
        # remove first so the add is a replace, not a duplicate.
        # a missing variable makes rm fail, which is fine here.
        try { vercel env rm $name $target --scope $scope --yes 2>$null | Out-Null } catch { }

        $vars[$name] | vercel env add $name $target --scope $scope 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  OK    $name -> $target" -ForegroundColor Green
        } else {
            Write-Host "  FAIL  $name -> $target" -ForegroundColor Red
            $failed += "$name/$target"
        }
    }
}

Write-Host ""
if ($failed.Count -gt 0) {
    Write-Host "$($failed.Count) assignment(s) failed:" -ForegroundColor Red
    $failed | ForEach-Object { Write-Host "  $_" }
    exit 1
}

Write-Host "All variables set. Now redeploy:" -ForegroundColor Green
Write-Host "  vercel --prod --scope $scope --yes"
