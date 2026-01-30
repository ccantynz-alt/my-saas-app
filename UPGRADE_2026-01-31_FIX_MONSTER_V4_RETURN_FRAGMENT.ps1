# UPGRADE_2026-01-31_FIX_MONSTER_V4_RETURN_FRAGMENT.ps1
# Fix TSX parse error: "Cannot find name 'div'" by wrapping MONSTER_V4 block in a Fragment.
# Targets the actual failing file path from build logs.

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

function Read-Text([string]$Path){
  return [System.IO.File]::ReadAllText($Path, (New-Object System.Text.UTF8Encoding($false)))
}

function Write-Utf8NoBom {
  param([string]$Path,[string]$Content)
  $enc = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Content, $enc)
}

# The file your build is failing on:
$path = "builder-workspace-v1/workspace-ui/src/app/page.tsx"
Backup-IfExists $path

$txt = Read-Text $path

$start = "MONSTER_V4_BUILDS_LINK_START"
$end   = "MONSTER_V4_BUILDS_LINK_END"

if ($txt -notmatch $start) {
  Fail "Marker not found: $start (file: $path)"
}

# If already wrapped (we detect a fragment introduced near the start marker), exit safely
if ($txt -match "(?s)<>\s*\{\s*/\*\s*===\s*MONSTER_V4_BUILDS_LINK_START\s*===\s*\*/\s*\}") {
  Ok "Already wrapped with <>...</> around MONSTER_V4 block. No change needed."
  exit 0
}

if ($txt -match $end) {
  # Replace the START marker line to include opening fragment BEFORE it
  $txt2 = [System.Text.RegularExpressions.Regex]::Replace(
    $txt,
    "(?m)^\s*\{\s*/\*\s*===\s*MONSTER_V4_BUILDS_LINK_START\s*===\s*\*/\s*\}\s*$",
    "      <>`n      {/* === MONSTER_V4_BUILDS_LINK_START === */}",
    1
  )

  # Replace the END marker line to include closing fragment AFTER it
  $txt2 = [System.Text.RegularExpressions.Regex]::Replace(
    $txt2,
    "(?m)^\s*\{\s*/\*\s*===\s*MONSTER_V4_BUILDS_LINK_END\s*===\s*\*/\s*\}\s*$",
    "      {/* === MONSTER_V4_BUILDS_LINK_END === */}`n      </>",
    1
  )

  Write-Utf8NoBom $path $txt2
  Ok "Patched MONSTER_V4 block using START/END markers in: $path"
} else {
  # No END marker; fallback: insert <> before the START marker, and </> before the next closing paren of the return block.
  $idx = $txt.IndexOf($start)
  if ($idx -lt 0) { Fail "Start index not found (unexpected)." }

  # Insert opening fragment before the START marker line
  $txt2 = [System.Text.RegularExpressions.Regex]::Replace(
    $txt,
    "(?m)^\s*\{\s*/\*\s*===\s*MONSTER_V4_BUILDS_LINK_START\s*===\s*\*/\s*\}\s*$",
    "      <>`n      {/* === MONSTER_V4_BUILDS_LINK_START === */}",
    1
  )

  # Now insert closing </> before the first line that looks like a return close: ')', ');', etc AFTER the start marker
  $posAfter = $txt2.IndexOf($start)
  $tail = $txt2.Substring($posAfter)

  $m = [System.Text.RegularExpressions.Regex]::Match($tail, "(?m)^\s*\)\s*;?\s*$")
  if (-not $m.Success) {
    Fail "Could not find a closing ')' line after the MONSTER_V4 start marker to place </>. Manual review required."
  }

  $insertAt = $posAfter + $m.Index
  $txt2 = $txt2.Insert($insertAt, "      </>`n")

  Write-Utf8NoBom $path $txt2
  Ok "Patched MONSTER_V4 block using fallback close-paren insertion in: $path"
}

Ok "NEXT: npm run build"
