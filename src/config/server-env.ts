type EnvKey =
  | 'MONGODB_URI'
  | 'NEXTAUTH_URL'
  | 'NEXTAUTH_SECRET'
  | 'GOOGLE_CLIENT_ID'
  | 'GOOGLE_CLIENT_SECRET'
  | 'AI_URL'
  | 'GENIE_API_URL'
  | 'GENIE_API_KEY'
  | 'SMTP_HOST'
  | 'SMTP_PORT'
  | 'SMTP_USER'
  | 'SMTP_PASS'
  | 'SMTP_SECURE';

const FALLBACKS: Record<EnvKey, string | undefined> = {
  // Populate these with your known keys so the app can run without a .env file.
  MONGODB_URI: 'mongodb://localhost:27017/digitalcv',
  NEXTAUTH_URL: 'http://localhost:3000',
  NEXTAUTH_SECRET: 'your-secret-key-here',
  GOOGLE_CLIENT_ID: '123',
  GOOGLE_CLIENT_SECRET: '123',
  AI_URL: 'http://123:123',
  GENIE_API_URL: 'https://api.uat.geniebiz.lk/public/v2/transactions',
  GENIE_API_KEY:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjM2YmFmY2U3LWEyMDEtNDI5Yi1hOWUyLWM1Yjc4NTQ2Njc3YyIsImNvbXBhbnlJZCI6IjYzOTdmMzlkZjA3ZmJhMDAwODQyYTkwYiIsImlhdCI6MTY3MDkwMjY4NSwiZXhwIjo0ODI2NTc2Mjg1fQ.fy12dgFhA3iB_RCjD7y8j5HClNRZUiBZgAg-QzFpxaE',
  SMTP_HOST: 'mail.digitalcv.lk',
  SMTP_PORT: '587',
  SMTP_USER: 'support@digitalcv.lk',
  SMTP_PASS: 'YOUR_EMAIL_PASSWORD',
  SMTP_SECURE: "false",
};

const readKey = (key: EnvKey) => {
  const value = process.env[key] ?? FALLBACKS[key];
  if (!value) {
    throw new Error(`Missing configuration for ${key}. Set the environment variable or update FALLBACKS.`);
  }
  return value;
};

export const serverEnv = {
  mongodbUri: readKey('MONGODB_URI'),
  nextAuthUrl: readKey('NEXTAUTH_URL'),
  nextAuthSecret: readKey('NEXTAUTH_SECRET'),
  googleClientId: readKey('GOOGLE_CLIENT_ID'),
  googleClientSecret: readKey('GOOGLE_CLIENT_SECRET'),
  aiUrl: readKey('AI_URL'),
  genieApiUrl: readKey('GENIE_API_URL'),
  genieApiKey: readKey('GENIE_API_KEY'),
  smtpHost: readKey("SMTP_HOST"),
  smtpPort: readKey("SMTP_PORT"),
  smtpUser: readKey("SMTP_USER"),
  smtpPass: readKey("SMTP_PASS"),
  smtpSecure: readKey("SMTP_SECURE")
};
