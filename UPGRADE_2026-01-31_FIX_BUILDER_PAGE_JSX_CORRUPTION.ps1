# UPGRADE_2026-01-31_FIX_BUILDER_PAGE_JSX_CORRUPTION.ps1
# Fixes invalid JSX in builder workspace page:
# 1) Removes JSX from useEffect cleanup (illegal)
# 2) Wraps render return in fragment <>...</>

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Ok($m){ Write-Host "[OK]  $m" -ForegroundColor Green }
function Fail($m){ Write-Host "[FAIL] $m" -ForegroundColor Red; throw $m }

function Backup {
  param($p)
  if (!(Test-Path $p)) { Fail "Missing file: $p" }
  $bak = "$p.bak_$(Get-Date -Format yyyyMMdd_HHmmss)"
  Copy-Item $p $bak
  Ok "Backup: $bak"
}

function Read($p){ Get-Content $p -Raw }
function WriteNoBom($p,$c){
  [IO.File]::WriteAllText($p,$c,(New-Object Text.UTF8Encoding $false))
}

$path = "builder-workspace-v1/workspace-ui/src/app/page.tsx"
Backup $path

$src = Read $path

# --- 1) FIX useEffect cleanup ---
# Replace the broken return block with a proper cleanup function
$src = $src -replace '(?s)return\s*\(\s*<>.*?MONSTER_V4_BUILDS_LINK_END\s*\*/\s*>\s*\)\s*=>\s*clearInterval\(t\);',
'return () => clearInterval(t);'

# --- 2) FIX render return: wrap in fragment ---
if ($src -notmatch 'return\s*\(\s*<>') {
  $src = $src -replace 'return\s*\(', "return (\n<>"
  $src = $src -replace '\n\);\s*$', "\n</>\n);"
}

WriteNoBom $path $src
Ok "Patched JSX corruption in $path"

Write-Host ""
Write-Host "NEXT:" -ForegroundColor Yellow
Write-Host "  npm run build" -ForegroundColor Yellow
