/**
 * Environment configuration
 * This file is auto-generated. Do not edit manually.
 * Run 'npm run gen:env' to regenerate.
 * 
 * Generated on: 2025-07-27T15:41:48.029Z
 */

export interface Environment {
  apiBaseUrl: string
  apiTimeout: number
  appName: string
  appVersion: string
  authStorageKey: string
  debugMode: boolean
  enableAnalytics: boolean
}

export const env: Environment = {
  apiBaseUrl: 'http://localhost:8000/api/v1',
  apiTimeout: 30000,
  appName: 'URL Analyzer',
  appVersion: '1.0.0',
  authStorageKey: 'webAnalyzer_auth',
  debugMode: false,
  enableAnalytics: true
}

// Validate required environment variables
const requiredEnvVars = ['apiBaseUrl', 'authStorageKey'];
requiredEnvVars.forEach(varName => {
  if (!env[varName as keyof Environment]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

export default env;
