import { Environment } from './environment';

interface Config {
  baseUrl: string;
  apiUrl: string;
}

const configs: Record<Environment, Config> = {
  [Environment.DEV]: {
    baseUrl: 'https://admin.dev.anddone.com/#',
    apiUrl: 'https://api.dev.anddone.com'
  },
  [Environment.QAT]: {
    baseUrl: 'https://admin.qat.anddone.com/#',
    apiUrl: 'https://api.qat.anddone.com'
  },
  [Environment.STAGING]: {
    baseUrl: 'https://admin.staging.anddone.com/#',
    apiUrl: 'https://api.staging.anddone.com'
  },
  [Environment.PROD]: {
    baseUrl: 'https://admin.anddone.com/#',
    apiUrl: 'https://api.anddone.com'
  }
};

const environment = (process.env.TEST_ENV || Environment.QAT) as Environment;

export const config = configs[environment];
export const currentEnvironment = environment;