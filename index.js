#!/usr/bin/env node

/**
 * Code Guard - Main Entry Point
 * Enhanced security and quality analysis system for IBM Bob IDE
 */

const fs = require('fs');
const path = require('path');

// Export main functionality
module.exports = {
  version: '1.0.0',
  name: 'Code Guard',
  
  /**
   * Get the path to bob-skills directory
   */
  getSkillsPath: function() {
    return path.join(__dirname, 'bob-skills');
  },
  
  /**
   * Get the path to configuration directory
   */
  getConfigPath: function() {
    return path.join(__dirname, '.bob-team');
  },
  
  /**
   * Get list of available skills
   */
  getSkills: function() {
    const skillsPath = this.getSkillsPath();
    if (!fs.existsSync(skillsPath)) {
      return [];
    }
    
    return fs.readdirSync(skillsPath)
      .filter(file => file.endsWith('.md'))
      .map(file => ({
        name: file.replace('.md', ''),
        path: path.join(skillsPath, file)
      }));
  },
  
  /**
   * Get configuration
   */
  getConfig: function(configName = 'config.json') {
    const configPath = path.join(this.getConfigPath(), configName);
    if (!fs.existsSync(configPath)) {
      return null;
    }
    
    try {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (error) {
      console.error(`Error reading ${configName}:`, error.message);
      return null;
    }
  },
  
  /**
   * Get security baseline patterns
   */
  getSecurityBaseline: function() {
    return this.getConfig('security-baseline.json');
  },
  
  /**
   * Get quality rules
   */
  getQualityRules: function() {
    return this.getConfig('quality-rules.json');
  },
  
  /**
   * Verify installation
   */
  verify: function() {
    const checks = {
      skills: fs.existsSync(this.getSkillsPath()),
      config: fs.existsSync(this.getConfigPath()),
      securityBaseline: fs.existsSync(path.join(this.getConfigPath(), 'security-baseline.json')),
      qualityRules: fs.existsSync(path.join(this.getConfigPath(), 'quality-rules.json'))
    };
    
    const allPassed = Object.values(checks).every(check => check);
    
    return {
      passed: allPassed,
      checks: checks
    };
  },
  
  /**
   * Get package info
   */
  getInfo: function() {
    const packageJson = require('./package.json');
    return {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
      skills: this.getSkills().length,
      homepage: packageJson.homepage
    };
  }
};

// If run directly, show info
if (require.main === module) {
  const codeGuard = module.exports;
  const info = codeGuard.getInfo();
  
  console.log('\n🛡️  Code Guard - Security & Quality Analysis System\n');
  console.log(`Version: ${info.version}`);
  console.log(`Skills Available: ${info.skills}`);
  console.log(`\nFor usage information, see:`);
  console.log(`  ${path.join(__dirname, 'HOW_TO_USE.md')}`);
  console.log(`\nTo verify installation:`);
  console.log(`  npm run verify`);
  console.log(`\nDocumentation:`);
  console.log(`  ${info.homepage}\n`);
}

// Made with Bob
