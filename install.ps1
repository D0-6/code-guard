# Code Guard Installation Script for Windows PowerShell
# This script installs Code Guard into your project

param(
    [Parameter(Mandatory=$true)]
    [string]$TargetDir
)

Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🛡️  CODE GUARD INSTALLER                                    ║" -ForegroundColor Cyan
Write-Host "║  Advanced Team Intelligence & Security System                ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Validate target directory
if (-not (Test-Path $TargetDir)) {
    Write-Host "❌ Error: Directory $TargetDir does not exist" -ForegroundColor Red
    exit 1
}

# Check if it's a git repository
if (-not (Test-Path "$TargetDir\.git")) {
    Write-Host "⚠️  Warning: $TargetDir is not a git repository" -ForegroundColor Yellow
    $response = Read-Host "Continue anyway? (y/n)"
    if ($response -ne 'y' -and $response -ne 'Y') {
        exit 1
    }
}

Write-Host "📂 Installing Code Guard to: $TargetDir" -ForegroundColor Green
Write-Host ""

# Create directories
Write-Host "📁 Creating directory structure..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path "$TargetDir\.bob-team\snapshots" | Out-Null
New-Item -ItemType Directory -Force -Path "$TargetDir\.bob-team\alerts" | Out-Null
New-Item -ItemType Directory -Force -Path "$TargetDir\.bob-team\reports" | Out-Null
New-Item -ItemType Directory -Force -Path "$TargetDir\.bob-team\audit-logs" | Out-Null
New-Item -ItemType Directory -Force -Path "$TargetDir\bob-skills" | Out-Null
New-Item -ItemType Directory -Force -Path "$TargetDir\bob_sessions" | Out-Null

# Copy configuration files
Write-Host "⚙️  Copying configuration files..." -ForegroundColor Cyan
Copy-Item "$ScriptDir\.bob-team\config.json" "$TargetDir\.bob-team\" -Force
Copy-Item "$ScriptDir\.bob-team\security-baseline.json" "$TargetDir\.bob-team\" -Force
Copy-Item "$ScriptDir\.bob-team\quality-rules.json" "$TargetDir\.bob-team\" -Force

# Copy skill files
Write-Host "🎯 Installing skills..." -ForegroundColor Cyan
Copy-Item "$ScriptDir\bob-skills\security-audit.md" "$TargetDir\bob-skills\" -Force
Copy-Item "$ScriptDir\bob-skills\quality-gate.md" "$TargetDir\bob-skills\" -Force
Copy-Item "$ScriptDir\bob-skills\sync.md" "$TargetDir\bob-skills\" -Force
Copy-Item "$ScriptDir\bob-skills\team-intelligence.md" "$TargetDir\bob-skills\" -Force
Copy-Item "$ScriptDir\bob-skills\admin-panel.md" "$TargetDir\bob-skills\" -Force
Copy-Item "$ScriptDir\bob-skills\memory-map.md" "$TargetDir\bob-skills\" -Force
Copy-Item "$ScriptDir\bob-skills\my-stats.md" "$TargetDir\bob-skills\" -Force

# Copy AGENTS.md
Write-Host "📝 Copying AGENTS.md..." -ForegroundColor Cyan
Copy-Item "$ScriptDir\AGENTS.md" "$TargetDir\" -Force

# Copy .gitignore if it doesn't exist
if (-not (Test-Path "$TargetDir\.gitignore")) {
    Write-Host "📄 Creating .gitignore..." -ForegroundColor Cyan
    Copy-Item "$ScriptDir\.gitignore" "$TargetDir\" -Force
} else {
    Write-Host "⚠️  .gitignore already exists, appending Code Guard rules..." -ForegroundColor Yellow
    Get-Content "$ScriptDir\.gitignore" | Add-Content "$TargetDir\.gitignore"
}

# Create .gitkeep files
New-Item -ItemType File -Force -Path "$TargetDir\.bob-team\reports\.gitkeep" | Out-Null
New-Item -ItemType File -Force -Path "$TargetDir\.bob-team\alerts\.gitkeep" | Out-Null
New-Item -ItemType File -Force -Path "$TargetDir\bob_sessions\.gitkeep" | Out-Null

Write-Host ""
Write-Host "✅ Code Guard installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📋 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Configure your team:" -ForegroundColor White
Write-Host "   Edit: $TargetDir\.bob-team\config.json" -ForegroundColor Gray
Write-Host "   Update: project name, repo URL, team members" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Commit the files:" -ForegroundColor White
Write-Host "   cd $TargetDir" -ForegroundColor Gray
Write-Host "   git add .bob-team/ bob-skills/ AGENTS.md .gitignore" -ForegroundColor Gray
Write-Host "   git commit -m 'feat: add Code Guard intelligence system'" -ForegroundColor Gray
Write-Host "   git push" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Open in IBM Bob IDE and run:" -ForegroundColor White
Write-Host "   /sync              - Initialize your data" -ForegroundColor Gray
Write-Host "   /security-audit    - Scan for vulnerabilities" -ForegroundColor Gray
Write-Host "   /quality-gate      - Check code quality" -ForegroundColor Gray
Write-Host "   /my-stats          - View your dashboard" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Share with your team:" -ForegroundColor White
Write-Host "   Team members should pull and run /sync" -ForegroundColor Gray
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "   README: $ScriptDir\README.md" -ForegroundColor Gray
Write-Host "   Testing: $ScriptDir\TESTING_GUIDE.md" -ForegroundColor Gray
Write-Host ""
Write-Host "🎉 Happy coding with Code Guard!" -ForegroundColor Green
Write-Host ""

# Made with Bob
