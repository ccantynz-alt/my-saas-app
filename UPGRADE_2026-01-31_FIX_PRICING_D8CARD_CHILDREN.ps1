# UPGRADE_2026-01-31_FIX_PRICING_D8CARD_CHILDREN.ps1
# Fixes Dominat8 pricing page compile error by converting D8Card usage
# from props (title/body/kicker) to children-only form.

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Ok($m){ Write-Host "[OK]  $m" -ForegroundColor Green }
function Fail($m){ Write-Host "[FAIL] $m" -ForegroundColor Red; throw $m }

function Backup($p){
  if (!(Test-Path -LiteralPath $p)) { Fail "Missing file: $p" }
  $bak = "$p.bak_$(Get-Date -Format yyyyMMdd_HHmmss)"
  Copy-Item -LiteralPath $p -Destination $bak -Force
  Ok "Backup: $bak"
}

function WriteNoBom($p,$c){
  [IO.File]::WriteAllText($p,$c,(New-Object Text.UTF8Encoding $false))
}

$path = "src/app/(marketing)/pricing/page.tsx"
Backup $path

$src = Get-Content -LiteralPath $path -Raw

# Replace any self-closing <D8Card title=".." body=".." kicker=".." />
# with a children-based card that preserves the same content.
$pattern = '<D8Card\s+title="([^"]+)"\s+body="([^"]+)"\s+kicker="([^"]+)"\s*\/>'
$src2 = [System.Text.RegularExpressions.Regex]::Replace(
  $src,
  $pattern,
@'
<D8Card>
  <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: ".12em", opacity: 0.75, textTransform: "uppercase" }}>$3</div>
  <div style={{ marginTop: 6, fontSize: 16, fontWeight: 950, letterSpacing: "-0.02em" }}>$1</div>
  <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.6, opacity: 0.78 }}>$2</div>
</D8Card>
'@.Trim(),
  [System.Text.RegularExpressions.RegexOptions]::None
)

if ($src2 -eq $src) {
  Fail "No D8Card title/body/kicker patterns found to replace. Paste the relevant block from pricing/page.tsx and I’ll generate an exact patch."
}

WriteNoBom $path $src2
Ok "Converted D8Card props usage to children-based usage in: $path"

Write-Host ""
Write-Host "NEXT:" -ForegroundColor Yellow
Write-Host "  npm run build" -ForegroundColor Yellow
Write-Host "  git add -A" -ForegroundColor Yellow
Write-Host "  git commit -m ""fix(pricing): use D8Card children API (remove title/body/kicker props)""" -ForegroundColor Yellow
Write-Host "  git push" -ForegroundColor Yellow
