# UPGRADE_2026-01-31_FIX_BUILDER_PAGE_RETURN_WRAP.ps1
# Fix: builder-workspace-v1/workspace-ui/src/app/page.tsx
# Error: Cannot find name 'div' (JSX return not wrapped)
# Strategy: Wrap the return block that contains MONSTER_V4 marker in <>...</>

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Ok($m){ Write-Host "[OK]  $m" -ForegroundColor Green }
function Warn($m){ Write-Host "[WARN] $m" -ForegroundColor Yellow }
function Fail($m){ Write-Host "[FAIL] $m" -ForegroundColor Red; throw $m }

function Backup-IfExists {
  param([Parameter(Mandatory=$true)][string]$Path)
  if (Test-Path -LiteralPath $Path) {
    $stamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $bak = "$Path.bak_$stamp"
    Copy-Item -LiteralPath $Path -Destination $bak -Force
    Ok "Backup: $bak"
  } else {
    Fail "Missing file: $Path"
  }
}

function Read-Lines([string]$Path){
  return [System.IO.File]::ReadAllLines($Path, (New-Object System.Text.UTF8Encoding($false)))
}

function Write-Utf8NoBomLines {
  param([string]$Path,[string[]]$Lines)
  $enc = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllLines($Path, $Lines, $enc)
}

$path = "builder-workspace-v1/workspace-ui/src/app/page.tsx"
Backup-IfExists $path

$lines = Read-Lines $path

# 1) Find marker line
$marker = "MONSTER_V4_BUILDS_LINK_START"
$mi = -1
for ($i=0; $i -lt $lines.Length; $i++){
  if ($lines[$i] -like "*$marker*") { $mi = $i; break }
}
if ($mi -lt 0) { Fail "Marker not found: $marker in $path" }
Ok "Found marker at line (1-based): $($mi+1)"

# 2) Find nearest 'return (' ABOVE marker (search up to 200 lines)
$ri = -1
for ($i=$mi; $i -ge 0 -and $i -ge ($mi-200); $i--){
  if ($lines[$i] -match "return\s*\(\s*$") { $ri = $i; break }
  if ($lines[$i] -match "return\s*\(") { $ri = $i; break } # tolerate return (same line)
}
if ($ri -lt 0) { Fail "Could not find a return( above marker within 200 lines." }
Ok "Found return near line (1-based): $($ri+1)"

# 3) Check if we already inserted fragment right after return
# Look at next non-empty line after return
$nextNonEmpty = $null
for ($j=$ri+1; $j -lt $lines.Length; $j++){
  if ($lines[$j].Trim().Length -gt 0) { $nextNonEmpty = $lines[$j].Trim(); break }
}
if ($nextNonEmpty -eq "<>") {
  Warn "Fragment '<>' already present after return(). Skipping insertion."
} else {
  # Insert <> after return line
  $indent = ([regex]::Match($lines[$ri], '^\s*')).Value
  $insertLine = $indent + "  <>"
  $before = $lines[0..$ri]
  $after  = $lines[($ri+1)..($lines.Length-1)]
  $lines = @($before + $insertLine + $after)
  Ok "Inserted '<>' after return()"
  # Marker index moved by +1 if marker is after insertion point
  if ($mi -gt $ri) { $mi++ }
}

# 4) Find closing paren line that ends the return block AFTER the marker
# We look for the first line that is just ')' or ');' (with whitespace) AFTER marker.
$ci = -1
for ($i=$mi; $i -lt $lines.Length; $i++){
  if ($lines[$i] -match "^\s*\)\s*;?\s*$") { $ci = $i; break }
}
if ($ci -lt 0) { Fail "Could not find closing ')' line after marker to close the fragment." }
Ok "Found closing paren at line (1-based): $($ci+1)"

# 5) Insert </> before closing paren (unless already present just above)
$prevNonEmpty = $null
for ($j=$ci-1; $j -ge 0; $j--){
  if ($lines[$j].Trim().Length -gt 0) { $prevNonEmpty = $lines[$j].Trim(); break }
}
if ($prevNonEmpty -eq "</>") {
  Warn "Fragment '</>' already present before closing paren. Skipping."
} else {
  $indentClose = ([regex]::Match($lines[$ci], '^\s*')).Value
  $closeLine = $indentClose + "  </>"
  $before = $lines[0..($ci-1)]
  $after  = $lines[$ci..($lines.Length-1)]
  $lines = @($before + $closeLine + $after)
  Ok "Inserted '</>' before closing paren"
}

Write-Utf8NoBomLines $path $lines
Ok "Patched: $path"

Write-Host ""
Write-Host "VERIFY (shows the wrapped return):" -ForegroundColor Yellow
Write-Host "  Select-String -Path `"$path`" -Pattern `"return\s*\(`", `"<>\`", `"MONSTER_V4_BUILDS_LINK_START`", `"</>\`" -SimpleMatch" -ForegroundColor Yellow
Write-Host ""
Write-Host "NEXT:" -ForegroundColor Yellow
Write-Host "  npm run build" -ForegroundColor Yellow
