import { config } from 'dotenv';
import { Level } from 'pino';
import { AppEnvironment, LogLevel } from '~/shared/enums';

interface AppConfig {
  PROTOCOL: string;
  PORT: number;
  HOST: string;
  NODE_ENV: AppEnvironment;
  LOGGER: {
    level: Level;
  };
}

interface DatabaseConfig {
  DATABASE_URL: string;
}

interface ApiConfig {
  PREFIX: string;
}

interface EncryptionConfig {
  ACCESS_TOKEN_SECRET: string;
  ACCESS_TOKEN_LIFETIME: string;
  REFRESH_SECRET: string;
  REFRESH_LIFETIME: string;
  RESET_PASSWORD_TOKEN_SECRET: string;
  RESET_PASSWORD_TOKEN_LIFETIME: string;
  VERIFICATION_TOKEN_SECRET: string;
  VERIFICATION_TOKEN_LIFETIME: string;
}

export interface ConfigInterface {
  APP: AppConfig;
  DATABASE: DatabaseConfig;
  API: ApiConfig;
  ENCRYPTION: EncryptionConfig;
}

const isDevEnvironment = (nodeEnv = ''): boolean =>
  nodeEnv === AppEnvironment.DEVELOPMENT;

const configuration = (): ConfigInterface => {
  config();

  const { NODE_ENV, API_PROTOCOL, HOST, PORT, DATABASE_URL, API_BASE_PREFIX } =
    process.env;

  const host = HOST || 'localhost';
  const port = Number(PORT) || 5000;
  const extension = isDevEnvironment(NODE_ENV) ? '.ts' : '.js';

  return {
    APP: {
      PROTOCOL: API_PROTOCOL || 'http://',
      PORT: port,
      HOST: isDevEnvironment(NODE_ENV) ? `${host}:${port}` : host,
      NODE_ENV: <AppEnvironment>NODE_ENV || AppEnvironment.DEVELOPMENT,
      LOGGER: {
        level: isDevEnvironment(NODE_ENV) ? LogLevel.DEBUG : LogLevel.INFO,
      },
    },
    DATABASE: {
      DATABASE_URL: DATABASE_URL || '',
    },
    API: {
      PREFIX: API_BASE_PREFIX || '',
    },
    ENCRYPTION: getEncryptionConfig(),
  };
};

const getEncryptionConfig = (): EncryptionConfig => {
  const {
    ACCESS_TOKEN_SECRET,
    REFRESH_SECRET,
    RESET_PASSWORD_TOKEN_SECRET,
    VERIFICATION_TOKEN_SECRET,
    ACCESS_TOKEN_LIFETIME,
    REFRESH_LIFETIME,
    RESET_PASSWORD_TOKEN_LIFETIME,
    VERIFICATION_TOKEN_LIFETIME,
  } = process.env;

  if (
    !ACCESS_TOKEN_SECRET ||
    !REFRESH_SECRET ||
    !RESET_PASSWORD_TOKEN_SECRET ||
    !VERIFICATION_TOKEN_SECRET
  ) {
    throw new Error('Missing jwt secrets in env');
  }

  return {
    ACCESS_TOKEN_SECRET,
    REFRESH_SECRET,
    RESET_PASSWORD_TOKEN_SECRET,
    VERIFICATION_TOKEN_SECRET,
    REFRESH_LIFETIME:
      REFRESH_LIFETIME || encryptionConfigDefault.REFRESH_LIFETIME,
    ACCESS_TOKEN_LIFETIME:
      ACCESS_TOKEN_LIFETIME || encryptionConfigDefault.ACCESS_TOKEN_LIFETIME,
    RESET_PASSWORD_TOKEN_LIFETIME:
      RESET_PASSWORD_TOKEN_LIFETIME ||
      encryptionConfigDefault.RESET_PASSWORD_TOKEN_LIFETIME,
    VERIFICATION_TOKEN_LIFETIME:
      VERIFICATION_TOKEN_LIFETIME ||
      encryptionConfigDefault.VERIFICATION_TOKEN_LIFETIME,
  };
};

const encryptionConfigDefault = {
  ACCESS_TOKEN_LIFETIME: '1d',
  REFRESH_LIFETIME: '30d',
  RESET_PASSWORD_TOKEN_LIFETIME: '30m',
  VERIFICATION_TOKEN_LIFETIME: '30m',
};

const CONFIG = configuration();

export { CONFIG };
