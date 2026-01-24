$ErrorActionPreference = "Stop"

function Info($m){ Write-Host $m -ForegroundColor Cyan }
function Ok($m){ Write-Host $m -ForegroundColor Green }
function Warn($m){ Write-Host $m -ForegroundColor Yellow }
function Fail($m){ Write-Host "ERROR: $m" -ForegroundColor Red; exit 1 }

function Remove-Utf8BomFile {
  param([Parameter(Mandatory=$true)][string]$Path)

  if (!(Test-Path -LiteralPath $Path)) { return $false }

  $bytes = [System.IO.File]::ReadAllBytes($Path)

  # UTF-8 BOM = EF BB BF
  if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
    $newBytes = $bytes[3..($bytes.Length-1)]
    [System.IO.File]::WriteAllBytes($Path, $newBytes)
    return $true
  }

  return $false
}

Info "== 1) Remove BOM from package.json =="
$changed = Remove-Utf8BomFile -Path ".\package.json"
if ($changed) { Ok "Removed UTF-8 BOM: package.json" } else { Ok "No BOM found: package.json" }

Info "== 2) (Optional safety) Remove BOM from package-lock.json if present =="
if (Test-Path -LiteralPath ".\package-lock.json") {
  $changedLock = Remove-Utf8BomFile -Path ".\package-lock.json"
  if ($changedLock) { Ok "Removed UTF-8 BOM: package-lock.json" } else { Ok "No BOM found: package-lock.json" }
} else {
  Warn "package-lock.json not found (ok)"
}

Info "== 3) Ensure package.json has engines.node = 20.x (without reintroducing BOM) =="

# Read as bytes -> UTF8 string (no BOM) -> JSON
$pkgBytes = [System.IO.File]::ReadAllBytes(".\package.json")
$pkgText  = [System.Text.Encoding]::UTF8.GetString($pkgBytes)

try {
  $pkg = $pkgText | ConvertFrom-Json
} catch {
  Fail "package.json is still not valid JSON after BOM strip. Error: $($_.Exception.Message)"
}

if (-not $pkg.engines) {
  $pkg | Add-Member -NotePropertyName "engines" -NotePropertyValue (@{})
}

$pkg.engines.node = "20.x"

# Write JSON WITHOUT BOM:
$jsonOut = ($pkg | ConvertTo-Json -Depth 50) + "`r`n"
$outBytes = [System.Text.Encoding]::UTF8.GetBytes($jsonOut)
[System.IO.File]::WriteAllBytes(".\package.json", $outBytes)

Ok "Wrote package.json as UTF-8 (no BOM) + engines.node=20.x"

Info "== 4) Commit + push =="
git status --porcelain | Out-String | Write-Host

git add -A
git commit -m "fix(vercel): remove BOM from package.json + lock node 20.x"
git push

Ok "Pushed."
