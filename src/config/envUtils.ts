import * as dotenv from 'dotenv';
dotenv.config();

export const getEnv = (key: string, fallback?: string): string => {
  return process.env[key] || fallback || '';
};

export const getBaseUrl = (): string => {
  const env = process.env.TEST_ENV || 'QAT';
  if (env === 'UAT') return process.env.UAT_URL || '';
  return process.env.QAT_URL || '';
};
