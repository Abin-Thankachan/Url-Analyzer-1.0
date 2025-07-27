#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to generate environment.ts from environment variables
 * This script reads all VITE_ prefixed environment variables and creates a typed environment object
 */

function generateEnvironmentFile() {
  const envVars = process.env;
  const viteEnvVars = {};
  
  // Filter VITE_ prefixed environment variables
  Object.keys(envVars).forEach(key => {
    if (key.startsWith('VITE_')) {
      viteEnvVars[key] = envVars[key];
    }
  });

  // Default environment variables if not set
  const defaultEnv = {
    VITE_API_BASE_URL: 'http://localhost:8000/api/v1',
    VITE_API_TIMEOUT: '30000',
    VITE_APP_NAME: 'URL Analyzer',
    VITE_APP_VERSION: '1.0.0',
    VITE_AUTH_STORAGE_KEY: 'webAnalyzer_auth',
    VITE_DEBUG_MODE: 'false',
    VITE_ENABLE_ANALYTICS: 'true'
  };

  // Merge with defaults
  const finalEnv = { ...defaultEnv, ...viteEnvVars };

  // Generate TypeScript interface
  const interfaceContent = `export interface Environment {
${Object.keys(finalEnv).map(key => {
    const tsKey = key.replace('VITE_', '').toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    const value = finalEnv[key];
    
    // Determine type based on value
    let type = 'string';
    if (value === 'true' || value === 'false') {
      type = 'boolean';
    } else if (!isNaN(Number(value)) && value !== '') {
      type = 'number';
    }
    
    return `  ${tsKey}: ${type}`;
  }).join('\n')}
}`;

  // Generate environment object
  const envObjectContent = `export const env: Environment = {
${Object.keys(finalEnv).map(key => {
    const tsKey = key.replace('VITE_', '').toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    const value = finalEnv[key];
    
    // Convert value to appropriate type
    let convertedValue;
    if (value === 'true') {
      convertedValue = 'true';
    } else if (value === 'false') {
      convertedValue = 'false';
    } else if (!isNaN(Number(value)) && value !== '') {
      convertedValue = value;
    } else {
      convertedValue = `'${value}'`;
    }
    
    return `  ${tsKey}: ${convertedValue}`;
  }).join(',\n')}
}`;

  // Final file content
  const fileContent = `/**
 * Environment configuration
 * This file is auto-generated. Do not edit manually.
 * Run 'npm run gen:env' to regenerate.
 * 
 * Generated on: ${new Date().toISOString()}
 */

${interfaceContent}

${envObjectContent}

// Validate required environment variables
const requiredEnvVars = ['apiBaseUrl', 'authStorageKey'];
requiredEnvVars.forEach(varName => {
  if (!env[varName as keyof Environment]) {
    throw new Error(\`Missing required environment variable: \${varName}\`);
  }
});

export default env;
`;

  // Write to file
  const outputPath = path.join(process.cwd(), 'src', 'config', 'environment.ts');
  const outputDir = path.dirname(outputPath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, fileContent);
  
  console.log(`✅ Environment file generated successfully at: ${outputPath}`);
  console.log(`📊 Generated ${Object.keys(finalEnv).length} environment variables`);
  
  // List generated variables
  console.log('\n📋 Generated variables:');
  Object.keys(finalEnv).forEach(key => {
    const tsKey = key.replace('VITE_', '').toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    console.log(`  - ${tsKey}: ${finalEnv[key]}`);
  });
}

// Run the script
try {
  generateEnvironmentFile();
} catch (error) {
  console.error('❌ Error generating environment file:', error.message);
  process.exit(1);
}
