'use strict';
/**
 * enforce-webpack.cjs
 * Patches node_modules/.bin/next, next.ps1 and next.cmd so that
 * ANY invocation of `next dev` — from any terminal or tool —
 * automatically adds --webpack, preventing Turbopack panics.
 *
 * Runs automatically via `postinstall` after every `npm install`.
 */
const fs   = require('fs');
const path = require('path');

const BIN      = path.resolve(__dirname, '..', 'node_modules', '.bin');
const NEXT_SH  = path.join(BIN, 'next');        // bash/sh/Git Bash
const NEXT_CMD = path.join(BIN, 'next.cmd');    // Windows CMD
const NEXT_PS1 = path.join(BIN, 'next.ps1');   // PowerShell

// ── PowerShell wrapper (VS Code default terminal on Windows) ─────────────────
const ps1 = `#!/usr/bin/env pwsh
$basedir=Split-Path $MyInvocation.MyCommand.Definition -Parent

$exe=""
if ($PSVersionTable.PSVersion -lt "6.0" -or $IsWindows) {
  $exe=".exe"
}

# Force --webpack when running \`next dev\` without an explicit bundler flag
$allArgs = $args
if ($args[0] -eq "dev") {
  $hasFlag = ($args -contains "--webpack") -or ($args -contains "--turbopack")
  if (-not $hasFlag) {
    Write-Host "[portfolio] Forcing --webpack - Turbopack is disabled for this project" -ForegroundColor Yellow
    $allArgs = $args + "--webpack"
  }
}

$ret=0
if (Test-Path "$basedir/node$exe") {
  & "$basedir/node$exe" "$basedir/../next/dist/bin/next" $allArgs
  $ret=$LASTEXITCODE
} else {
  & "node$exe" "$basedir/../next/dist/bin/next" $allArgs
  $ret=$LASTEXITCODE
}
exit $ret
`;

// ── CMD wrapper (Windows Command Prompt) ─────────────────────────────────────
// CMD doesn't easily check args, so we unconditionally append --webpack when
// "dev" is the first argument. The next binary ignores duplicate --webpack.
const cmd = `@ECHO off
GOTO start
:find_dp0
SET dp0=%~dp0
EXIT /b
:start
SETLOCAL
CALL :find_dp0

SET "NEXTARGS=%*"
IF /I "%1"=="dev" (
  ECHO %* | FINDSTR /I /C:"--webpack" /C:"--turbopack" >NUL 2>&1
  IF ERRORLEVEL 1 (
    ECHO [portfolio] Forcing --webpack - Turbopack is disabled for this project
    SET "NEXTARGS=%* --webpack"
  )
)

IF EXIST "%dp0%\\node.exe" (
  "%dp0%\\node.exe"  "%dp0%\\..\\next\\dist\\bin\\next" %NEXTARGS%
) ELSE (
  node  "%dp0%\\..\\next\\dist\\bin\\next" %NEXTARGS%
)
ENDLOCAL
EXIT /b %ERRORLEVEL%
`;

let patched = 0;

function patch(file, content, label) {
  try {
    fs.writeFileSync(file, content, { encoding: 'utf8' });
    console.log('\u2705 Patched', label);
    patched++;
  } catch (e) {
    console.warn('\u26a0\ufe0f  Could not patch', label, '-', e.message);
  }
}

// ── Bash/sh wrapper (Git Bash / MSYS2 / WSL) ─────────────────────────────────
const sh = `#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\\\,/,g')")

case \`uname\` in
    *CYGWIN*|*MINGW*|*MSYS*)
        basedir=\`cygpath -w "$basedir"\`;;
esac

# Force --webpack for \`next dev\` if no bundler flag is set
ARGS="$@"
if [ "$1" = "dev" ]; then
  case "$ARGS" in
    *--webpack*|*--turbopack*) ;;
    *) echo "[portfolio] Forcing --webpack - Turbopack is disabled for this project"
       ARGS="$ARGS --webpack" ;;
  esac
fi

if [ -x "$basedir/node" ]; then
  exec "$basedir/node" "$basedir/../next/dist/bin/next" $ARGS
else
  exec node "$basedir/../next/dist/bin/next" $ARGS
fi
`;

if (fs.existsSync(NEXT_SH))  patch(NEXT_SH,  sh,  'node_modules/.bin/next (bash/sh)');
if (fs.existsSync(NEXT_PS1)) patch(NEXT_PS1, ps1, 'node_modules/.bin/next.ps1 (PowerShell)');
if (fs.existsSync(NEXT_CMD)) patch(NEXT_CMD, cmd, 'node_modules/.bin/next.cmd (CMD)');

if (patched > 0) {
  console.log('\n\uD83D\uDD12 `next dev` will now always use --webpack in this project.\n');
} else {
  console.warn('\u26a0\ufe0f  No next binary wrappers found to patch. Run npm install first.\n');
}
