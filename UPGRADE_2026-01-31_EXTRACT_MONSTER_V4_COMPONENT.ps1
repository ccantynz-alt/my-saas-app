# UPGRADE_2026-01-31_EXTRACT_MONSTER_V4_COMPONENT.ps1
# Extracts MONSTER_V4 into a real React component and cleans page.tsx

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Ok($m){ Write-Host "[OK]  $m" -ForegroundColor Green }
function Fail($m){ Write-Host "[FAIL] $m" -ForegroundColor Red; throw $m }

function Backup($p){
  if (!(Test-Path $p)) { Fail "Missing file: $p" }
  $bak = "$p.bak_$(Get-Date -Format yyyyMMdd_HHmmss)"
  Copy-Item $p $bak
  Ok "Backup: $bak"
}

function WriteNoBom($p,$c){
  $dir = Split-Path -Parent $p
  if ($dir -and !(Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
  }
  [IO.File]::WriteAllText($p,$c,(New-Object Text.UTF8Encoding $false))
}

# Paths
$page = "builder-workspace-v1/workspace-ui/src/app/page.tsx"
$component = "builder-workspace-v1/workspace-ui/src/components/MonsterV4BuildLink.tsx"

Backup $page

# --- 1) Write the new component ---
$monsterComponent = @"
'use client';

import React from 'react';

export function MonsterV4BuildLink() {
  const projectId =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('projectId') || '22848'
      : '22848';

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontWeight: 800, marginBottom: 6 }}>MONSTER v4</div>

      <div style={{ opacity: 0.85, fontSize: 13, marginBottom: 10 }}>
        Open build history + live preview for a project:
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <a href={`/projects/${projectId}/builds`}>
          <button
            style={{
              padding: '10px 14px',
              borderRadius: 10,
              border: '1px solid rgba(0,0,0,0.15)',
              background: 'white',
              fontWeight: 900,
            }}
          >
            Open Builds (projectId from URL or 22848)
          </button>
        </a>
      </div>
    </div>
  );
}
"@

WriteNoBom $component $monsterComponent
Ok "Created component: $component"

# --- 2) Clean page.tsx ---
$src = Get-Content $page -Raw

# Remove any MONSTER blocks entirely
$src = $src -replace '(?s)\{\s*/\*\s*===\s*MONSTER_V4_BUILDS_LINK_START\s*===\s*\*/\s*\}.*?\{\s*/\*\s*===\s*MONSTER_V4_BUILDS_LINK_END\s*===\s*\*/\s*\}', ''

# Ensure component import
if ($src -notmatch 'MonsterV4BuildLink') {
  $src = $src -replace '(?m)^import React.*?;','${0}' + "`nimport { MonsterV4BuildLink } from '../components/MonsterV4BuildLink';"
}

# Ensure render return is wrapped
if ($src -notmatch 'return\s*\(\s*<>') {
  $src = $src -replace 'return\s*\(', "return (\n<>"
  $src = $src -replace '\n\);\s*$', "\n</>\n);"
}

# Insert component above <main>
$src = $src -replace '(?s)(<main[^>]*>)', "<MonsterV4BuildLink />`n$1"

WriteNoBom $page $src
Ok "Updated page.tsx to use MonsterV4BuildLink"

Write-Host ""
Write-Host "NEXT:" -ForegroundColor Yellow
Write-Host "  npm run build" -ForegroundColor Yellow
