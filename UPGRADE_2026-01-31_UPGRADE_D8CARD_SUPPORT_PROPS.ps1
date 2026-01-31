# UPGRADE_2026-01-31_UPGRADE_D8CARD_SUPPORT_PROPS.ps1
# Upgrades the real D8Card component to support both:
#   1) children-based usage: <D8Card>...</D8Card>
#   2) props-based usage: <D8Card title=".." body=".." kicker=".." />
#
# This fixes compile errors on marketing pages (pricing/privacy/etc) without editing each page.

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Ok($m){ Write-Host "[OK]  $m" -ForegroundColor Green }
function Warn($m){ Write-Host "[WARN] $m" -ForegroundColor Yellow }
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

# Find the D8Card definition under src/**. We will pick the file that actually exports D8Card.
$files = Get-ChildItem -Path "src" -Recurse -File -Include *.ts,*.tsx | Select-Object -ExpandProperty FullName

$candidates = @()
foreach ($f in $files) {
  $txt = Get-Content -LiteralPath $f -Raw
  if ($txt -match 'export\s+function\s+D8Card' -or $txt -match 'export\s+const\s+D8Card') {
    $candidates += $f
  }
}

if ($candidates.Count -eq 0) {
  Fail "Could not find an exported D8Card under src/. Paste the import line for D8Card from privacy/page.tsx and I will target the correct file."
}

# Prefer a likely UI location if multiple matches exist
$target = $candidates | Where-Object { $_ -match '\\src\\ui\\' } | Select-Object -First 1
if (-not $target) { $target = $candidates | Select-Object -First 1 }

Ok "Targeting D8Card file: $target"
Backup $target

$src = Get-Content -LiteralPath $target -Raw

# If D8Card already mentions title/body/kicker, do nothing
if ($src -match 'kicker' -and $src -match 'title' -and $src -match 'body') {
  Warn "D8Card already appears to support props in this file. No changes made."
  Write-Host ""
  Write-Host "NEXT: npm run build" -ForegroundColor Yellow
  exit 0
}

# Replace the D8Card export with a compatible implementation.
# We match the first exported D8Card function block and replace it entirely.
$pattern = '(?s)export\s+function\s+D8Card\s*\([^)]*\)\s*\{.*?\n\}'
$replacement = @"
export type D8CardProps = React.PropsWithChildren<{
  kicker?: string;
  title?: string;
  body?: string;
}>;

export function D8Card({ kicker, title, body, children }: D8CardProps) {
  const hasProps = Boolean(kicker || title || body);

  return (
    <div
      style={{
        padding: 18,
        borderRadius: 20,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 14px 48px rgba(0,0,0,0.30)',
      }}
    >
      {hasProps ? (
        <>
          {kicker ? (
            <div
              style={{
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: '.12em',
                opacity: 0.75,
                textTransform: 'uppercase',
              }}
            >
              {kicker}
            </div>
          ) : null}

          {title ? (
            <div style={{ marginTop: kicker ? 6 : 0, fontSize: 16, fontWeight: 950, letterSpacing: '-0.02em' }}>
              {title}
            </div>
          ) : null}

          {body ? (
            <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.6, opacity: 0.78 }}>
              {body}
            </div>
          ) : null}
        </>
      ) : (
        children
      )}
    </div>
  );
}
"@

$src2 = [System.Text.RegularExpressions.Regex]::Replace($src, $pattern, $replacement, 1)

# If the pattern didn't match, try replacing an exported const component instead.
if ($src2 -eq $src) {
  $pattern2 = '(?s)export\s+const\s+D8Card\s*=\s*\([^)]*\)\s*=>\s*\{.*?\n\};'
  $src2 = [System.Text.RegularExpressions.Regex]::Replace($src, $pattern2, $replacement, 1)
}

if ($src2 -eq $src) {
  Fail "Could not auto-replace D8Card in the target file. Paste the D8Card definition block and I will generate an exact replacement."
}

# Ensure React import exists
if ($src2 -notmatch 'import\s+React') {
  # Add React import at top if missing
  $src2 = "import React from 'react';`n" + $src2
}

WriteNoBom $target $src2
Ok "Upgraded D8Card to support props + children (non-breaking)"

Write-Host ""
Write-Host "NEXT:" -ForegroundColor Yellow
Write-Host "  npm run build" -ForegroundColor Yellow
Write-Host "  git add -A" -ForegroundColor Yellow
Write-Host "  git commit -m ""feat(ui): upgrade D8Card to support title/body/kicker props""" -ForegroundColor Yellow
Write-Host "  git push" -ForegroundColor Yellow
"@

# Note: the above string ended early if not careful; ensure finalization
WriteNoBom $target $src2
Ok "Wrote upgraded D8Card implementation"

Write-Host ""
Write-Host "NEXT:" -ForegroundColor Yellow
Write-Host "  npm run build" -ForegroundColor Yellow
Write-Host "  git add -A" -ForegroundColor Yellow
Write-Host "  git commit -m ""feat(ui): upgrade D8Card to support title/body/kicker props""" -ForegroundColor Yellow
Write-Host "  git push" -ForegroundColor Yellow
