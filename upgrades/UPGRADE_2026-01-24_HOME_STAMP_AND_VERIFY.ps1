$ErrorActionPreference = "Stop"

function Fail($msg) { Write-Host ""; Write-Host "ERROR: $msg" -ForegroundColor Red; exit 1 }
function Ok($msg) { Write-Host "OK: $msg" -ForegroundColor Green }
function Info($msg) { Write-Host "INFO: $msg" -ForegroundColor Cyan }

if (-not (Test-Path -LiteralPath ".\package.json")) { Fail "Run from repo root (package.json missing)." }

$HomePage = ".\src\app\page.tsx"
if (-not (Test-Path -LiteralPath $HomePage)) { Fail "Missing: $HomePage" }

$stamp = "HOME_STAMP_" + (Get-Date -Format "yyyyMMdd_HHmmss")
Info ("Stamp = " + $stamp)

# Backup
$bak = $HomePage + ".bak_" + $stamp
Copy-Item -LiteralPath $HomePage -Destination $bak -Force
Ok ("Backed up homepage to: " + $bak)

# Insert a very visible stamp near the top of the component output.
# We do NOT assume your component name; we just inject a <div> immediately after the first "<main"
$txt = Get-Content -LiteralPath $HomePage -Raw -Encoding UTF8

if ($txt -notmatch "<main") {
  Fail "Could not find a <main ...> tag in src/app/page.tsx. Paste the first ~40 lines and I'll adapt the patch."
}

$injection = @"
<main
"@

# Replace only the first occurrence of "<main" with "<main" plus a fixed stamp block AFTER the opening tag line.
# We do this by finding the first "<main" and inserting a stamp div right after the first closing ">" of that main tag.
$idx = $txt.IndexOf("<main")
if ($idx -lt 0) { Fail "Could not locate <main> tag index." }

# Find end of main opening tag (the first ">" after "<main")
$gt = $txt.IndexOf(">", $idx)
if ($gt -lt 0) { Fail "Could not find end of <main ...> opening tag." }

$before = $txt.Substring(0, $gt + 1)
$after  = $txt.Substring($gt + 1)

$stampBlock = @"
      {/* === TEMP STAMP (REMOVE LATER) === */}
      <div style={{ position: "fixed", top: 12, left: 12, zIndex: 999999, background: "rgba(0,0,0,0.75)", color: "white", padding: "8px 10px", borderRadius: 12, fontSize: 12, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}>
        <div>LIVE_STAMP_OK</div>
        <div>$stamp</div>
      </div>

"@

$new = $before + "`r`n" + $stampBlock + $after
Set-Content -LiteralPath $HomePage -Encoding UTF8 -Value $new

Ok "Inserted LIVE_STAMP_OK overlay into homepage."

Write-Host ""
Write-Host "NEXT: build + deploy:" -ForegroundColor Yellow
Write-Host "  npm run build" -ForegroundColor Yellow
Write-Host "  vercel --prod --force" -ForegroundColor Yellow
Write-Host ""
Write-Host "THEN: verify from PowerShell (prints markers):" -ForegroundColor Yellow
Write-Host "  powershell -ExecutionPolicy Bypass -Command `"curl.exe -s https://my-saas-app-5eyw.vercel.app/?ts=$([DateTimeOffset]::UtcNow.ToUnixTimeSeconds()) | Select-String -Pattern LIVE_STAMP_OK,$stamp -SimpleMatch`"" -ForegroundColor Yellow
