import * as fs from 'fs';
import * as path from 'path';

/**
 * Shape of a single environment configuration block.
 */
export interface EnvConfig {
  baseUrl: string;
  email: string;
  password: string;
}

/**
 * Map of all known environment names to their configuration.
 */
interface Environments {
  [key: string]: EnvConfig;
}

/**
 * Reads the TEST_ENV environment variable (defaults to "st"),
 * loads config/environments.json, and exports the matching config.
 */
function loadEnvConfig(): EnvConfig {
  const envName: string = process.env.TEST_ENV ?? 'st';

  const filePath = path.resolve(__dirname, '..', 'config', 'environments.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const environments: Environments = JSON.parse(raw);

  const config = environments[envName];
  if (!config) {
    throw new Error(
      `Environment "${envName}" not found in environments.json. ` +
        `Available: ${Object.keys(environments).join(', ')}`,
    );
  }

  console.log(`[envConfig] Loaded environment: "${envName}" → ${config.baseUrl}`);
  return config;
}

/** Exported configuration for the active environment. */
export const envConfig: EnvConfig = loadEnvConfig();

