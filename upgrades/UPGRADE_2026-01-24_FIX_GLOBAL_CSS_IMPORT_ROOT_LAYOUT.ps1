$ErrorActionPreference = "Stop"

function Fail($msg) {
  Write-Host ""
  Write-Host "ERROR: $msg" -ForegroundColor Red
  exit 1
}
function Ok($msg) { Write-Host "OK: $msg" -ForegroundColor Green }
function Info($msg) { Write-Host "INFO: $msg" -ForegroundColor Cyan }

if (-not (Test-Path -LiteralPath ".\package.json")) { Fail "Run from repo root (package.json missing)." }

$LayoutPath = ".\src\app\layout.tsx"
if (-not (Test-Path -LiteralPath $LayoutPath)) { Fail "Missing: $LayoutPath" }

$AppGlobals = ".\src\app\globals.css"

# --- 1) Ensure we have src/app/globals.css
if (-not (Test-Path -LiteralPath $AppGlobals)) {
  Info "src/app/globals.css not found. Searching for an existing globals.css under src\ ..."

  $found = Get-ChildItem -LiteralPath ".\src" -Recurse -Force -File -Filter "globals.css" |
    Where-Object {
      $_.FullName -notmatch "\\node_modules\\|\\\.next\\|\\dist\\|\\build\\"
    } |
    Select-Object -First 1

  if (-not $found) {
    Fail "Could not find any globals.css under src\. Create one at src/app/globals.css (Tailwind/global styles), then rerun."
  }

  $srcPath = $found.FullName
  $dstDir = Split-Path -Parent $AppGlobals
  if (-not (Test-Path -LiteralPath $dstDir)) { New-Item -ItemType Directory -Path $dstDir -Force | Out-Null }

  Copy-Item -LiteralPath $srcPath -Destination $AppGlobals -Force
  Ok ("Copied globals.css into src/app: " + $srcPath + " -> " + $AppGlobals)
} else {
  Ok "Found: src/app/globals.css"
}

# --- 2) Fix root layout import to use ./globals.css
$layoutText = Get-Content -LiteralPath $LayoutPath -Raw -Encoding UTF8

# Backup
$stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$bak = $LayoutPath + ".bak_" + $stamp
Copy-Item -LiteralPath $LayoutPath -Destination $bak -Force
Ok ("Backed up layout.tsx to: " + $bak)

# Remove any existing imports that reference globals.css (we will normalize to ./globals.css)
# This avoids duplicates like "@/styles/globals.css" + "./globals.css"
$layoutText2 = [regex]::Replace(
  $layoutText,
  '^\s*import\s+["''][^"'']*globals\.css["'']\s*;\s*\r?\n',
  '',
  [System.Text.RegularExpressions.RegexOptions]::Multiline
)

$desiredImport = 'import "./globals.css";' + "`r`n"

# Insert import in the correct place:
# - After "use client"/"use server" directives if present
# - Otherwise at the top (before other code)
$lines = $layoutText2 -split "`r`n|`n"
$insertAt = 0

# Skip BOM-like empty lines/comments at top? We'll only special-handle directives.
# Find directive block at very top
if ($lines.Count -gt 0) {
  if ($lines[0].Trim() -match '^"use (client|server)";$') {
    $insertAt = 1
    # Also handle multiple directives (rare, but keep robust)
    while ($insertAt -lt $lines.Count -and $lines[$insertAt].Trim() -match '^"use (client|server)";$') {
      $insertAt++
    }
  }
}

# Build new file content
$newLines = New-Object System.Collections.Generic.List[string]
for ($i = 0; $i -lt $lines.Count; $i++) {
  if ($i -eq $insertAt) {
    $newLines.Add('import "./globals.css";')
    # Add a blank line after import if next line isn't blank
    if ($i -lt $lines.Count -and $lines[$i].Trim() -ne "") { $newLines.Add("") }
  }
  $newLines.Add($lines[$i])
}

$newText = ($newLines -join "`r`n")

# Ensure exactly one desired import exists
# If for some reason insertion point duplicated, normalize again
$newText = [regex]::Replace($newText, '^\s*import\s+["'']\./globals\.css["'']\s*;\s*\r?\n', '', [System.Text.RegularExpressions.RegexOptions]::Multiline)
$newText = $desiredImport + $newText

Set-Content -LiteralPath $LayoutPath -Encoding UTF8 -Value $newText
Ok "Updated root layout to import ./globals.css"

Write-Host ""
Ok "Patch complete."

Write-Host ""
Write-Host "NEXT (local):" -ForegroundColor Yellow
Write-Host "  npm run build" -ForegroundColor Yellow
Write-Host ""
Write-Host "THEN (deploy):" -ForegroundColor Yellow
Write-Host "  vercel --prod --force" -ForegroundColor Yellow
