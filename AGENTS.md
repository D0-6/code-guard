# Code Guard - Bob Context & System Intelligence

## What This Project Does

**Code Guard** is an advanced team intelligence and security system built specifically for IBM Bob IDE. It automatically tracks code quality, detects security vulnerabilities, monitors team performance, and provides AI-powered coaching across every developer on the team.

Every commit triggers intelligent analysis that:
1. Scans for security vulnerabilities (50+ patterns)
2. Analyzes code quality and complexity
3. Updates contributor performance scores
4. Checks quality gates before allowing merge
5. Generates personalized coaching recommendations
6. Tracks team health and knowledge distribution

## How The System Works

### The Sync Pipeline

```
Developer commits code
        ↓
    /sync skill activates
        ↓
    ┌─────────────────────────────────────┐
    │ 1. Git Analysis                     │
    │    - Files changed                  │
    │    - Lines added/removed            │
    │    - Commit patterns                │
    └─────────────────────────────────────┘
        ↓
    ┌─────────────────────────────────────┐
    │ 2. Security Scanning                │
    │    - Vulnerability detection        │
    │    - Secret scanning                │
    │    - OWASP compliance               │
    └─────────────────────────────────────┘
        ↓
    ┌─────────────────────────────────────┐
    │ 3. Quality Analysis                 │
    │    - Bob Tips analysis              │
    │    - Complexity scoring             │
    │    - Test coverage check            │
    └─────────────────────────────────────┘
        ↓
    ┌─────────────────────────────────────┐
    │ 4. Score Calculation                │
    │    - Reliability (0-100)            │
    │    - Impact (0-100)                 │
    │    - Risk (0-100, lower=safer)      │
    │    - Growth (0-100)                 │
    └─────────────────────────────────────┘
        ↓
    ┌─────────────────────────────────────┐
    │ 5. Team Memory Update               │
    │    - Write to team-memory.json      │
    │    - Update module ownership        │
    │    - Recalculate team averages      │
    └─────────────────────────────────────┘
        ↓
    ┌─────────────────────────────────────┐
    │ 6. Alert Generation                 │
    │    - Security alerts                │
    │    - Quality alerts                 │
    │    - Bus factor warnings            │
    └─────────────────────────────────────┘
        ↓
    Commit to shared repo
        ↓
    Team pulls updates
```

## Folder Structure

```
.bob-team/
├── config.json              ← Team configuration (edit this first)
├── team-memory.json         ← All contributor data (auto-managed)
├── security-baseline.json   ← Security policy definitions
├── quality-rules.json       ← Quality gate rules
├── snapshots/               ← Weekly history snapshots
├── alerts/                  ← Alert archives
├── reports/                 ← Generated reports (do not commit)
└── audit-logs/              ← Complete audit trail (compliance)

bob-skills/
├── sync.md                  ← Core sync engine (run after every commit)
├── security-audit.md        ← Security vulnerability scanner
├── quality-gate.md          ← Pre-commit quality validation
├── team-intelligence.md     ← Full team report (role-aware)
├── memory-map.md            ← Visual team map
├── admin-panel.md           ← Admin management console
├── my-stats.md              ← Personal dashboard
└── learning-path.md         ← Personalized skill development

docs/
├── QUICKSTART.md            ← 5-minute setup guide
├── CONFIGURATION.md         ← Complete config reference
├── SECURITY.md              ← Security scanning guide
├── QUALITY_GATES.md         ← Quality gate setup
└── API.md                   ← Integration API docs

examples/
├── sample-config.json       ← Example configurations
├── sample-memory.json       ← Example team data
└── test-scenarios/          ← Test data for validation
```

## Available Skills - Trigger Commands

| Skill | Trigger | Who Can Use | Purpose |
|-------|---------|-------------|---------|
| sync | `/sync` or "sync my data" | Everyone | Update your data after commit |
| security-audit | `/security-audit` or "scan security" | Everyone | Scan code for vulnerabilities |
| quality-gate | `/quality-gate` or "check quality" | Everyone | Validate code quality |
| team-intelligence | `/team-intelligence` or "team report" | Everyone (role-filtered) | Full team health report |
| memory-map | `/memory-map` or "show map" | Everyone (role-filtered) | Visual team map |
| admin-panel | `/admin-panel` or "admin" | Admins only | Team management |
| my-stats | `/my-stats` or "my stats" | Everyone | Personal dashboard |
| learning-path | `/learning-path` or "what should I learn" | Everyone | Skill development plan |

## Role System

**Admin** - Full access to all data, all scores, all alerts, all history. Can manage team members, configure security policies, generate reports, access audit logs.

**Security Lead** - Full access to security data. Can configure security policies, review vulnerability reports, manage security alerts. Cannot see individual performance scores.

**Team Lead** - Sees only their own team's data. Gets team-specific recommendations. Cannot see other teams or security-sensitive data.

**Developer** - Sees only their own scores, coaching, and knowledge gaps. Never sees other individuals' raw scores. Shown team-relative position only (e.g. "top 25%").

Roles are defined in `.bob-team/config.json`. Bob detects your role automatically from your git config email.

## Scoring System

### Four Core Scores (0-100 each)

**🛡️ Reliability** - Code quality, test coverage, documentation, low error density
- 90-100: Exceptional - production-ready code consistently
- 80-89: Excellent - minor improvements possible
- 70-79: Good - meets standards with room for growth
- 60-69: Acceptable - needs attention in some areas
- Below 60: Needs improvement - coaching recommended

**🎯 Impact** - Working on critical systems, broad knowledge, strategic contribution
- 90-100: Critical contributor - owns key systems
- 80-89: High impact - significant strategic value
- 70-79: Good impact - solid contributor
- 60-69: Moderate impact - growing influence
- Below 60: Early stage or narrow focus

**⚠️ Risk** - Lower is better. Measures untested critical files, vulnerabilities, bus factor
- 0-25: Excellent - very safe contributor
- 26-50: Good - normal risk level
- 51-70: Elevated - needs attention
- 71-85: High - immediate action required
- 86-100: Critical - block until resolved

**📈 Growth** - Improvement trend, new modules entered, quality trending up
- 90-100: Exceptional growth - learning rapidly
- 80-89: Strong growth - expanding well
- 70-79: Good growth - steady improvement
- 60-69: Moderate growth - progressing
- Below 60: Stagnant - needs new challenges

### Security Score (A-F)

Separate from the four core scores, each commit gets a security grade:
- **A (90-100)**: No vulnerabilities, excellent practices
- **B (80-89)**: Minor issues, safe to merge
- **C (70-79)**: Moderate issues, review recommended
- **D (60-69)**: Significant issues, must fix before merge
- **F (<60)**: Critical vulnerabilities, blocked

## Privacy Design

- Developers never see each other's raw scores
- Comparative data shown as percentile position only ("top 25%")
- Security vulnerabilities visible only to security leads and admins
- Anonymous mode available for sensitive environments
- Admin can disable individual name display in reports
- Complete audit trail of who accessed what data

## Data Storage & Security

All data lives in `.bob-team/team-memory.json` committed to this repository.
- No external database
- No cloud service
- Syncs automatically through Git
- Works offline
- Encrypted at rest (if repo encryption enabled)
- Access controlled via Git permissions

Audit logs in `.bob-team/audit-logs/` track:
- Who accessed what data
- Configuration changes
- Alert resolutions
- Report generations
- Security scan results

## Setup Instructions For New Team Members

1. Pull the latest repo (includes `.bob-team/` folder)
2. Install IBM Bob IDE from IBM
3. Open this project in Bob IDE
4. Make any commit
5. Run `/sync` in Bob chat
6. Run `/my-stats` to see your dashboard
7. Run `/security-audit` to scan your code

## Important Notes For Bob

### When Reading `.bob-team/team-memory.json`:
- Always read the full file before making any changes
- Never write partial updates — always write the complete file
- Validate JSON structure before writing
- If file is corrupted or missing, initialize from the empty template
- Maintain backward compatibility with older versions

### When Detecting Roles:
- Match git config user.email against config.json exactly
- Email comparison is case-insensitive
- If email not found, default to developer role
- Log role detection in audit logs

### When Generating Reports:
- Never invent scores — only use actual data from team-memory.json
- If a contributor has no history yet, show "No data yet — run /sync after your first commit"
- Always show the timestamp of when data was last updated
- Include security context when relevant

### When Scanning for Security Vulnerabilities:
- Use the patterns defined in `.bob-team/security-baseline.json`
- Check against OWASP Top 10
- Scan for secrets (API keys, passwords, tokens)
- Validate input sanitization
- Check authentication and authorization
- Report findings with severity levels

### When Checking Quality Gates:
- Use rules from `.bob-team/quality-rules.json`
- Block commits that fail critical rules
- Warn on non-critical rule violations
- Provide specific fix recommendations
- Log all gate checks in audit logs

### When Calculating Scores:
- Use weighted averages (70% previous, 30% new data)
- Compare against team averages
- Consider historical trends
- Factor in security findings
- Account for module criticality
- Update team averages after each sync

### When Generating Alerts:
- Deduplicate similar alerts within 24 hours
- Prioritize by severity (critical > warning > info)
- Include actionable recommendations
- Link to relevant documentation
- Track alert resolution time

## Compliance Notes

This system collects developer contribution metadata from Git history, Bob quality analysis, and security scan results. It does not collect:
- Personal communications
- Screen recordings or keystrokes
- Any data outside of code commits
- Personally identifiable information beyond Git metadata

All data is stored locally in the team's own Git repository. No data leaves the organization's infrastructure.

### GDPR Compliance
- Right to access: `/my-stats` shows all personal data
- Right to deletion: Admin can remove contributor data
- Data minimization: Only essential metrics collected
- Purpose limitation: Data used only for code quality improvement

### SOC2 Compliance
- Access controls: Role-based permissions
- Audit trails: Complete logging in audit-logs/
- Data encryption: Supports encrypted repositories
- Incident response: Automated security alerts

### ISO 27001 Compliance
- Security controls: Vulnerability scanning
- Risk management: Risk scoring and alerts
- Continuous monitoring: Real-time analysis
- Documentation: Complete audit trail

## Integration Points

Code Guard can integrate with:

**Version Control**
- GitHub (PR analysis, status checks)
- GitLab (merge request analysis)
- Bitbucket (pull request validation)

**Project Management**
- Jira (ticket correlation, sprint metrics)
- Linear (issue tracking, cycle time)
- Asana (task completion tracking)

**Communication**
- Slack (real-time alerts, daily digests)
- Microsoft Teams (notifications, reports)
- Discord (team updates)

**Monitoring**
- Datadog (incident correlation)
- New Relic (performance impact)
- Sentry (error tracking correlation)

**Security**
- Snyk (dependency scanning)
- SonarQube (code quality integration)
- Veracode (security scanning)

## Performance Considerations

- Sync operations complete in <5 seconds for typical commits
- Security scans complete in <10 seconds for most files
- Team reports generate in <2 seconds for teams up to 50 people
- Memory usage: ~50MB for team-memory.json with 100 contributors
- Disk usage: ~100MB including all snapshots and audit logs

## Troubleshooting

**Sync fails**: Check that `.bob-team/config.json` has your correct email
**No data showing**: Run `/sync` after your first commit
**Access denied**: Your email in git config must match config.json
**Corrupted memory**: Delete `.bob-team/team-memory.json` and run `/sync` to rebuild
**Security scan errors**: Check `.bob-team/security-baseline.json` is valid JSON
**Quality gate blocks valid code**: Adjust thresholds in `.bob-team/quality-rules.json`

## Version History

- **v2.0.0** (Current) - Code Guard with security scanning and quality gates
- **v1.0.0** - Original Team Intelligence System

## Support

- Documentation: See `docs/` folder
- Examples: See `examples/` folder
- Issues: Contact your team admin
- Security issues: Contact security lead immediately

---

**Remember**: Code Guard is a tool to help teams improve. Use it to coach and grow, not to punish or micromanage. Focus on trends, not individual commits. Celebrate improvements and support those who need help.