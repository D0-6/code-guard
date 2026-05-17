# Code Guard - Installation Guide

## 🚀 Quick Install (One Command)

### For Windows (PowerShell)

```powershell
# Navigate to Code Guard directory
cd "D:\Projects\BOB Guard\Code Guard"

# Install to your project
.\install.ps1 -TargetDir "D:\Projects\your-project"
```

### For Linux/Mac (Bash)

```bash
# Navigate to Code Guard directory
cd "/d/Projects/BOB Guard/Code Guard"

# Make installer executable
chmod +x install.sh

# Install to your project
./install.sh /path/to/your/project
```

## 📋 What Gets Installed

The installer will copy these files to your project:

```
your-project/
├── .bob-team/
│   ├── config.json              ← Configure your team here
│   ├── security-baseline.json   ← Security scanning rules
│   ├── quality-rules.json       ← Quality gate rules
│   ├── snapshots/               ← History tracking
│   ├── alerts/                  ← Alert storage
│   ├── reports/                 ← Generated reports
│   └── audit-logs/              ← Compliance logs
│
├── bob-skills/
│   ├── security-audit.md        ← Vulnerability scanner
│   ├── quality-gate.md          ← Quality validation
│   ├── sync.md                  ← Core sync engine
│   ├── team-intelligence.md     ← Team reports
│   ├── admin-panel.md           ← Admin console
│   ├── memory-map.md            ← Visual team map
│   └── my-stats.md              ← Personal dashboard
│
├── bob_sessions/                ← Bob session exports
├── AGENTS.md                    ← Bob context file
└── .gitignore                   ← Git rules (appended if exists)
```

## 🎯 Installation Examples

### Example 1: Install to Existing Project

```powershell
# Windows
.\install.ps1 -TargetDir "D:\Projects\my-app"

# Linux/Mac
./install.sh ~/projects/my-app
```

### Example 2: Install to New Project

```powershell
# Create new project
mkdir "D:\Projects\new-project"
cd "D:\Projects\new-project"
git init

# Install Code Guard
cd "D:\Projects\BOB Guard\Code Guard"
.\install.ps1 -TargetDir "D:\Projects\new-project"
```

### Example 3: Install to Multiple Projects

```powershell
# Install to multiple projects at once
$projects = @(
    "D:\Projects\backend-api",
    "D:\Projects\frontend-app",
    "D:\Projects\mobile-app"
)

foreach ($project in $projects) {
    .\install.ps1 -TargetDir $project
}
```

## ⚙️ Post-Installation Setup

### Step 1: Configure Your Team

Edit `.bob-team/config.json` in your project:

```json
{
  "project": {
    "name": "Your Project Name",
    "repo": "https://github.com/your-org/your-repo"
  },
  "roles": {
    "admins": [
      {
        "username": "your-username",
        "email": "you@company.com",
        "name": "Your Name"
      }
    ]
  }
}
```

**Important:** Make sure the email matches your git config:

```bash
git config user.email
```

### Step 2: Commit to Git

```bash
cd your-project
git add .bob-team/ bob-skills/ AGENTS.md .gitignore
git commit -m "feat: add Code Guard intelligence system"
git push
```

### Step 3: Test Installation

Open your project in IBM Bob IDE and run:

```
/security-audit
```

You should see the security audit skill activate!

### Step 4: Share with Team

Team members should:

1. Pull the latest code: `git pull`
2. Open project in IBM Bob IDE
3. Run `/sync` to initialize their data
4. Run `/my-stats` to see their dashboard

## 🔧 Manual Installation (Alternative)

If you prefer to install manually:

### 1. Copy Files

```bash
# Copy configuration
cp -r "D:/Projects/BOB Guard/Code Guard/.bob-team" your-project/

# Copy skills
cp -r "D:/Projects/BOB Guard/Code Guard/bob-skills" your-project/

# Copy AGENTS.md
cp "D:/Projects/BOB Guard/Code Guard/AGENTS.md" your-project/
```

### 2. Create Directories

```bash
cd your-project
mkdir -p .bob-team/snapshots
mkdir -p .bob-team/alerts
mkdir -p .bob-team/reports
mkdir -p .bob-team/audit-logs
mkdir -p bob_sessions
```

### 3. Update .gitignore

Add these lines to your `.gitignore`:

```
# Code Guard
.bob-team/reports/
.bob-team/alerts/
node_modules/
.env
.env.local
```

## 🧪 Verify Installation

### Check 1: Files Exist

```bash
# Check configuration files
ls .bob-team/config.json
ls .bob-team/security-baseline.json
ls .bob-team/quality-rules.json

# Check skills
ls bob-skills/security-audit.md
ls bob-skills/quality-gate.md
```

### Check 2: JSON Valid

```bash
# Validate JSON files
python -m json.tool .bob-team/config.json
python -m json.tool .bob-team/security-baseline.json
python -m json.tool .bob-team/quality-rules.json
```

All should output formatted JSON without errors.

### Check 3: Bob Recognizes Skills

Open IBM Bob IDE and type `/` - you should see:
- `/security-audit`
- `/quality-gate`
- `/sync`
- `/team-intelligence`
- `/admin-panel`
- `/memory-map`
- `/my-stats`

## 🎓 First Time Usage

### For Admins

1. **Configure team** - Edit `.bob-team/config.json`
2. **Run security audit** - `/security-audit` to scan existing code
3. **Check quality** - `/quality-gate` to validate code quality
4. **View team report** - `/team-intelligence` to see team health
5. **Manage team** - `/admin-panel` for team management

### For Developers

1. **Run sync** - `/sync` after every commit
2. **Check your stats** - `/my-stats` to see your performance
3. **Scan security** - `/security-audit` before committing
4. **Validate quality** - `/quality-gate` before pushing

## 🔄 Updating Code Guard

To update to a newer version:

```bash
# Backup your config
cp .bob-team/config.json .bob-team/config.json.backup

# Re-run installer
cd "D:/Projects/BOB Guard/Code Guard"
.\install.ps1 -TargetDir "D:\Projects\your-project"

# Restore your config if needed
cp .bob-team/config.json.backup .bob-team/config.json
```

## 🗑️ Uninstalling

To remove Code Guard:

```bash
cd your-project

# Remove files
rm -rf .bob-team/
rm -rf bob-skills/
rm AGENTS.md

# Remove from git
git rm -r .bob-team/ bob-skills/ AGENTS.md
git commit -m "chore: remove Code Guard"
```

## 🆘 Troubleshooting

### Issue: "Permission Denied" on Windows

**Solution:**
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: Skills Not Found in Bob IDE

**Solution:**
1. Check AGENTS.md exists in project root
2. Verify bob-skills/ folder exists
3. Restart IBM Bob IDE
4. Check Bob IDE is opened in correct directory

### Issue: Configuration Errors

**Solution:**
```bash
# Validate JSON
python -m json.tool .bob-team/config.json

# Check email matches git config
git config user.email
```

### Issue: Git Not Initialized

**Solution:**
```bash
cd your-project
git init
git config user.name "Your Name"
git config user.email "you@company.com"
```

## 📚 Next Steps

After installation:

1. **Read the docs** - Check `README.md` for full documentation
2. **Test the system** - Follow `TESTING_GUIDE.md`
3. **Customize rules** - Adjust thresholds in config files
4. **Train your team** - Share documentation with team members
5. **Monitor metrics** - Run reports regularly

## 💡 Pro Tips

1. **Start with warnings** - Set all rules to "warning" initially
2. **Progressive enforcement** - Gradually increase strictness
3. **Team buy-in** - Get team agreement on rules
4. **Regular reviews** - Review metrics weekly
5. **Adjust thresholds** - Fine-tune based on your team's needs

## 🎯 Installation Checklist

- [ ] Installer script executed successfully
- [ ] Configuration files copied
- [ ] Skills installed in bob-skills/
- [ ] AGENTS.md in project root
- [ ] .gitignore updated
- [ ] config.json configured with team details
- [ ] Email matches git config
- [ ] Files committed to git
- [ ] Team members notified
- [ ] Skills visible in Bob IDE
- [ ] First security audit run
- [ ] First quality gate check run
- [ ] Documentation shared with team

## 🚀 Ready to Go!

Once installation is complete, you're ready to use Code Guard!

Start with:
```
/security-audit
```

Then explore other skills:
```
/quality-gate
/my-stats
/team-intelligence
```

Happy coding! 🎉