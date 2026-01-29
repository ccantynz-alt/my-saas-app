Set-StrictMode -Version Latest
$ErrorActionPreference="Stop"

function Fail($m){ Write-Host "[GUARD FAIL] $m" -ForegroundColor Red; throw $m }
function Ok($m){ Write-Host "[GUARD OK]  $m" -ForegroundColor Green }

# Protected globs (REGEX) — keep this list tight.
# Goal: prevent accidental edits to core foundations unless intentional.
$Protected = @(
  '^src\\middleware\.ts$',
  '^src\\app\\api\\engine\\',          # engine routes
  '^src\\lib\\aleKv\.ts$',             # KV helper
  '^src\\app\\api\\ale\\kv\\',         # ALE KV endpoints
  '^src\\app\\api\\ale\\apply\\',      # apply generator
  '^src\\app\\api\\ale\\patchpack\\',  # patchpack generator
  '^src\\app\\api\\ale\\compile\\'     # compiler
)

# Allow override by setting env var in CI/local:
#   $env:ALLOW_PROTECTED_CHANGES="1"
if ($env:ALLOW_PROTECTED_CHANGES -eq "1") {
  Ok "ALLOW_PROTECTED_CHANGES=1 set — skipping protected path checks."
  exit 0
}

# Determine changed files (prefer git)
$changed = @()
try {
  $changed = (git diff --name-only HEAD --) | Where-Object { $_ -and $_.Trim().Length -gt 0 }
} catch {
  Fail "git not available or diff failed. Run inside a git repo."
}

if (-not $changed -or $changed.Count -eq 0) {
  Ok "No changes detected."
  exit 0
}

# Normalize to Windows-style backslashes for regex matching
$changedNorm = $changed | ForEach-Object { $_.Replace('/','\') }

$blocked = @()
foreach ($f in $changedNorm) {
  foreach ($rx in $Protected) {
    if ($f -match $rx) { $blocked += $f; break }
  }
}

if ($blocked.Count -gt 0) {
  Write-Host ""
  Write-Host "Protected path changes detected:" -ForegroundColor Yellow
  $blocked | Sort-Object -Unique | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
  Write-Host ""
  Write-Host "To allow (intentional changes only), set:" -ForegroundColor Yellow
  Write-Host '  $env:ALLOW_PROTECTED_CHANGES="1"' -ForegroundColor White
  Write-Host "Then re-run your command." -ForegroundColor Yellow
  Write-Host ""
  Fail "Blocked: protected paths modified."
}

Ok "Protected paths check passed."