#!/bin/bash

# Code Guard Installation Script
# This script installs Code Guard into your project

set -e

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  🛡️  CODE GUARD INSTALLER                                    ║"
echo "║  Advanced Team Intelligence & Security System                ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Get target directory
if [ -z "$1" ]; then
    echo "Usage: ./install.sh /path/to/your/project"
    echo ""
    echo "Example:"
    echo "  ./install.sh ~/projects/my-app"
    echo "  ./install.sh /d/Projects/my-project"
    echo ""
    exit 1
fi

TARGET_DIR="$1"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Validate target directory
if [ ! -d "$TARGET_DIR" ]; then
    echo "❌ Error: Directory $TARGET_DIR does not exist"
    exit 1
fi

# Check if it's a git repository
if [ ! -d "$TARGET_DIR/.git" ]; then
    echo "⚠️  Warning: $TARGET_DIR is not a git repository"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "📂 Installing Code Guard to: $TARGET_DIR"
echo ""

# Create directories
echo "📁 Creating directory structure..."
mkdir -p "$TARGET_DIR/.bob-team/snapshots"
mkdir -p "$TARGET_DIR/.bob-team/alerts"
mkdir -p "$TARGET_DIR/.bob-team/reports"
mkdir -p "$TARGET_DIR/.bob-team/audit-logs"
mkdir -p "$TARGET_DIR/bob-skills"
mkdir -p "$TARGET_DIR/bob_sessions"

# Copy configuration files
echo "⚙️  Copying configuration files..."
cp "$SCRIPT_DIR/.bob-team/config.json" "$TARGET_DIR/.bob-team/"
cp "$SCRIPT_DIR/.bob-team/security-baseline.json" "$TARGET_DIR/.bob-team/"
cp "$SCRIPT_DIR/.bob-team/quality-rules.json" "$TARGET_DIR/.bob-team/"

# Copy skill files
echo "🎯 Installing skills..."
cp "$SCRIPT_DIR/bob-skills/security-audit.md" "$TARGET_DIR/bob-skills/"
cp "$SCRIPT_DIR/bob-skills/quality-gate.md" "$TARGET_DIR/bob-skills/"
cp "$SCRIPT_DIR/bob-skills/sync.md" "$TARGET_DIR/bob-skills/"
cp "$SCRIPT_DIR/bob-skills/team-intelligence.md" "$TARGET_DIR/bob-skills/"
cp "$SCRIPT_DIR/bob-skills/admin-panel.md" "$TARGET_DIR/bob-skills/"
cp "$SCRIPT_DIR/bob-skills/memory-map.md" "$TARGET_DIR/bob-skills/"
cp "$SCRIPT_DIR/bob-skills/my-stats.md" "$TARGET_DIR/bob-skills/"

# Copy AGENTS.md
echo "📝 Copying AGENTS.md..."
cp "$SCRIPT_DIR/AGENTS.md" "$TARGET_DIR/"

# Copy .gitignore if it doesn't exist
if [ ! -f "$TARGET_DIR/.gitignore" ]; then
    echo "📄 Creating .gitignore..."
    cp "$SCRIPT_DIR/.gitignore" "$TARGET_DIR/"
else
    echo "⚠️  .gitignore already exists, appending Code Guard rules..."
    cat "$SCRIPT_DIR/.gitignore" >> "$TARGET_DIR/.gitignore"
fi

# Create .gitkeep files
touch "$TARGET_DIR/.bob-team/reports/.gitkeep"
touch "$TARGET_DIR/.bob-team/alerts/.gitkeep"
touch "$TARGET_DIR/bob_sessions/.gitkeep"

echo ""
echo "✅ Code Guard installed successfully!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 NEXT STEPS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Configure your team:"
echo "   Edit: $TARGET_DIR/.bob-team/config.json"
echo "   Update: project name, repo URL, team members"
echo ""
echo "2. Commit the files:"
echo "   cd $TARGET_DIR"
echo "   git add .bob-team/ bob-skills/ AGENTS.md .gitignore"
echo "   git commit -m 'feat: add Code Guard intelligence system'"
echo "   git push"
echo ""
echo "3. Open in IBM Bob IDE and run:"
echo "   /sync              - Initialize your data"
echo "   /security-audit    - Scan for vulnerabilities"
echo "   /quality-gate      - Check code quality"
echo "   /my-stats          - View your dashboard"
echo ""
echo "4. Share with your team:"
echo "   Team members should pull and run /sync"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 Documentation:"
echo "   README: $SCRIPT_DIR/README.md"
echo "   Testing: $SCRIPT_DIR/TESTING_GUIDE.md"
echo ""
echo "🎉 Happy coding with Code Guard!"
echo ""

# Made with Bob
