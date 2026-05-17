#!/usr/bin/env node

/**
 * Code Guard CLI
 * Command-line interface for Code Guard
 */

const codeGuard = require('../index');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function showHelp() {
  log('\n🛡️  Code Guard CLI\n', 'blue');
  log('Usage: code-guard <command>\n', 'cyan');
  log('Commands:', 'yellow');
  log('  info          Show package information');
  log('  skills        List available skills');
  log('  verify        Verify installation');
  log('  config        Show configuration');
  log('  security      Show security baseline');
  log('  quality       Show quality rules');
  log('  help          Show this help message');
  log('  version       Show version\n');
  log('Examples:', 'yellow');
  log('  code-guard info');
  log('  code-guard skills');
  log('  code-guard verify\n');
}

function showInfo() {
  const info = codeGuard.getInfo();
  log('\n🛡️  Code Guard Information\n', 'blue');
  log(`Name:        ${info.name}`, 'cyan');
  log(`Version:     ${info.version}`, 'cyan');
  log(`Description: ${info.description}`, 'cyan');
  log(`Skills:      ${info.skills}`, 'cyan');
  log(`Homepage:    ${info.homepage}`, 'cyan');
  log('');
}

function showSkills() {
  const skills = codeGuard.getSkills();
  log('\n📚 Available Skills\n', 'blue');
  
  if (skills.length === 0) {
    log('No skills found. Please run: npm install', 'red');
    return;
  }
  
  skills.forEach((skill, index) => {
    log(`${index + 1}. ${skill.name}`, 'green');
    log(`   Path: ${skill.path}`, 'cyan');
  });
  log('');
}

function showVerify() {
  const result = codeGuard.verify();
  log('\n🔍 Installation Verification\n', 'blue');
  
  log('Checks:', 'yellow');
  log(`  Skills directory:      ${result.checks.skills ? '✅' : '❌'}`, result.checks.skills ? 'green' : 'red');
  log(`  Config directory:      ${result.checks.config ? '✅' : '❌'}`, result.checks.config ? 'green' : 'red');
  log(`  Security baseline:     ${result.checks.securityBaseline ? '✅' : '❌'}`, result.checks.securityBaseline ? 'green' : 'red');
  log(`  Quality rules:         ${result.checks.qualityRules ? '✅' : '❌'}`, result.checks.qualityRules ? 'green' : 'red');
  
  log(`\nStatus: ${result.passed ? '✅ All checks passed!' : '❌ Some checks failed'}`, result.passed ? 'green' : 'red');
  log('');
  
  process.exit(result.passed ? 0 : 1);
}

function showConfig() {
  const config = codeGuard.getConfig();
  log('\n⚙️  Configuration\n', 'blue');
  
  if (!config) {
    log('Configuration not found', 'red');
    return;
  }
  
  log(JSON.stringify(config, null, 2), 'cyan');
  log('');
}

function showSecurity() {
  const baseline = codeGuard.getSecurityBaseline();
  log('\n🔐 Security Baseline\n', 'blue');
  
  if (!baseline) {
    log('Security baseline not found', 'red');
    return;
  }
  
  // Show summary
  const owasp = baseline.owasp_top_10 || {};
  const secrets = baseline.secret_patterns || [];
  const injections = baseline.injection_patterns || [];
  
  log('OWASP Top 10 Categories:', 'yellow');
  Object.keys(owasp).forEach(key => {
    const category = owasp[key];
    const patterns = category.patterns ? category.patterns.length : 0;
    log(`  ${key}: ${patterns} patterns`, 'cyan');
  });
  
  log(`\nSecret Patterns: ${secrets.length}`, 'yellow');
  log(`Injection Patterns: ${injections.length}`, 'yellow');
  log('');
}

function showQuality() {
  const rules = codeGuard.getQualityRules();
  log('\n✨ Quality Rules\n', 'blue');
  
  if (!rules) {
    log('Quality rules not found', 'red');
    return;
  }
  
  // Show summary
  log('Categories:', 'yellow');
  Object.keys(rules).forEach(category => {
    const ruleCount = Object.keys(rules[category]).length;
    log(`  ${category}: ${ruleCount} rules`, 'cyan');
  });
  log('');
}

function showVersion() {
  const info = codeGuard.getInfo();
  log(`\nCode Guard v${info.version}\n`, 'green');
}

// Main command handler
switch (command) {
  case 'info':
    showInfo();
    break;
  
  case 'skills':
    showSkills();
    break;
  
  case 'verify':
    showVerify();
    break;
  
  case 'config':
    showConfig();
    break;
  
  case 'security':
    showSecurity();
    break;
  
  case 'quality':
    showQuality();
    break;
  
  case 'version':
  case '-v':
  case '--version':
    showVersion();
    break;
  
  case 'help':
  case '-h':
  case '--help':
  case undefined:
    showHelp();
    break;
  
  default:
    log(`\n❌ Unknown command: ${command}\n`, 'red');
    showHelp();
    process.exit(1);
}

// Made with Bob
