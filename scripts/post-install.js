#!/usr/bin/env node

/**
 * Code Guard - Post-Install Script
 * Automatically sets up Code Guard in the target project after npm/git installation
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

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function setupCodeGuard() {
  log('\n🛡️  Code Guard - Post-Install Setup', 'blue');
  log('━'.repeat(50), 'blue');

  try {
    // Determine project root - INIT_CWD is set by npm to the dir where `npm install` was run
    const projectRoot = process.env.INIT_CWD || process.cwd();
    const codeGuardPath = path.resolve(__dirname, '..');

    log(`\n📁 Project Root: ${projectRoot}`, 'yellow');
    log(`📦 Code Guard Path: ${codeGuardPath}`, 'yellow');

    // Create bob-skills directory
    const bobSkillsDir = path.join(projectRoot, 'bob-skills');
    if (!fs.existsSync(bobSkillsDir)) {
      fs.mkdirSync(bobSkillsDir, { recursive: true });
      log('\n✅ Created bob-skills/ directory', 'green');
    } else {
      log('\n⚠️  bob-skills/ directory already exists', 'yellow');
    }

    // Copy skills
    const skillsSource = path.join(codeGuardPath, 'bob-skills');
    if (fs.existsSync(skillsSource)) {
      const skills = fs.readdirSync(skillsSource);
      let copiedCount = 0;

      for (const skill of skills) {
        const srcPath = path.join(skillsSource, skill);
        const destPath = path.join(bobSkillsDir, skill);

        if (!fs.existsSync(destPath)) {
          fs.copyFileSync(srcPath, destPath);
          copiedCount++;
        }
      }

      log(`✅ Copied ${copiedCount} skill files`, 'green');
    }

    // Create .bob-team directory
    const bobTeamDir = path.join(projectRoot, '.bob-team');
    if (!fs.existsSync(bobTeamDir)) {
      fs.mkdirSync(bobTeamDir, { recursive: true });
      log('✅ Created .bob-team/ directory', 'green');
    }

    // Copy configuration files
    const configSource = path.join(codeGuardPath, '.bob-team');
    if (fs.existsSync(configSource)) {
      const configs = fs.readdirSync(configSource, { withFileTypes: true });
      let copiedCount = 0;

      for (const entry of configs) {
        const srcPath = path.join(configSource, entry.name);
        const destPath = path.join(bobTeamDir, entry.name);

        if (!fs.existsSync(destPath)) {
          if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath);
          } else {
            fs.copyFileSync(srcPath, destPath);
          }
          copiedCount++;
        }
      }

      log(`✅ Copied ${copiedCount} configuration files`, 'green');
    }

    // Copy AGENTS.md if it doesn't exist
    const agentsSrc = path.join(codeGuardPath, 'AGENTS.md');
    const agentsDest = path.join(projectRoot, 'AGENTS.md');
    if (fs.existsSync(agentsSrc) && !fs.existsSync(agentsDest)) {
      fs.copyFileSync(agentsSrc, agentsDest);
      log('✅ Copied AGENTS.md', 'green');
    }

    // Create bob_sessions directory
    const sessionsDir = path.join(projectRoot, 'bob_sessions');
    if (!fs.existsSync(sessionsDir)) {
      fs.mkdirSync(sessionsDir, { recursive: true });
      fs.writeFileSync(path.join(sessionsDir, '.gitkeep'), '');
      log('✅ Created bob_sessions/ directory', 'green');
    }

    // Success message
    log('\n━'.repeat(50), 'green');
    log('🎉 Code Guard installed successfully!', 'green');
    log('━'.repeat(50), 'green');

    log('\n📚 Next Steps:', 'blue');
    log('1. Review bob-skills/ folder for available skills', 'yellow');
    log('2. Customize .bob-team/ configuration files', 'yellow');
    log('3. Read AGENTS.md for Bob IDE context', 'yellow');
    log('4. Run: npm run verify (to verify installation)', 'yellow');

    log('\n🚀 Quick Start:', 'blue');
    log('Ask Bob: "Scan this project for security vulnerabilities"', 'yellow');
    log('Or: "Check code quality and complexity"', 'yellow');

    log('\n📖 Documentation:', 'blue');
    log('- node_modules/@code-guard/bob-skills/README.md', 'yellow');
    log('- node_modules/@code-guard/bob-skills/HOW_TO_USE.md', 'yellow');
    log('- node_modules/@code-guard/bob-skills/TESTING_GUIDE.md', 'yellow');

  } catch (error) {
    log('\n❌ Installation failed:', 'red');
    log(error.message, 'red');
    log('\n💡 Try manual installation:', 'yellow');
    log('See: node_modules/@code-guard/bob-skills/INSTALL.md', 'yellow');
    process.exit(1);
  }
}

// Run setup
setupCodeGuard();

// Made with Bob
