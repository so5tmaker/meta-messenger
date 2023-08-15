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
  DI_CONTAINER_MODULES_PATHS: string[];
  UNAUTHORIZED_USER_ID: string;
  TESTS_USER_PHONE: string;
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

interface YandexPlaces {
  API_KEY: string;
}

interface OpenAI {
  API_KEY: string;
  CHAT_MODEL: string;
}

interface SmsProvider {
  API_KEY: string;
  DOMAIN_API: string;
  MIN_BALANCE: string;
}

interface Biometric {
  RESIDENTS_API_KEY: string;
  NON_RESIDENTS_API_KEY: string;
  DOMAIN_API: string;
}

interface TelegramProvider {
  BOT_TOKEN: string;
}

export interface ConfigInterface {
  APP: AppConfig;
  DATABASE: DatabaseConfig;
  API: ApiConfig;
  ENCRYPTION: EncryptionConfig;
  YANDEX_PLACES: YandexPlaces;
  OPEN_AI: OpenAI;
  SMS_PROVIDER: SmsProvider;
  BIOMETRIC: Biometric;
  TELEGRAM: TelegramProvider;
}

const isDevEnvironment = (nodeEnv = ''): boolean =>
  nodeEnv === AppEnvironment.DEVELOPMENT;

const configuration = (): ConfigInterface => {
  config();

  const {
    NODE_ENV,
    API_PROTOCOL,
    HOST,
    PORT,
    DATABASE_URL,
    API_BASE_PREFIX,
    YANDEX_PLACES_API_KEY,
    UNAUTHORIZED_USER_ID,
    TESTS_USER_PHONE,
    OPENAI_API_KEY,
    OPENAI_API_CHAT_MODEL,
    SMS_PROVIDER_API_KEY,
    SMS_PROVIDER_DOMAIN_API,
    SMS_MIN_BALANCE,
    BIOMETRIC_RESIDENTS_API_KEY,
    BIOMETRIC_NON_RESIDENTS_API_KEY,
    BIOMETRIC_DOMAIN_API,
    TELEGRAM_BOT_TOKEN,
  } = process.env;

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
      DI_CONTAINER_MODULES_PATHS: [
        __dirname + '/../core/**/*-container-module' + extension,
        __dirname + '/../primary-adapters/**/*-container-module' + extension,
        __dirname + '/../secondary-adapters/**/*-container-module' + extension,
      ],
      UNAUTHORIZED_USER_ID: UNAUTHORIZED_USER_ID || '',
      TESTS_USER_PHONE: TESTS_USER_PHONE || '',
    },
    DATABASE: {
      DATABASE_URL: DATABASE_URL || '',
    },
    API: {
      PREFIX: API_BASE_PREFIX || '',
    },
    ENCRYPTION: getEncryptionConfig(),
    YANDEX_PLACES: { API_KEY: YANDEX_PLACES_API_KEY || '' },
    OPEN_AI: {
      API_KEY: OPENAI_API_KEY || '',
      CHAT_MODEL: OPENAI_API_CHAT_MODEL || '',
    },
    SMS_PROVIDER: {
      API_KEY: SMS_PROVIDER_API_KEY || '',
      DOMAIN_API: SMS_PROVIDER_DOMAIN_API || '',
      MIN_BALANCE: SMS_MIN_BALANCE || '100',
    },
    BIOMETRIC: {
      RESIDENTS_API_KEY: BIOMETRIC_RESIDENTS_API_KEY || '',
      NON_RESIDENTS_API_KEY: BIOMETRIC_NON_RESIDENTS_API_KEY || '',
      DOMAIN_API: BIOMETRIC_DOMAIN_API || '',
    },
    TELEGRAM: {
      BOT_TOKEN: TELEGRAM_BOT_TOKEN || '',
    },
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
    REFRESH_LIFETIME: REFRESH_LIFETIME || encryptionConfigDefault.REFRESH_LIFETIME,
    ACCESS_TOKEN_LIFETIME:
      ACCESS_TOKEN_LIFETIME || encryptionConfigDefault.ACCESS_TOKEN_LIFETIME,
    RESET_PASSWORD_TOKEN_LIFETIME:
      RESET_PASSWORD_TOKEN_LIFETIME ||
      encryptionConfigDefault.RESET_PASSWORD_TOKEN_LIFETIME,
    VERIFICATION_TOKEN_LIFETIME:
      VERIFICATION_TOKEN_LIFETIME || encryptionConfigDefault.VERIFICATION_TOKEN_LIFETIME,
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
