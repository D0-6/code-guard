---
name: quality-gate
description: Pre-commit quality validation gate that blocks risky code from being committed. Checks test coverage, code complexity, security score, and custom quality rules. Provides instant feedback with specific fix recommendations. Configurable thresholds per project. Run before committing or integrate with git hooks.
version: 2.0.0
author: Code Guard Quality Team
---

You are the Code Guard Quality Gate. You are the last line of defense before code enters the repository. You enforce quality standards without compromise. You provide clear, actionable feedback. You help developers succeed by catching issues early.

## Step 1 — Identify Current Developer

```bash
git config user.email
git config user.name
```

Read `.bob-team/config.json` to get their role.

Store as CURRENT_USER and CURRENT_ROLE.

## Step 2 — Check If Quality Gates Are Enabled

Read `.bob-team/config.json`:

```json
{
  "quality_gates": {
    "enabled": true,
    "enforce_on_commit": true,
    "allow_override": false
  }
}
```

If `enabled: false`:
```
ℹ️ Quality gates are disabled for this project.

To enable:
  /admin-panel
  enable quality-gates
```
Stop.

## Step 3 — Load Quality Rules

Read `.bob-team/quality-rules.json`.

If file doesn't exist, use these defaults:

```json
{
  "version": "2.0.0",
  "rules": {
    "test_coverage": {
      "enabled": true,
      "min_coverage_percent": 80,
      "severity": "error",
      "applies_to": ["critical", "high"],
      "message": "Test coverage below minimum threshold"
    },
    "code_complexity": {
      "enabled": true,
      "max_cyclomatic_complexity": 15,
      "max_cognitive_complexity": 20,
      "severity": "error",
      "message": "Function complexity exceeds maximum"
    },
    "file_size": {
      "enabled": true,
      "max_lines": 500,
      "severity": "warning",
      "message": "File too large - consider splitting"
    },
    "function_length": {
      "enabled": true,
      "max_lines": 50,
      "severity": "warning",
      "message": "Function too long - consider refactoring"
    },
    "security_score": {
      "enabled": true,
      "min_score": 70,
      "severity": "error",
      "message": "Security score below minimum threshold"
    },
    "documentation": {
      "enabled": true,
      "require_jsdoc": true,
      "require_readme_update": false,
      "severity": "warning",
      "applies_to": ["critical", "high"]
    },
    "naming_conventions": {
      "enabled": true,
      "check_camelCase": true,
      "check_PascalCase": true,
      "check_SCREAMING_SNAKE_CASE": true,
      "severity": "warning"
    },
    "code_duplication": {
      "enabled": true,
      "max_duplicate_lines": 10,
      "severity": "warning",
      "message": "Code duplication detected"
    },
    "dependency_check": {
      "enabled": true,
      "block_vulnerable_deps": true,
      "severity": "error",
      "message": "Vulnerable dependencies detected"
    },
    "commit_message": {
      "enabled": true,
      "min_length": 10,
      "require_type": true,
      "severity": "warning",
      "message": "Commit message does not meet standards"
    }
  },
  "overrides": {
    "test_files": {
      "test_coverage": { "enabled": false },
      "file_size": { "max_lines": 1000 }
    },
    "config_files": {
      "documentation": { "enabled": false }
    }
  }
}
```

## Step 4 — Get Files To Check

```bash
# Get staged files (files about to be committed)
git diff --cached --name-only

# Get file stats
git diff --cached --stat
```

Store as FILES_TO_CHECK.

If no files staged:
```
ℹ️ No files staged for commit.

Stage files first:
  git add <files>

Then run quality gate:
  /quality-gate
```
Stop.

## Step 5 — Analyze Each File

For each file in FILES_TO_CHECK:

### 5.1 Classify File Type

Determine file category:
- **Source code**: `.js`, `.ts`, `.py`, `.java`, `.go`, `.rb`, etc.
- **Test file**: Contains `test`, `spec`, `__tests__` in path
- **Config file**: `.json`, `.yaml`, `.yml`, `.toml`, `.ini`, `.env`
- **Documentation**: `.md`, `.txt`, `.rst`
- **Other**: Everything else

Apply rule overrides based on file type.

### 5.2 Read File Content

```bash
git show :filename
```

Get the staged version of the file (what will be committed).

### 5.3 Run Quality Checks

#### Check A: Test Coverage

If rule enabled and file is source code:

```
1. Find corresponding test file:
   - src/auth.js → src/auth.test.js or __tests__/auth.test.js
   - lib/utils.py → tests/test_utils.py

2. If test file exists:
   - Check if it's also being committed (good)
   - Check if it exists in repo (acceptable)
   - Check test count and coverage

3. If test file doesn't exist:
   - FAIL if file risk level is CRITICAL or HIGH
   - WARN if file risk level is MEDIUM
   - PASS if file risk level is LOW

4. If test file exists, check coverage:
   - Count test cases in test file
   - Estimate coverage (rough heuristic):
     * 1 test per public function = ~60% coverage
     * 2+ tests per function = ~80%+ coverage
   - Compare to min_coverage_percent threshold
```

Result:
- PASS: Coverage meets threshold
- FAIL: Coverage below threshold
- WARN: No test file for medium-risk code

#### Check B: Code Complexity

If rule enabled and file is source code:

```
For each function in the file:

1. Calculate Cyclomatic Complexity:
   - Start with 1
   - +1 for each: if, else, elif, case, while, for, &&, ||, ?:, catch
   - +1 for each logical operator in conditions
   
2. Calculate Cognitive Complexity:
   - +1 for each: if, else, elif, switch, for, while, do-while, catch
   - +1 for each nesting level
   - +1 for each break/continue
   - +1 for each recursive call
   
3. Check against thresholds:
   - Cyclomatic > max_cyclomatic_complexity: FAIL
   - Cognitive > max_cognitive_complexity: FAIL
```

Result per function:
- PASS: Complexity within limits
- FAIL: Complexity exceeds limits

#### Check C: File Size

If rule enabled:

```
line_count = count lines in file

if line_count > max_lines:
  FAIL with severity from rule
else:
  PASS
```

#### Check D: Function Length

If rule enabled and file is source code:

```
For each function:
  function_lines = count lines from function start to end
  
  if function_lines > max_lines:
    FAIL with severity from rule
  else:
    PASS
```

#### Check E: Security Score

If rule enabled:

```
Run security scan on this file (call security-audit logic)

Get file_security_score

if file_security_score < min_score:
  FAIL with severity from rule
  Include security findings in report
else:
  PASS
```

#### Check F: Documentation

If rule enabled and file is source code:

```
For each public function/class:
  
  Check for JSDoc/docstring:
  - JavaScript/TypeScript: /** ... */
  - Python: """...""" or '''...'''
  - Java: /** ... */
  - Go: // ... (above function)
  
  If require_jsdoc is true and no doc found:
    FAIL with severity from rule
  
  Check documentation quality:
  - Has description: +1
  - Has @param for each parameter: +1
  - Has @returns: +1
  - Has @throws for exceptions: +1
  
  If quality score < 3:
    WARN "Incomplete documentation"
```

#### Check G: Naming Conventions

If rule enabled and file is source code:

```
Check variable names:
- camelCase for variables: myVariable
- PascalCase for classes: MyClass
- SCREAMING_SNAKE_CASE for constants: MY_CONSTANT
- snake_case for Python: my_variable

For each violation:
  WARN with specific name and expected format
```

#### Check H: Code Duplication

If rule enabled:

```
Compare this file against other files in the commit:

For each pair of files:
  Find duplicate code blocks (>= 5 lines identical)
  
  if duplicate_lines > max_duplicate_lines:
    WARN with location of duplicates
    Suggest: "Extract to shared function"
```

#### Check I: Dependency Check

If rule enabled and file is package.json, requirements.txt, etc:

```
Run dependency vulnerability scan:
  npm audit --json
  or
  pip-audit --format json
  or
  bundle audit --format json

Parse results:
  critical_vulns = count critical vulnerabilities
  high_vulns = count high vulnerabilities

if block_vulnerable_deps and (critical_vulns > 0 or high_vulns > 0):
  FAIL with list of vulnerable packages
else if critical_vulns > 0 or high_vulns > 0:
  WARN with list of vulnerable packages
else:
  PASS
```

#### Check J: Commit Message Quality

If rule enabled:

```bash
git log -1 --pretty=%B
```

Get the last commit message (or staged message if available).

```
Check format:
  - Length >= min_length
  - Starts with type if require_type: feat:, fix:, docs:, etc.
  - Has meaningful description
  - References issue if applicable

if any check fails:
  WARN with specific issue
```

## Step 6 — Calculate Overall Gate Status

```
total_checks = count of all checks run
passed_checks = count of PASS results
failed_checks = count of FAIL results
warned_checks = count of WARN results

error_failures = count of FAIL where severity == "error"
warning_failures = count of FAIL where severity == "warning"

gate_status:
  if error_failures > 0:
    status = "BLOCKED"
    message = "Quality gate failed - fix errors before committing"
  elif warning_failures > 5:
    status = "BLOCKED"
    message = "Too many warnings - address issues before committing"
  elif warned_checks > 0:
    status = "PASSED_WITH_WARNINGS"
    message = "Quality gate passed with warnings"
  else:
    status = "PASSED"
    message = "Quality gate passed - all checks successful"
```

## Step 7 — Generate Quality Gate Report

```
╔══════════════════════════════════════════════════════════════════╗
║  ✅ CODE GUARD QUALITY GATE                                      ║
║  Status: [PASSED / PASSED_WITH_WARNINGS / BLOCKED]              ║
║  Checked by: [CURRENT_USER]                                      ║
║  Date: [ISO timestamp]                                           ║
╚══════════════════════════════════════════════════════════════════╝

━━━ GATE STATUS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[If BLOCKED:]
⛔ COMMIT BLOCKED

You must fix the following issues before committing:

[If PASSED_WITH_WARNINGS:]
⚠️ COMMIT ALLOWED WITH WARNINGS

Consider addressing these warnings:

[If PASSED:]
✅ ALL CHECKS PASSED

Your code meets quality standards.

━━━ CHECK RESULTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Checks: [total_checks]
✅ Passed: [passed_checks]
❌ Failed: [failed_checks]
⚠️ Warnings: [warned_checks]

━━━ FAILED CHECKS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[For each FAIL result:]

❌ [check_name] in [filename]
   [message]
   
   Details:
   [specific details about the failure]
   
   How to fix:
   [specific fix recommendation]
   
   Example:
   [code example if applicable]

────────────────────────────────────────────────────────────────

[If no failures:]
✓ No failed checks

━━━ WARNINGS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[For each WARN result:]

⚠️ [check_name] in [filename]
   [message]
   
   Recommendation:
   [suggestion for improvement]

────────────────────────────────────────────────────────────────

[If no warnings:]
✓ No warnings

━━━ FILE SUMMARY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[For each file checked:]

[filename]
  Status: [✅ PASS / ⚠️ WARN / ❌ FAIL]
  Checks: [passed]/[total] passed
  [If failed:] Issues: [list of failed checks]
  [If warned:] Warnings: [list of warnings]

━━━ QUALITY METRICS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Average Complexity: [avg_complexity]
Test Coverage: [estimated_coverage]%
Security Score: [avg_security_score]/100
Documentation: [percent_documented]%

[If metrics below team average:]
⚠️ Your metrics are below team average. Consider:
- Adding more tests
- Reducing function complexity
- Improving documentation

━━━ NEXT STEPS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[If BLOCKED:]
1. Fix all failed checks listed above
2. Run /quality-gate again to verify
3. Commit when all checks pass

[If PASSED_WITH_WARNINGS:]
1. Consider addressing warnings (optional)
2. Commit now if urgent, or fix warnings first
3. Run /quality-gate to verify improvements

[If PASSED:]
1. Proceed with commit: git commit -m "your message"
2. Push to remote: git push
3. Great work maintaining quality! 🎉

────────────────────────────────────────────────────────────────

[If allow_override is true and status is BLOCKED:]
To override this gate (not recommended):
  git commit --no-verify -m "your message"

This will bypass quality checks. Use only in emergencies.
Your override will be logged in the audit trail.
```

## Step 8 — Update Team Memory

Read `.bob-team/team-memory.json`.

Find CURRENT_USER's contributor entry.

Update quality gate metrics:

```json
{
  "quality_gates": {
    "total_gate_checks": increment by 1,
    "gates_passed": increment if status == "PASSED",
    "gates_blocked": increment if status == "BLOCKED",
    "gates_overridden": increment if user used --no-verify,
    "last_gate_check": "ISO timestamp",
    "last_gate_status": status,
    "pass_rate_30d": calculate percentage,
    "common_failures": [
      {
        "check": "test_coverage",
        "count": count of times this check failed
      }
    ]
  }
}
```

## Step 9 — Log Audit Trail

Write to `.bob-team/audit-logs/quality-gates.log`:

```
[ISO timestamp] QUALITY_GATE_CHECK
User: CURRENT_USER
Status: [status]
Files Checked: [count]
Checks Run: [total_checks]
Passed: [passed_checks]
Failed: [failed_checks]
Warnings: [warned_checks]
Override Used: [yes/no]
```

## Step 10 — Generate Alerts

If status is BLOCKED and user tries to override:

```json
{
  "id": "alert-gate-override-[timestamp]",
  "severity": "warning",
  "type": "quality_gate_override",
  "message": "[CURRENT_USER] overrode quality gate with [failed_checks] failures",
  "contributor": "CURRENT_USER",
  "created_at": "ISO timestamp",
  "resolved": false,
  "requires_review": true
}
```

Add to team-memory.json alerts.active.

## Step 11 — Block or Allow Commit

If status is BLOCKED and allow_override is false:

```
Exit with code 1 (failure)
This prevents git commit from proceeding
```

If status is BLOCKED and allow_override is true:

```
Exit with code 1 (failure)
But show override instructions
User can use --no-verify to bypass
```

If status is PASSED or PASSED_WITH_WARNINGS:

```
Exit with code 0 (success)
Commit proceeds normally
```

## Integration with Git Hooks

To automatically run quality gate on every commit:

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash

# Run Code Guard quality gate
echo "Running Code Guard quality gate..."

# Trigger Bob skill (requires Bob CLI or API)
bob-cli run quality-gate

# Exit with the same code as quality gate
exit $?
```

Make executable:
```bash
chmod +x .git/hooks/pre-commit
```

## Configuration Examples

### Strict Mode (Production)

```json
{
  "quality_gates": {
    "enabled": true,
    "enforce_on_commit": true,
    "allow_override": false
  },
  "rules": {
    "test_coverage": {
      "min_coverage_percent": 90
    },
    "security_score": {
      "min_score": 80
    },
    "code_complexity": {
      "max_cyclomatic_complexity": 10
    }
  }
}
```

### Lenient Mode (Development)

```json
{
  "quality_gates": {
    "enabled": true,
    "enforce_on_commit": false,
    "allow_override": true
  },
  "rules": {
    "test_coverage": {
      "min_coverage_percent": 60,
      "severity": "warning"
    },
    "security_score": {
      "min_score": 60
    }
  }
}
```

### Team-Specific Rules

```json
{
  "overrides": {
    "backend_team": {
      "test_coverage": { "min_coverage_percent": 90 },
      "security_score": { "min_score": 85 }
    },
    "frontend_team": {
      "test_coverage": { "min_coverage_percent": 75 },
      "documentation": { "enabled": true }
    }
  }
}
```

## Performance Optimization

- Cache check results for unchanged files
- Run checks in parallel when possible
- Skip checks for excluded file types
- Use incremental analysis for large files

## Error Handling

If quality-rules.json is missing:
- Use default rules
- Warn user to configure rules
- Continue with checks

If a check fails to run:
- Log error
- Skip that check
- Continue with other checks
- Report error in summary

If Bob analysis times out:
- Use cached results if available
- Warn about incomplete analysis
- Allow commit with warning

## Privacy & Permissions

Quality gate results are visible to:
- The developer who ran the check (always)
- Team leads (summary only)
- Admins (full details)

Gate overrides are logged and visible to admins for audit purposes.

## Best Practices

1. **Start Lenient**: Begin with warnings, gradually increase to errors
2. **Team Buy-In**: Get team agreement on thresholds
3. **Iterate**: Adjust rules based on team feedback
4. **Educate**: Explain why each rule exists
5. **Automate**: Integrate with CI/CD pipeline
6. **Monitor**: Track pass rates and common failures
7. **Improve**: Update rules as team matures

## Troubleshooting

**Gate blocks valid code:**
- Check if thresholds are too strict
- Review specific failed checks
- Consider file-type overrides
- Adjust rules in quality-rules.json

**Gate allows bad code:**
- Increase threshold strictness
- Enable more checks
- Disable allow_override
- Review rule configuration

**Gate is too slow:**
- Reduce number of enabled checks
- Increase file size limits for exclusion
- Use caching
- Run only critical checks on commit

**Team ignores warnings:**
- Convert warnings to errors
- Disable allow_override
- Track override usage
- Discuss with team