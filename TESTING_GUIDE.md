# Code Guard - Testing Guide

## How to Test Code Guard

This guide will help you test the Code Guard system step by step.

## Prerequisites

1. **IBM Bob IDE** installed and running
2. **Git** installed and configured
3. A test repository (or create a new one)

## Quick Test Setup (5 Minutes)

### Step 1: Create a Test Repository

```bash
# Create a new test directory
mkdir code-guard-test
cd code-guard-test

# Initialize git
git init
git config user.name "Test User"
git config user.email "test@example.com"
```

### Step 2: Copy Code Guard Files

```bash
# Copy Code Guard to your test repo
cp -r "D:/Projects/BOB Guard/Code Guard/.bob-team" ./
cp -r "D:/Projects/BOB Guard/Code Guard/bob-skills" ./
cp "D:/Projects/BOB Guard/Code Guard/AGENTS.md" ./
cp "D:/Projects/BOB Guard/Code Guard/.gitignore" ./
```

### Step 3: Configure Your Team

Edit `.bob-team/config.json` and update:

```json
{
  "project": {
    "name": "Code Guard Test",
    "repo": "local-test"
  },
  "roles": {
    "admins": [
      {
        "username": "test",
        "email": "test@example.com",
        "name": "Test User"
      }
    ]
  }
}
```

### Step 4: Create Test Files

Create a test JavaScript file with intentional issues:

**test-file.js:**
```javascript
// Test file with security issues
const password = "hardcoded123"; // Should trigger secret detection
const apiKey = "api_key=sk_live_1234567890abcdef"; // Should trigger API key detection

function complexFunction(a, b, c, d, e) {
  // No documentation - should trigger doc warning
  if (a > 0) {
    if (b > 0) {
      if (c > 0) {
        if (d > 0) {
          if (e > 0) {
            // High complexity - should trigger complexity warning
            return a + b + c + d + e;
          }
        }
      }
    }
  }
  return 0;
}

// SQL injection vulnerability
function getUserData(userId) {
  const query = "SELECT * FROM users WHERE id = " + userId; // Should trigger SQL injection
  return db.query(query);
}

// Missing authentication
router.get('/admin', (req, res) => {
  // No auth check - should trigger access control warning
  res.send('Admin panel');
});

console.log(password); // Should trigger sensitive data in logs
```

### Step 5: Commit the Test File

```bash
git add test-file.js
git commit -m "test: add test file with issues"
```

## Testing Individual Skills

### Test 1: Security Audit

Open IBM Bob IDE in your test repository and run:

```
/security-audit
```

**Expected Results:**
- Should detect hardcoded password
- Should detect API key
- Should detect SQL injection vulnerability
- Should detect missing authentication
- Should detect sensitive data in logs
- Should give security grade (likely F or D)
- Should show specific line numbers and fix recommendations

**What to Check:**
- ✅ All vulnerabilities detected
- ✅ Severity levels correct (critical/high/medium/low)
- ✅ Fix recommendations provided
- ✅ Security score calculated
- ✅ OWASP categories identified

### Test 2: Quality Gate

Stage the file and run:

```bash
git add test-file.js
```

Then in Bob IDE:

```
/quality-gate
```

**Expected Results:**
- Should fail due to:
  - Missing documentation
  - High complexity
  - Security score below threshold
  - No test file
- Should block commit
- Should provide specific fix recommendations

**What to Check:**
- ✅ Quality checks run
- ✅ Failures identified
- ✅ Commit blocked (if configured)
- ✅ Clear error messages
- ✅ Fix recommendations provided

### Test 3: Fix Issues and Retest

Create a fixed version:

**test-file-fixed.js:**
```javascript
// Fixed version with proper security
require('dotenv').config();
const password = process.env.PASSWORD; // From environment
const apiKey = process.env.API_KEY; // From environment

/**
 * Adds multiple numbers together
 * @param {number[]} numbers - Array of numbers to add
 * @returns {number} Sum of all numbers
 */
function addNumbers(numbers) {
  return numbers.reduce((sum, num) => sum + num, 0);
}

/**
 * Gets user data safely
 * @param {string} userId - User ID to fetch
 * @returns {Promise<Object>} User data
 */
async function getUserData(userId) {
  // Parameterized query prevents SQL injection
  const query = "SELECT * FROM users WHERE id = ?";
  return db.query(query, [userId]);
}

// Proper authentication middleware
router.get('/admin', authenticateAdmin, (req, res) => {
  res.send('Admin panel');
});

// No sensitive data in logs
logger.info('User data fetched', { userId: 'masked' });
```

Run security audit again:

```
/security-audit
```

**Expected Results:**
- Should pass with grade A or B
- No critical vulnerabilities
- Minimal or no warnings

### Test 4: Create Test File

**test-file-fixed.test.js:**
```javascript
const { addNumbers, getUserData } = require('./test-file-fixed');

describe('addNumbers', () => {
  test('adds numbers correctly', () => {
    expect(addNumbers([1, 2, 3])).toBe(6);
  });
});

describe('getUserData', () => {
  test('uses parameterized query', async () => {
    const result = await getUserData('123');
    expect(result).toBeDefined();
  });
});
```

Now quality gate should pass:

```
/quality-gate
```

**Expected Results:**
- ✅ All checks pass
- ✅ Test coverage adequate
- ✅ Complexity acceptable
- ✅ Security score good
- ✅ Commit allowed

## Testing Without IBM Bob IDE

If you don't have IBM Bob IDE yet, you can test the configuration files:

### Test Configuration Validation

```bash
# Check if config.json is valid JSON
python -m json.tool .bob-team/config.json

# Check security-baseline.json
python -m json.tool .bob-team/security-baseline.json

# Check quality-rules.json
python -m json.tool .bob-team/quality-rules.json
```

All should output formatted JSON without errors.

### Test Pattern Matching

You can manually test security patterns:

```bash
# Test for hardcoded passwords
grep -r "password.*=.*['\"]" test-file.js

# Test for API keys
grep -r "api.*key.*=.*['\"]" test-file.js

# Test for SQL injection patterns
grep -r "query.*+.*+" test-file.js
```

## Advanced Testing Scenarios

### Scenario 1: Team Collaboration

1. Create multiple users in config.json
2. Simulate commits from different users
3. Test role-based access (admin vs developer)
4. Verify privacy controls work

### Scenario 2: Progressive Enforcement

1. Set quality gates to "warning" mode
2. Commit code with issues
3. Gradually increase to "error" mode
4. Verify enforcement works

### Scenario 3: Compliance Testing

1. Enable GDPR compliance checks
2. Add code that handles PII
3. Verify encryption requirements detected
4. Test consent tracking validation

### Scenario 4: Integration Testing

1. Set up git hooks
2. Test automatic quality gate on commit
3. Verify blocking works
4. Test override mechanism

## Troubleshooting Tests

### Issue: Skills Not Found

**Solution:**
- Ensure `bob-skills/` folder is in repository root
- Check AGENTS.md is present
- Verify Bob IDE is in the correct directory

### Issue: Configuration Errors

**Solution:**
- Validate JSON files with `python -m json.tool`
- Check email in config matches git config
- Ensure all required fields present

### Issue: No Vulnerabilities Detected

**Solution:**
- Check security-baseline.json is loaded
- Verify patterns are enabled
- Test with known vulnerable code
- Check file exclusions

### Issue: Quality Gate Not Blocking

**Solution:**
- Check `quality_gates.enabled: true` in config
- Verify `enforce_on_commit: true`
- Check `allow_override: false`
- Ensure rules are set to "error" severity

## Test Checklist

Use this checklist to verify all features:

### Security Audit
- [ ] Detects hardcoded secrets
- [ ] Detects SQL injection
- [ ] Detects XSS vulnerabilities
- [ ] Detects authentication issues
- [ ] Detects insecure configuration
- [ ] Calculates security score
- [ ] Provides fix recommendations
- [ ] Checks OWASP compliance
- [ ] Generates detailed report

### Quality Gate
- [ ] Checks test coverage
- [ ] Measures code complexity
- [ ] Validates documentation
- [ ] Checks naming conventions
- [ ] Detects code duplication
- [ ] Scans dependencies
- [ ] Validates commit messages
- [ ] Blocks failing commits
- [ ] Allows override (if configured)

### Configuration
- [ ] config.json loads correctly
- [ ] security-baseline.json loads
- [ ] quality-rules.json loads
- [ ] Role detection works
- [ ] Team assignments work
- [ ] Overrides apply correctly

### Integration
- [ ] Git hooks work
- [ ] Audit logging works
- [ ] Reports generate
- [ ] Alerts trigger
- [ ] Team memory updates

## Performance Testing

Test with different repository sizes:

1. **Small repo** (< 100 files): Should complete in < 5 seconds
2. **Medium repo** (100-1000 files): Should complete in < 30 seconds
3. **Large repo** (> 1000 files): Should complete in < 2 minutes

## Next Steps After Testing

Once testing is complete:

1. **Customize rules** for your team's needs
2. **Adjust thresholds** based on current code quality
3. **Enable progressive enforcement** for gradual adoption
4. **Set up integrations** (Slack, Jira, etc.)
5. **Train team** on using the skills
6. **Monitor metrics** and adjust as needed

## Getting Help

If you encounter issues:

1. Check AGENTS.md for Bob context
2. Review configuration files for errors
3. Check audit logs for details
4. Verify git configuration
5. Test with minimal example first

## Success Criteria

Your Code Guard installation is working correctly when:

✅ Security audit detects known vulnerabilities
✅ Quality gate blocks bad code
✅ Configuration loads without errors
✅ Reports generate successfully
✅ Audit logs are created
✅ Team members can run skills
✅ Role-based access works
✅ Metrics are tracked over time

---

**Ready to test?** Start with Step 1 and work through each test systematically!