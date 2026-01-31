Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Banner($t) { Write-Host ("`n=== " + $t + " ===") -ForegroundColor Yellow }
function Ok($t)     { Write-Host ("OK  " + $t) -ForegroundColor Green }
function Fail($t)   { Write-Host ("FAIL " + $t) -ForegroundColor Red; throw $t }

function MustTool($name) {
  if (-not (Get-Command $name -ErrorAction SilentlyContinue)) { Fail "Missing tool on PATH: $name" }
  Ok "Tool present: $name"
}

function MustPath($p, $label) {
  if (-not (Test-Path -LiteralPath $p)) { Fail "Missing $label at $p" }
  Ok "Found: $label"
}

function CurlHead($url) {
  $out = curl.exe -s -D - --max-time 20 -H "cache-control: no-cache" -H "pragma: no-cache" $url
  return $out
}

# ---- CONFIG ----
$PROD_BASE = "https://www.dominat8.com"
$PROOF_PATH = "/"   # change if your homepage route differs
$LOOP_SECONDS = 20  # how often to re-check after deploy

# ---- PRECHECKS ----
Banner "PRECHECKS"
MustTool git
MustTool node
MustTool npm
MustTool vercel

MustPath ".\package.json" "package.json"
MustPath ".\src\app" "src\app"

# show repo identity
$branch = (git branch --show-current).Trim()
Ok ("Branch: " + $branch)

$remote = (git remote -v | Out-String).Trim()
if ($remote -notmatch "origin") { Fail "No git origin remote. Automation can't run remotely." }
Ok "Git origin remote present"

# show vercel linkage
if (-not (Test-Path -LiteralPath ".\.vercel\project.json")) { Fail "Missing .vercel\project.json (repo not linked to Vercel)" }
$pj = Get-Content -LiteralPath ".\.vercel\project.json" -Raw
Ok (".vercel\project.json: " + $pj.Replace("`r","").Replace("`n",""))

# ---- LIVE DEPLOY (VISIBLE) ----
Banner "DEPLOY (LIVE LOGS ON SCREEN)"
Ok "Running: vercel --prod --force"
# This shows live output directly in the console
vercel --prod --force

# ---- PROOF CHECK (VISIBLE) ----
Banner "PROOF CHECK"
$ts = [int](Get-Date -UFormat %s)
$url = "$PROD_BASE$PROOF_PATH" + "?ts=$ts"
Ok ("GET " + $url)

$head = CurlHead $url

# Show top lines so you can SEE it
$lines = $head -split "`n"
$lines | Select-Object -First 30 | ForEach-Object { $_.TrimEnd("`r") }

if ($head -match "HTTP/1\.1 200" -or $head -match "HTTP/2 200") {
  Ok "HTTP 200 OK"
} else {
  Fail "Not 200. Homepage still not serving."
}

if ($head -match "X-Matched-Path:\s*/404") {
  Fail "Matched /404 (still wrong project/domain)"
} else {
  Ok "Not matched to /404"
}

# ---- WATCH MODE ----
Banner "WATCH MODE (press Ctrl+C to stop)"
Ok ("Re-checking " + $PROD_BASE + " every " + $LOOP_SECONDS + "s so you can watch it stay alive.")

while ($true) {
  Start-Sleep -Seconds $LOOP_SECONDS
  $ts2 = [int](Get-Date -UFormat %s)
  $u2 = "$PROD_BASE$PROOF_PATH" + "?ts=$ts2"

  Write-Host ""
  Write-Host ("[" + (Get-Date -Format "HH:mm:ss") + "] " + $u2) -ForegroundColor Cyan

  try {
    $h2 = CurlHead $u2
    if ($h2 -match "HTTP/1\.1 200" -or $h2 -match "HTTP/2 200") {
      Write-Host "200 OK" -ForegroundColor Green
    } else {
      Write-Host "NOT 200" -ForegroundColor Red
    }
    if ($h2 -match "X-Matched-Path:\s*/404") {
      Write-Host "BAD: /404" -ForegroundColor Red
    }
  } catch {
    Write-Host ("ERROR: " + $_.Exception.Message) -ForegroundColor Red
  }
}