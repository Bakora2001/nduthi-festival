import dotenv from 'dotenv';

dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    console.warn(`[env] Missing environment variable: ${name}`);
    return '';
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  databaseUrl: required('DATABASE_URL'),

  jwt: {
    accessSecret: required('JWT_ACCESS_SECRET', 'dev_access_secret'),
    refreshSecret: required('JWT_REFRESH_SECRET', 'dev_refresh_secret'),
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  kopokopo: {
    baseUrl: process.env.KOPOKOPO_BASE_URL || 'https://api.kopokopo.com',
    clientId: required('KOPOKOPO_CLIENT_ID'),
    clientSecret: required('KOPOKOPO_CLIENT_SECRET'),
    apiKey: required('KOPOKOPO_API_KEY'),
    tillNumber: process.env.KOPOKOPO_TILL_NUMBER || '4681183',
    callbackUrl: process.env.KOPOKOPO_CALLBACK_URL || 'https://nduthi-festival.onrender.com/api/payments/kopokopo/callback',
  },

  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.EMAIL_FROM || 'Nduthi Festival & Awards Kenya <nduthifestivalkenya@gmail.com>',
  },

  adminEmail: process.env.ADMIN_EMAIL || 'nduthifestivalkenya@gmail.com',

  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 500,
  },
};
