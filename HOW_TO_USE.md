# Code Guard - Complete Usage Guide

## 🎯 What We Built

Code Guard is a comprehensive security and quality analysis system for IBM Bob IDE. It consists of:

### 📁 Core Components

1. **7 Bob Skills** (Instruction Documents)
   - `security-audit.md` - Security vulnerability scanner
   - `quality-gate.md` - Code quality validator
   - `sync.md` - Team performance tracker
   - `team-intelligence.md` - Team analytics
   - `admin-panel.md` - Team management
   - `memory-map.md` - Visual team mapping
   - `my-stats.md` - Personal dashboards

2. **Configuration Files**
   - `security-baseline.json` - OWASP Top 10 patterns
   - `quality-rules.json` - Quality standards
   - `config.json` - Team settings

3. **Documentation**
   - `README.md` - System overview
   - `AGENTS.md` - Bob context file
   - `TESTING_GUIDE.md` - Testing instructions
   - `INSTALL.md` - Installation guide

## 🚀 How to Use Code Guard

### Method 1: Direct Bob Instructions (RECOMMENDED)

The skills are comprehensive instruction documents. Use them as reference and ask Bob directly:

#### Security Scanning

```
Bob, please perform a security audit of this project:

1. Scan all TypeScript/JavaScript files for:
   - Hardcoded secrets (API keys, passwords, tokens)
   - SQL injection vulnerabilities
   - XSS vulnerabilities
   - Missing authentication on routes
   - Insecure configurations
   - Weak encryption

2. Check against OWASP Top 10:
   - A01: Broken Access Control
   - A02: Cryptographic Failures
   - A03: Injection
   - A04: Insecure Design
   - A05: Security Misconfiguration
   - A06: Vulnerable Components
   - A07: Authentication Failures
   - A08: Data Integrity Failures
   - A09: Logging Failures
   - A10: SSRF

3. For each finding provide:
   - File name and line number
   - Severity (Critical/High/Medium/Low)
   - Description
   - Recommended fix

4. Generate security score (0-100)

Start with the most critical files.
```

#### Quality Analysis

```
Bob, please analyze code quality:

1. Check complexity:
   - Functions with cyclomatic complexity > 15
   - Files with > 300 lines
   - Deeply nested code (> 4 levels)

2. Verify standards:
   - Proper error handling
   - Input validation
   - Documentation completeness
   - Naming conventions

3. Check test coverage:
   - Critical functions have tests
   - Edge cases covered
   - Integration tests exist

4. Report findings with:
   - File locations
   - Specific issues
   - Recommendations
   - Quality score

Focus on core business logic first.
```

### Method 2: Use Skills as Checklists

Open the skill files and use them as detailed checklists:

1. **Open** `bob-skills/security-audit.md`
2. **Review** the patterns and checks it describes
3. **Ask Bob** to perform specific checks from the list

Example:
```
Bob, check all files for these patterns:
- password.*=.*['"].*['"]
- api[_-]?key.*=.*['"]
- SELECT.*FROM.*WHERE.*\+
- innerHTML.*=.*user
```

### Method 3: Reference the Configuration Files

Use the JSON configs as pattern libraries:

1. **Open** `.bob-team/security-baseline.json`
2. **Find** specific patterns you want to check
3. **Ask Bob** to search for those patterns

Example:
```
Bob, search all files for this regex pattern:
router\.(get|post|put|delete)\([^)]*\)\s*{[^}]*(?!req\.isAuthenticated|req\.user|authenticate|requireAuth)

This checks for routes without authentication.
```

### Method 4: Guided Analysis

Ask Bob to follow the skill instructions:

```
Bob, please read bob-skills/security-audit.md and follow its instructions to scan this project for security vulnerabilities.
```

## 📊 Practical Examples

### Example 1: Quick Security Check

```
Bob, scan server.ts for:
1. Hardcoded credentials
2. SQL injection risks
3. Missing authentication
4. Insecure session config

Report with line numbers.
```

### Example 2: Pre-Commit Quality Gate

```
Bob, before I commit, check:
1. No console.log statements
2. All functions documented
3. No TODO comments
4. Complexity under 15
5. Proper error handling

Check only modified files.
```

### Example 3: Dependency Security

```
Bob, analyze package.json:
1. Check for known vulnerabilities
2. Identify outdated packages
3. Find unused dependencies
4. Suggest security updates
```

### Example 4: Team Performance Review

```
Bob, analyze git history for last sprint:
1. Commits per developer
2. Code churn metrics
3. Bug fix ratio
4. Review response time
5. Generate team report
```

## 🎓 Understanding the Skills

### Security Audit Skill (777 lines)

**What it contains:**
- OWASP Top 10 vulnerability patterns
- Secret detection patterns (API keys, passwords, tokens)
- Code injection patterns (SQL, XSS, Command)
- Authentication/authorization checks
- Configuration security checks
- Dependency vulnerability checks

**How to use:**
- Reference for security patterns
- Checklist for code reviews
- Training material for team
- Basis for custom security checks

### Quality Gate Skill (777 lines)

**What it contains:**
- Complexity thresholds
- Code style standards
- Documentation requirements
- Test coverage expectations
- Performance guidelines
- Best practices

**How to use:**
- Pre-commit validation checklist
- Code review standards
- Quality metrics baseline
- Team coding guidelines

### Team Intelligence Skills

**sync.md** - Track team performance
**team-intelligence.md** - Analyze team metrics
**admin-panel.md** - Manage team settings
**memory-map.md** - Visualize team structure
**my-stats.md** - Personal dashboards

**How to use:**
- Team retrospectives
- Performance reviews
- Skill gap analysis
- Resource planning

## 🔧 Configuration

### Security Baseline

Edit `.bob-team/security-baseline.json` to:
- Enable/disable specific checks
- Adjust severity levels
- Add custom patterns
- Configure thresholds

### Quality Rules

Edit `.bob-team/quality-rules.json` to:
- Set complexity limits
- Define coverage requirements
- Configure style rules
- Add custom validations

### Team Config

Edit `.bob-team/config.json` to:
- Set team name and goals
- Configure notification preferences
- Define quality gates
- Set performance thresholds

## 📈 Workflow Integration

### Daily Development

```
Morning:
- Check my-stats for personal metrics
- Review team-intelligence for blockers

During Development:
- Run quality-gate before commits
- Check security-audit for new code

Before PR:
- Full security-audit scan
- Quality-gate validation
- Update documentation
```

### Code Review

```
Reviewer checklist:
1. Run security-audit on changed files
2. Check quality-gate compliance
3. Verify test coverage
4. Review complexity metrics
5. Check documentation
```

### Sprint Planning

```
Use team-intelligence to:
1. Review last sprint metrics
2. Identify bottlenecks
3. Plan capacity
4. Set quality goals
```

## 🎯 Best Practices

### 1. Start Small
- Begin with critical files
- Focus on high-severity issues
- Gradually expand coverage

### 2. Customize Patterns
- Adapt rules to your stack
- Add project-specific checks
- Adjust severity levels

### 3. Automate Checks
- Integrate with CI/CD
- Pre-commit hooks
- PR validation

### 4. Track Progress
- Monitor security scores
- Track quality trends
- Measure improvement

### 5. Team Training
- Use skills as training material
- Share findings in reviews
- Document lessons learned

## 🚨 Common Use Cases

### Use Case 1: New Project Setup

```
Bob, set up Code Guard for this new project:
1. Scan for initial security issues
2. Establish quality baseline
3. Configure team settings
4. Generate initial reports
```

### Use Case 2: Legacy Code Audit

```
Bob, audit this legacy codebase:
1. Identify critical security vulnerabilities
2. Measure code quality metrics
3. Prioritize technical debt
4. Create improvement roadmap
```

### Use Case 3: Pre-Production Check

```
Bob, pre-production security check:
1. Full security audit
2. Dependency vulnerability scan
3. Configuration review
4. Generate compliance report
```

### Use Case 4: Onboarding New Developer

```
Bob, help onboard new developer:
1. Show my-stats dashboard
2. Explain team-intelligence metrics
3. Review quality standards
4. Demonstrate security checks
```

## 📚 Skill Reference Quick Guide

| Skill | Purpose | When to Use |
|-------|---------|-------------|
| security-audit | Find vulnerabilities | Before commits, PRs, releases |
| quality-gate | Validate code quality | Pre-commit, code review |
| sync | Track performance | Daily standups, retrospectives |
| team-intelligence | Analyze team metrics | Sprint planning, reviews |
| admin-panel | Manage team | Configuration, onboarding |
| memory-map | Visualize team | Planning, resource allocation |
| my-stats | Personal dashboard | Daily check-in, self-review |

## 🎉 Key Benefits

### For Developers
- ✅ Catch security issues early
- ✅ Maintain code quality
- ✅ Track personal growth
- ✅ Learn best practices

### For Teams
- ✅ Consistent code standards
- ✅ Improved collaboration
- ✅ Better visibility
- ✅ Data-driven decisions

### For Projects
- ✅ Reduced vulnerabilities
- ✅ Higher code quality
- ✅ Faster reviews
- ✅ Better documentation

## 💡 Pro Tips

1. **Combine Skills**: Use multiple skills together for comprehensive analysis
2. **Customize Freely**: Adapt patterns and rules to your needs
3. **Iterate**: Start simple, add complexity as needed
4. **Document**: Keep notes on findings and fixes
5. **Share**: Use skills as team training material

## 🔗 Related Files

- `README.md` - System overview and architecture
- `TESTING_GUIDE.md` - How to test the system
- `INSTALL.md` - Installation instructions
- `AGENTS.md` - Bob context and capabilities
- `TROUBLESHOOTING.md` - Common issues and solutions

## 📞 Getting Help

If skills don't work as expected:
1. Check `TROUBLESHOOTING.md`
2. Use skills as reference guides
3. Ask Bob to follow skill instructions manually
4. Customize patterns for your project

---

**Remember:** The skills are comprehensive instruction documents. Even if slash commands don't work, you have detailed guides for security scanning, quality validation, and team analytics that you can use with Bob directly!