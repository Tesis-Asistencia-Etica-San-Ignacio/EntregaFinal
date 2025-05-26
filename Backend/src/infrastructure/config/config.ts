import dotenv from 'dotenv';
import { validateEnv } from '../../shared/utils';

dotenv.config();

const requiredEnvVars = [
  'MONGO_URI',
  'CONVENTION_API',
  'JWT_SECRET',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
];
validateEnv(requiredEnvVars);

function parseTime(timeStr: string): number {
  if (timeStr.includes('*')) {
    return timeStr.split('*').reduce((acc, cur) => acc * parseFloat(cur), 1);
  }
  if (timeStr.endsWith('s')) {
    return parseFloat(timeStr.slice(0, -1));
  }
  if (timeStr.endsWith('m')) {
    return parseFloat(timeStr.slice(0, -1)) * 60;
  }
  if (timeStr.endsWith('h')) {
    return parseFloat(timeStr.slice(0, -1)) * 3600;
  }
  if (timeStr.endsWith('d')) {
    return parseFloat(timeStr.slice(0, -1)) * 86400;
  }
  return parseFloat(timeStr);
}

// Se leen las variables de entorno o se asignan los valores por defecto
const jwtExpiresInEnv = process.env.JWT_EXPIRES_IN ?? '60m';
const jwtRefreshExpiresInEnv = process.env.JWT_REFRESH_EXPIRES_IN ?? '7d';

const config = {
  database: {
    mongoUri: process.env.MONGO_URI as string,
  },
  server: {
    port: parseInt(process.env.PORT ?? '3000', 10),
  },
  jwt: {
    secret: process.env.JWT_SECRET as string,
    secretRefresh: process.env.JWT_SECRET_REFRESH as string,
    // Se convierten a segundos
    tokenExpiresIn: parseTime(jwtExpiresInEnv),
    refreshExpiresTokenIn: parseTime(jwtRefreshExpiresInEnv),
    saltRounds: parseInt(process.env.JWT_SALT_ROUNDS ?? '10', 10),
  },
  logging: {
    level: process.env.LOG_LEVEL ?? 'info',
  },
  api: {
    conventionApi: process.env.CONVENTION_API as string,
  },
  smtp: {
    host: process.env.SMTP_HOST as string,
    port: parseInt(process.env.SMTP_PORT as string, 10),
    user: process.env.SMTP_USER as string,
    pass: process.env.SMTP_PASS as string,
  },
  groq: {
    apiKey: process.env.GROQ_API_KEY as string,
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY as string,
  },
};

export default config;
