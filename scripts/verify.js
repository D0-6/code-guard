#!/usr/bin/env node

/**
 * Code Guard - Verification Script
 * Verifies that Code Guard is properly installed in the project
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkExists(filePath, description) {
  const exists = fs.existsSync(filePath);
  if (exists) {
    log(`✅ ${description}`, 'green');
  } else {
    log(`❌ ${description} - NOT FOUND`, 'red');
  }
  return exists;
}

function verifyInstallation() {
  log('\n🔍 Code Guard - Installation Verification', 'blue');
  log('━'.repeat(50), 'blue');

  const projectRoot = process.cwd();
  let allChecks = true;

  log('\n📁 Checking Project Root:', 'yellow');
  log(`   ${projectRoot}\n`, 'yellow');

  // Check bob-skills directory
  log('📚 Bob Skills:', 'blue');
  const bobSkillsDir = path.join(projectRoot, 'bob-skills');
  allChecks &= checkExists(bobSkillsDir, 'bob-skills/ directory');

  if (fs.existsSync(bobSkillsDir)) {
    const skills = [
      'security-audit.md',
      'quality-gate.md',
      'sync.md',
      'team-intelligence.md',
      'admin-panel.md',
      'memory-map.md',
      'my-stats.md'
    ];

    for (const skill of skills) {
      const skillPath = path.join(bobSkillsDir, skill);
      allChecks &= checkExists(skillPath, `  └─ ${skill}`);
    }
  }

  // Check .bob-team directory
  log('\n⚙️  Configuration:', 'blue');
  const bobTeamDir = path.join(projectRoot, '.bob-team');
  allChecks &= checkExists(bobTeamDir, '.bob-team/ directory');

  if (fs.existsSync(bobTeamDir)) {
    const configs = [
      'security-baseline.json',
      'quality-rules.json',
      'config.json'
    ];

    for (const config of configs) {
      const configPath = path.join(bobTeamDir, config);
      allChecks &= checkExists(configPath, `  └─ ${config}`);
    }
  }

  // Check AGENTS.md
  log('\n📄 Context Files:', 'blue');
  const agentsPath = path.join(projectRoot, 'AGENTS.md');
  allChecks &= checkExists(agentsPath, 'AGENTS.md');

  // Check bob_sessions directory
  log('\n💾 Session Storage:', 'blue');
  const sessionsDir = path.join(projectRoot, 'bob_sessions');
  allChecks &= checkExists(sessionsDir, 'bob_sessions/ directory');

  // Summary
  log('\n━'.repeat(50), allChecks ? 'green' : 'red');
  if (allChecks) {
    log('✅ All checks passed! Code Guard is properly installed.', 'green');
    log('━'.repeat(50), 'green');

    log('\n🚀 You can now use Code Guard with Bob IDE!', 'blue');
    log('\n💡 Try these commands:', 'yellow');
    log('   "Bob, scan this project for security vulnerabilities"', 'yellow');
    log('   "Bob, check code quality and complexity"', 'yellow');
    log('   "Bob, show team performance metrics"', 'yellow');

    log('\n📖 Documentation:', 'blue');
    log('   - README: node_modules/@code-guard/bob-skills/README.md', 'yellow');
    log('   - Usage Guide: node_modules/@code-guard/bob-skills/HOW_TO_USE.md', 'yellow');
    log('   - Testing: node_modules/@code-guard/bob-skills/TESTING_GUIDE.md', 'yellow');

  } else {
    log('❌ Some checks failed. Code Guard may not be properly installed.', 'red');
    log('━'.repeat(50), 'red');

    log('\n🔧 Troubleshooting:', 'yellow');
    log('   1. Try running: npm install --force', 'yellow');
    log('   2. Check: node_modules/@code-guard/bob-skills/INSTALL.md', 'yellow');
    log('   3. Manual setup: node_modules/@code-guard/bob-skills/install.sh', 'yellow');
  }

  log('');
  process.exit(allChecks ? 0 : 1);
}

// Run verification
verifyInstallation();

// Made with Bob
